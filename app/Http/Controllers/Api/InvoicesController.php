<?php

namespace App\Http\Controllers\Api;

use App\Helpers\FileHelper;
use App\Helpers\MailHelper;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Chair;
use App\Models\Invoice;
use App\Models\User;
use App\Notifications\GeneralNotification;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class InvoicesController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        $limit = $request->input('limit', 10);
        $status = $request->input('status');
        $search = $request->input('search');
        $fromDate = $request->input('from_date');  // New date filter

        $query = Invoice::with('user');

        if ($user->type !== 'admin') {
            $query->where('user_id', $user->id);
        }

        if ($status) {
            $query->where('status', strtolower($status));
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q
                    ->where('id', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('name', 'like', "%{$search}%");
                    });
            });
        }

        if ($fromDate) {
            $query->whereDate('paid_date', $fromDate);
        }

        $invoices = $query->orderBy('created_at', 'desc')->paginate($limit);

        return response()->json(['success' => true, 'invoices' => $invoices]);
    }

    public function dashboard()
    {
        $user = auth()->user();
        $userId = $user->id;

        // Base query
        $query = Invoice::all();

        if ($user->type !== 'admin') {
            $query = Invoice::where('user_id', $user->id);
        }

        // Clone the query before modifying it for each count
        $totalInvoices = (clone $query)->count();  // Count all invoices
        $totalPaid = (clone $query)->where('status', 'paid')->count();  // Count paid invoices
        $totalOverdue = (clone $query)->where('status', 'overdue')->count();  // Count overdue invoices
        $totalPayment = (clone $query)->sum('amount');  // Sum of all payments

        return response()->json(['success' => true, 'totalInvoices' => $totalInvoices, 'totalPaid' => $totalPaid, 'totalOverdue' => $totalOverdue, 'totalPayment' => $totalPayment]);
    }

    public function customerDetail(Request $request, $id)
    {
        $limit = $request->input('limit', 10);  // Default limit

        $customer = User::where('id', $id)->with(['invoices' => function ($query) use ($limit) {
            $query->orderBy('created_at', 'desc')->paginate($limit);
        }])->select('id', 'name', 'email', 'type', 'profile_image', 'phone_no')->firstOrFail();

        return response()->json(['success' => true, 'customer' => $customer]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'invoiceType' => 'required|string',
            'dueDate' => 'required|date',
            'company_id' => 'nullable|required_if:selectedTab,company',
            'member_id' => 'nullable|required_if:selectedTab,individual',
            'quantity' => 'nullable|required_if:invoiceType,Printing Papers|numeric',
            'hours' => 'nullable|required_if:invoiceType,Meeting Rooms|numeric',
            'amount' => 'required_unless:invoiceType,Monthly|nullable|numeric',
            'status' => 'required|string',
            'paymentType' => 'nullable|required_unless:status,pending|string',
            // 'paidMonth' => 'required_if:invoiceType,Monthly|array',
            // 'paidYear' => 'required_if:invoiceType,Monthly|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        try {
            $admin = auth()->user();
            $userId = $request->selectedTab === 'individual' ? $request->member_id : $request->company_id;

            // Check if any of the months were already paid
            if ($request->invoiceType === 'Monthly') {
                $alreadyPaid = Invoice::where('user_id', $userId)
                    ->where('invoice_type', 'Monthly')
                    ->where('paid_year', $request->paidYear)
                    ->where(function ($query) use ($request) {
                        foreach ($request->paidMonth as $month) {
                            $query->orWhereJsonContains('paid_month', $month);
                        }
                    })
                    ->where('status', 'paid')
                    ->exists();

                if ($alreadyPaid) {
                    return response()->json(['success' => false, 'message' => 'One or more months already have paid invoices.'], 422);
                }
            }

            // Handle receipt upload
            $InvoiceReciept = $request->hasFile('reciept') && in_array($request->status, ['paid', 'overdue'])
                ? FileHelper::saveImage($request->file('reciept'), 'invoices')
                : null;

            $bookingId = null;
            $bookingPlan = null;

            if ($request->invoiceType === 'Monthly') {
                $booking = Booking::where('user_id', $userId)
                    ->where('duration', 'monthly')
                    ->whereNotIn('status', ['pending', 'rejected', 'upcoming'])
                    ->latest()
                    ->first();

                if (!$booking) {
                    return response()->json(['success' => false, 'message' => 'Booking not found.'], 400);
                }

                $bookingId = $booking->id;

                $bookingPlan = $booking->plan;

                $currentMonth = Carbon::now()->format('F');
                $currentYear = Carbon::now()->year;

                $isCurrentMonth = in_array($currentMonth, $request->paidMonth) && $request->paidYear == $currentYear;

                $paidMonths = $request->paidMonth;
                $lastMonth = end($paidMonths);

                $packageEndTime = Carbon::createFromDate($request->paidYear, date('m', strtotime($lastMonth)), 1)->endOfMonth();

                if ($booking->status !== 'confirmed') {
                    $newBookingData = $booking->only(['user_id', 'floor_id', 'plan_id', 'chair_ids', 'name', 'phone_no', 'type', 'duration', 'time_slot', 'plan']);
                    $newBookingData += [
                        'start_date' => Carbon::createFromDate($request->paidYear, date('m', strtotime($request->paidMonth[0])), 1)->format('Y-m-d'),
                        'start_time' => Carbon::createFromDate($request->paidYear, date('m', strtotime($request->paidMonth[0])), 1)->format('H:i:s'),
                        'end_date' => null,
                        'end_time' => null,
                        'status' => (
                            in_array($request->status, ['paid', 'overdue']) && $isCurrentMonth
                                ? 'confirmed'
                                : ($request->status === 'pending' ? 'pending' : 'upcoming')
                        ),
                        'total_price' => $request->amount,
                        'package_detail' => $request->packageDetail,
                        'package_end_time' => $packageEndTime,
                        'payment_method' => $request->paymentType,
                        'reciept' => $InvoiceReciept
                    ];

                    $newBooking = Booking::create($newBookingData);
                    $bookingId = $newBooking->id;

                    if (in_array($request->status, ['paid', 'overdue']) && $isCurrentMonth) {
                        $this->updateChairBooking($newBooking);
                        $this->updateUserQuota($newBooking);
                    }
                } elseif ($booking->status === 'confirmed' && in_array($request->status, ['paid', 'overdue']) && $isCurrentMonth) {
                    $bookingId = $booking->id;
                    $booking->update([
                        'total_price' => $request->amount,
                        'package_detail' => $request->packageDetail,
                        'package_end_time' => $packageEndTime,
                        'payment_method' => $request->paymentType,
                        'reciept' => $InvoiceReciept
                    ]);

                    $this->updateUserQuota($booking);
                }
            }

            // Create single invoice
            $invoice = Invoice::create([
                'user_id' => $userId,
                'booking_id' => $request->invoiceType === 'Monthly' ? $bookingId : null,
                'plan' => $bookingPlan,
                'invoice_type' => $request->invoiceType,
                'due_date' => $request->dueDate,
                'quantity' => $request->quantity,
                'hours' => $request->hours,
                'status' => $request->status,
                'paid_date' => in_array($request->status, ['paid', 'overdue']) ? $request->paidDate : null,
                'paid_month' => $request->paidMonth,
                'paid_year' => $request->paidYear,
                'discount' => $request->discount ?? 0,
                'amount' => $request->amount,
                'payment_type' => $request->paymentType,
                'receipt' => $InvoiceReciept,
            ]);
            $user = User::find($invoice->user_id);
            // send invoice email by usama

            MailHelper::sendInvoiceMail($user->email, [
                'user' => $user,
                'invoice_id' => $invoice->id,
                'invoice' => $invoice,
                'invoiceType' => $request->invoiceType,
                'amount' => $request->amount,
                'dueDate' => $request->dueDate,
                'status' => $request->status,
            ]);

            if (in_array($request->invoiceType, ['Meeting Rooms', 'Printing Papers'])) {
                $this->updateUserQuotaByInvoice($invoice);
            }
            $this->sendNotifications($admin, $invoice, 'Created');

            return response()->json(['success' => true, 'message' => 'Invoice created successfully', 'invoice' => $invoice]);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'error' => $th->getMessage()], 500);
        }
    }

    public function update(Request $request)
    {
        $validatedData = $request->validate([
            'invoice_id' => 'required|exists:invoices,id',
            'status' => 'required|string',
            'due_date' => 'required|date',
            'paid_date' => 'required_if:status,paid,overdue|date',
            'payment_type' => 'required_if:status,paid,overdue|string',
            'paidMonth' => 'nullable|array',
            'paidYear' => 'nullable|integer',
        ]);

        $admin = auth()->user();

        $invoice = Invoice::find($validatedData['invoice_id']);

        if (!$invoice) {
            return response()->json(['success' => false, 'message' => 'Invoice not found or does not match with user'], 404);
        }

        // Handle receipt upload if status is paid/overdue
        $invoiceReceipt = $request->hasFile('receipt') && in_array($validatedData['status'], ['paid', 'overdue'])
            ? FileHelper::saveImage($request->file('receipt'), 'invoices')
            : $invoice->receipt;

        // Extract the last paid month if it's an array
        $paidMonths = $request->paidMonth ?? [$invoice->paid_month];
        $lastMonth = end($paidMonths);

        $invoice->update([
            'status' => $validatedData['status'],
            'due_date' => $validatedData['due_date'],
            'paid_date' => in_array($validatedData['status'], ['paid', 'overdue']) ? $validatedData['paid_date'] : $invoice->paid_date,
            'payment_type' => in_array($validatedData['status'], ['paid', 'overdue']) ? $validatedData['payment_type'] : $invoice->payment_type,
            'receipt' => $invoiceReceipt,
            'paid_month' => $lastMonth,
            'paid_year' => $request->paidYear ?? $invoice->paid_year,
        ]);

        // Only update quotas if latest month is current
        $isCurrentMonth = $lastMonth === Carbon::now()->format('F') && ($request->paidYear ?? $invoice->paid_year) == Carbon::now()->year;

        if ($isCurrentMonth && in_array($invoice->invoice_type, ['Meeting Rooms', 'Printing Papers'])) {
            $this->updateUserQuotaByInvoice($invoice);
        }

        $this->sendNotifications($admin, $invoice, 'Updated');

        return response()->json(['success' => true, 'message' => 'Invoice updated successfully']);
    }

    /**
     * Update user quota based on invoice type
     */
    private function updateUserQuotaByInvoice($invoice)
    {
        $user = User::find($invoice->user_id);

        if (!$user)
            return;

        if (in_array($invoice->status, ['paid', 'overdue'])) {
            if ($invoice->invoice_type === 'Printing Papers') {
                $user->increment('printing_quota', $invoice->quantity);
                $user->increment('total_printing_quota', $invoice->quantity);
            } elseif ($invoice->invoice_type === 'Meeting Rooms') {
                $user->increment('booking_quota', $invoice->hours);
                $user->increment('total_booking_quota', $invoice->hours);
            }
        }
        $user->save();
    }

    /**
     * Update user quota based on confirmed monthly invoice
     */
    private function updateUserQuota($booking)
    {
        $totalChairs = count($booking->chair_ids);
        $user = User::find($booking->user_id);

        if ($booking->duration == 'monthly') {
            $user->increment('booking_quota', $totalChairs * $booking->plan['booking_hours']);
            $user->increment('total_booking_quota', $totalChairs * $booking->plan['booking_hours']);
            $user->increment('printing_quota', $totalChairs * $booking->plan['printing_hours']);
            $user->increment('total_printing_quota', $totalChairs * $booking->plan['printing_hours']);
        }
    }

    /**
     * Update chair booking for a new confirmed monthly invoice
     */
    private function updateChairBooking($booking)
    {
        foreach ($booking->chair_ids as $chairId) {
            $chair = Chair::find($chairId);

            if (!$chair)
                continue;

            if ($chair->time_slot === $booking->time_slot) {
                return response()->json([
                    'success' => false,
                    'message' => "Floor {$booking->floor->name} Chair {$chair->table->name}{$chair->id} is already assigned to the same time slot"
                ], 400);
            }

            if ($chair->time_slot === 'available') {
                $chair->time_slot = $booking->time_slot;
            } elseif (
                ($chair->time_slot === 'day' && $booking->time_slot === 'night') ||
                ($chair->time_slot === 'night' && $booking->time_slot === 'day')
            ) {
                $chair->time_slot = 'full_day';
            }

            $chair->color = $this->getColorBasedOnDuration($chair->time_slot);
            $chair->save();
        }
    }

    /**
     * Send invoice notifications to user & admin
     */
    private function sendNotifications($admin, $invoice, $type)
    {
        $user = User::find($invoice->user_id);

        if (!$user)
            return;

        // Notify user
        $user->notify(new GeneralNotification([
            'title' => "Invoice $type - " . tenant('name'),
            'message' => "Your invoice #{$invoice->id} for {$invoice->invoice_type} is due on {$invoice->due_date}.",
            'type' => 'invoice',
            'invoice_id' => $invoice->id,
            'status' => $invoice->status,
        ]));

        // Notify admin
        $admin->notify(new GeneralNotification([
            'title' => "Invoice $type - User: {$user->name}",
            'message' => "An invoice (#{$invoice->id}) has been $type for User ID {$user->id}.",
            'type' => 'invoice',
            'invoice_id' => $invoice->id,
            'created_by' => tenant('name'),
        ]));
    }

    /**
     * Get color based on duration
     */
    private function getColorBasedOnDuration($duration)
    {
        // Set color based on duration
        switch ($duration) {
            case 'day':
                return '#F59E0B';
            case 'night':
                return '#6366F1';
            case 'full_day':
                return 'green';
            default:
                return 'gray';
        }
    }

    public function userBooking(Request $request)
    {
        $userId = $request->user_id;

        // Retrieve the latest booking for the user
        $latestBooking = Booking::where(['user_id' => $userId, 'duration' => 'monthly'])->whereNotIn('status', ['pending', 'rejected', 'upcoming'])->latest()->first();

        if (!$latestBooking) {
            return response()->json(['success' => false, 'message' => 'No booking found'], 400);
        }

        $PayedMonthsRaw = Invoice::where([
            'booking_id' => $latestBooking->id,
            'status' => 'paid',
            'invoice_type' => 'Monthly',
            'paid_year' => date('Y')
        ])->pluck('paid_month');

        $PayedMonths = collect($PayedMonthsRaw)->map(fn($months) => is_array($months) ? $months : json_decode($months, true))->flatten()->unique()->values()->toArray();

        $unavailableChairs = [];
        $availableChairs = [];
        $chairs = [];

        // Fetch all chairs related to the latest booking
        foreach ($latestBooking->chair_ids as $chairId) {
            $chair = Chair::find($chairId);

            if (!$chair) {
                continue;
            }

            if ($latestBooking->status !== 'confirmed') {
                // Check for booking conflicts
                if ($latestBooking->time_slot === 'full_day' && in_array($chair->time_slot, ['day', 'night'])) {
                    $unavailableChairs[] = "{$chair->table->table_id}{$chair->id}";
                } elseif (in_array($latestBooking->time_slot, ['day', 'night']) && $chair->time_slot === 'full_day') {
                    $unavailableChairs[] = "{$chair->table->table_id}{$chair->id}";
                } elseif ($chair->time_slot === $latestBooking->time_slot) {
                    $unavailableChairs[] = "{$chair->table->table_id}{$chair->id}";
                }
            } else {
                $availableChairs[] = "{$chair->table->table_id}{$chair->id}";
            }

            $chairs[] = "{$chair->table->table_id}{$chair->id}";
        }

        $latestBooking->chairs = $chairs;

        // If some chairs are unavailable, return that message
        if (!empty($unavailableChairs)) {
            return response()->json([
                'success' => false,
                'message' => 'Chairs are not available for booking.',
                'payed_months' => $PayedMonths,
                'unavailable_chairs' => $unavailableChairs,
                'booking' => $latestBooking
            ]);
        }

        // If all chairs are available, return success with booking info
        return response()->json([
            'success' => true,
            'message' => 'Chairs are available for booking.',
            'payed_months' => $PayedMonths,
            'booking' => $latestBooking
        ]);
    }
}