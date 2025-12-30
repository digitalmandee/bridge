<?php

namespace App\Http\Controllers\Api;

use App\Helpers\FileHelper;
use App\Helpers\MailHelper;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Chair;
use App\Models\Invoice;
use App\Models\User;
use App\Models\UserAddon;
use App\Models\UserPackage;
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
        $fromDate = $request->input('from_date');
        $toDate = $request->input('to_date');

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

        if ($fromDate && $toDate) {
            $query->whereBetween('paid_date', [$fromDate, $toDate]);
        } elseif ($fromDate) {
            $query->whereDate('paid_date', '>=', $fromDate);
        } elseif ($toDate) {
            $query->whereDate('paid_date', '<=', $toDate);
        }

        $invoices = $query->orderBy('created_at', 'desc')->paginate($limit);

        return response()->json(['success' => true, 'invoices' => $invoices]);
    }

    public function dashboard(Request $request)
    {
        $user = auth()->user();
        $fromDate = $request->input('from_date');
        $toDate = $request->input('to_date');

        $query = Invoice::query();

        if ($user->type !== 'admin') {
            $query->where('user_id', $user->id);
        }

        if ($fromDate && $toDate) {
            $query->whereBetween('paid_date', [$fromDate, $toDate]);
        } elseif ($fromDate) {
            $query->whereDate('paid_date', '>=', $fromDate);
        } elseif ($toDate) {
            $query->whereDate('paid_date', '<=', $toDate);
        }

        $totalInvoices = (clone $query)->count();
        $totalPaid = (clone $query)->where('status', 'paid')->count();
        $totalOverdue = (clone $query)->where('status', 'overdue')->count();
        $totalPayment = (clone $query)->sum('amount');

        return response()->json([
            'success' => true,
            'totalInvoices' => $totalInvoices,
            'totalPaid' => $totalPaid,
            'totalOverdue' => $totalOverdue,
            'totalPayment' => $totalPayment
        ]);
    }

    public function customerDetail(Request $request, $id)
    {
        $limit = $request->input('limit', 10);
        $status = $request->input('status');
        $fromDate = $request->input('from_date');
        $toDate = $request->input('to_date');

        $customer = User::select('id', 'name', 'email', 'type', 'profile_image', 'phone_no')
            ->findOrFail($id);

        $invoicesQuery = Invoice::where('user_id', $id);

        if ($status) {
            $invoicesQuery->where('status', $status);
        }

        if ($fromDate && $toDate) {
            $invoicesQuery->whereBetween('paid_date', [$fromDate, $toDate]);
        } elseif ($fromDate) {
            $invoicesQuery->whereDate('paid_date', '>=', $fromDate);
        } elseif ($toDate) {
            $invoicesQuery->whereDate('paid_date', '<=', $toDate);
        }

        $invoices = $invoicesQuery->orderBy('created_at', 'desc')->paginate($limit);

        return response()->json([
            'success' => true,
            'customer' => $customer,
            'invoices' => $invoices->items(),
            'totalPages' => $invoices->lastPage(),
        ]);
    }

    public function viewInvoice($id)
    {
        $user = auth()->user();

        $invoice = Invoice::with([
            'user:id,name,email,phone_no,address',  // adjust according to your user table
            'booking:id,package_detail,start_date,end_date',  // adjust if booking relation exists
        ])->find($id);

        if (!$invoice) {
            return response()->json(['message' => 'Invoice not found'], 404);
        }

        // Authorization check: Admin can view all invoices, users/companies can only view their own
        if ($user->type !== 'admin' && $invoice->user_id !== $user->id) {
            return response()->json(['message' => 'Invoice not found'], 404);
        }

        return response()->json($invoice);
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
            'booking_id' => 'required_if:invoiceType,Monthly|integer|exists:bookings,id',
            'paidMonth' => 'required_if:invoiceType,Monthly|array',
            'paidYear' => 'required_if:invoiceType,Monthly|numeric',
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
                    ->where('booking_id', $request->booking_id)
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
                    return response()->json(['success' => false, 'message' => 'This month invoice already paid'], 422);
                }
            }

            // Handle receipt upload
            $InvoiceReciept = $request->hasFile('receipt') && in_array($request->status, ['paid', 'overdue'])
                ? FileHelper::saveImage($request->file('receipt'), 'invoices')
                : null;

            $bookingId = null;
            $bookingPlan = null;

            if ($request->invoiceType === 'Monthly') {
                $booking = Booking::where('id', $request->booking_id)
                    ->where('user_id', $userId)
                    ->where('duration', 'monthly')
                    ->whereNotIn('status', ['pending', 'rejected', 'upcoming'])
                    ->first();

                if (!$booking) {
                    return response()->json(['success' => false, 'message' => 'Selected booking not found or invalid.'], 400);
                }

                $bookingId = $booking->id;

                $bookingPlan = $booking->plan;

                $currentMonth = Carbon::now()->format('F');
                $currentYear = Carbon::now()->year;

                $isCurrentMonth = in_array($currentMonth, $request->paidMonth) && $request->paidYear == $currentYear;

                $paidMonths = $request->paidMonth;
                $lastMonth = end($paidMonths);

                $packageEndTime = Carbon::createFromDate($request->paidYear, date('m', strtotime($lastMonth)), 1)->endOfMonth();

                $admin = auth()->user();
                $user = User::find($userId);

                if ($booking->status !== 'confirmed') {
                    // Update booking status and details
                    $newStatus = in_array($request->status, ['paid', 'overdue']) && $isCurrentMonth
                        ? 'confirmed'
                        : ($request->status === 'pending' ? 'pending' : 'upcoming');

                    $booking->update([
                        'status' => $newStatus,
                        'total_price' => $request->amount,
                        'package_detail' => $request->packageDetail,
                        'package_end_time' => $packageEndTime,
                        'payment_method' => $request->paymentType,
                        'reciept' => $InvoiceReciept
                    ]);

                    // If booking is confirmed for the first time, create UserPackage and UserAddons
                    if ($newStatus === 'confirmed' && $booking->duration == 'monthly') {
                        $totalChairs = $booking->bookingChairs()->count();

                        // Create UserPackage
                        $userPackage = UserPackage::create([
                            'user_id' => $user->id,
                            'booking_plan_id' => $booking->plan_id,
                            'valid_from' => Carbon::parse($booking->start_date),
                            'valid_to' => Carbon::parse($packageEndTime),
                            'status' => 'active',
                            'created_by' => $admin->id,
                        ]);

                        // Attach package to booking
                        $booking->user_package_id = $userPackage->id;
                        $booking->save();

                        // Create Addons (booking hours)
                        UserAddon::create([
                            'user_package_id' => $userPackage->id,
                            'user_id' => $user->id,
                            'addon_type' => 'booking_hours',
                            'total' => $totalChairs * $booking->plan['booking_hours'],
                            'remaining' => $totalChairs * $booking->plan['booking_hours'],
                            'price' => 0,
                            'purchased_at' => Carbon::now(),
                            'created_by' => $admin->id,
                        ]);

                        // Create Addons (printing papers)
                        UserAddon::create([
                            'user_package_id' => $userPackage->id,
                            'user_id' => $user->id,
                            'addon_type' => 'printing_papers',
                            'total' => $totalChairs * $booking->plan['printing_papers'],
                            'remaining' => $totalChairs * $booking->plan['printing_papers'],
                            'price' => 0,
                            'purchased_at' => Carbon::now(),
                            'created_by' => $admin->id,
                        ]);

                        // Update user status to active
                        $user->status = 'active';
                        $user->save();
                    }

                    $bookingId = $booking->id;
                } else {
                    // Booking is already confirmed, just update details
                    $bookingId = $booking->id;
                    $booking->update([
                        'total_price' => $request->amount,
                        'package_detail' => $request->packageDetail,
                        'package_end_time' => $packageEndTime,
                        'payment_method' => $request->paymentType,
                        'reciept' => $InvoiceReciept
                    ]);
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
        if (in_array($invoice->status, ['paid', 'overdue'])) {
            if ($invoice->invoice_type === 'Printing Papers') {
                UserAddon::create([
                    'user_package_id' => null,  // standalone purchase
                    'user_id' => $invoice->user_id,
                    'addon_type' => 'printing_papers',
                    'total' => $invoice->quantity,
                    'remaining' => $invoice->quantity,
                    'price' => $invoice->amount,  // if applicable
                    'purchased_at' => now(),
                ]);
            } elseif ($invoice->invoice_type === 'Meeting Rooms') {
                UserAddon::create([
                    'user_package_id' => null,
                    'user_id' => $invoice->user_id,
                    'addon_type' => 'booking_hours',
                    'total' => $invoice->hours,
                    'remaining' => $invoice->hours,
                    'price' => $invoice->amount,
                    'purchased_at' => now(),
                ]);
            }
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
        $bookingId = $request->booking_id;  // Optional parameter to get specific booking

        if ($bookingId) {
            // Get specific booking if booking_id is provided
            $latestBooking = Booking::where(['id' => $bookingId, 'user_id' => $userId, 'duration' => 'monthly'])
                ->whereNotIn('status', ['pending', 'rejected', 'upcoming'])
                ->first();
        } else {
            // Get all active bookings for the user
            $activeBookings = Booking::where(['user_id' => $userId, 'duration' => 'monthly'])
                ->whereNotIn('status', ['pending', 'rejected', 'upcoming'])
                ->orderBy('created_at', 'desc')
                ->get();

            if ($activeBookings->isEmpty()) {
                return response()->json(['success' => false, 'message' => 'No booking found'], 400);
            }

            // Return list of active bookings for selection
            return response()->json([
                'success' => true,
                'message' => 'Active bookings found',
                'bookings' => $activeBookings->map(function ($booking) {
                    return [
                        'id' => $booking->id,
                        'start_date' => $booking->start_date,
                        'plan_name' => $booking->plan['name'] ?? 'N/A',
                        'total_price' => $booking->total_price,
                        'status' => $booking->status,
                        'package_end_time' => $booking->package_end_time
                    ];
                })
            ]);
        }

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
        // Get chair IDs from the booking_chairs relationship (new system) or chair_ids field (legacy)
        $chairIds = $latestBooking->bookingChairs()->pluck('chair_id')->toArray();
        if (empty($chairIds) && $latestBooking->chair_ids) {
            // Fallback to legacy chair_ids field if no booking chairs found
            $chairIds = $latestBooking->chair_ids;
        }

        foreach ($chairIds as $chairId) {
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
