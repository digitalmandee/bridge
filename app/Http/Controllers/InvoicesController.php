<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\BookingInvoice;
use App\Models\Chair;
use App\Models\Invoice;
use App\Models\User;
use App\Notifications\GeneralNotification;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class InvoicesController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        $limit = $request->input('limit', 10); // Default limit
        $status = $request->input('status'); // Get status filter

        $branchId = $user->type == 'admin' ? $user->branch->id : $user->created_by_branch_id;

        $query = Invoice::with('user')->where('branch_id', $branchId);

        if ($user->type !== 'admin') {
            $query->where('user_id', $user->id);
        }

        if ($status) {
            $query->where('status', strtolower($status));
        }

        $invoices = $query->orderBy('created_at', 'desc')->paginate($limit);

        return response()->json(['success' => true, 'invoices' => $invoices]);
    }

    public function dashboard()
    {
        $user = auth()->user();

        // Base query
        $query = Invoice::where('branch_id', $user->branch->id);

        if ($user->type !== 'admin') {
            $query = Invoice::where('user_id', $user->id);
        }

        // Clone the query before modifying it for each count
        $totalInvoices = (clone $query)->count(); // Count all invoices
        $totalPaid = (clone $query)->where('status', 'paid')->count(); // Count paid invoices
        $totalOverdue = (clone $query)->where('status', 'overdue')->count(); // Count overdue invoices
        $totalPayment = (clone $query)->sum('amount'); // Sum of all payments

        return response()->json(['success' => true, 'totalInvoices' => $totalInvoices, 'totalPaid' => $totalPaid, 'totalOverdue' => $totalOverdue, 'totalPayment' => $totalPayment]);
    }

    public function customerDetail(Request $request, $id)
    {
        $branchId = auth()->user()->branch->id;
        $limit = $request->input('limit', 10); // Default limit

        $customer = User::where('id', $id)->where('created_by_branch_id', $branchId)->with(['invoices' => function ($query) use ($limit) {
            $query->orderBy('created_at', 'desc')->paginate($limit);
        }])->select('id', 'name', 'email', 'type', 'profile_image', 'phone_no')->firstOrFail();

        return response()->json(['success' => true, 'costomer' => $customer]);
    }

    public function update(Request $request)
    {

        $invoice = BookingInvoice::find($request->invoice_id);

        if (!$invoice) {
            return response()->json(['success' => false, 'message' => 'Invoice not found or not match with user',], 404);
        }

        $invoice->update([
            'amount' => $request->amount,
            'status' => $request->status,
            'paid_date' => $request->paid_date,
        ]);

        return response()->json(['success' => true, 'message' => 'Invoice updated successfully']);
    }

    public function store(Request $request)
    {
        // Validate request
        $validator = Validator::make($request->all(), [
            'invoiceType'  => 'required|string',
            'dueDate'      => 'required|date',
            'company_id'   => 'nullable|required_if:selectedTab,company',
            'member_id'    => 'nullable|required_if:selectedTab,individual',
            'quantity'     => 'nullable|required_if:invoiceType,Printing Papers|numeric',
            'hours'        => 'nullable|required_if:invoiceType,Meeting Rooms|numeric',
            'amount'       => 'required_unless:invoiceType,Monthly|nullable|numeric',
            'status'       => 'required|string',
            'paymentType'  => 'nullable|required_unless:status,pending|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        try {
            $admin     = auth()->user();
            $bookingId = null;
            $bookingPlan = null;

            // Determine user ID based on selected tab
            $userId = $request->selectedTab === 'individual' ? $request->member_id : $request->company_id;

            if ($request->invoiceType === 'Monthly') {
                $invoice = Invoice::where('user_id', $userId)->where('paid_month', $request->paidMonth)->where('paid_year', $request->paidYear)->where('status', 'paid')->where('invoice_type', 'Monthly')->first();

                if ($invoice) {
                    return response()->json(['success' => false, 'message' => 'This month invoice already paid'], 422);
                }
            }

            // Handle receipt upload
            $InvoiceReciept = $request->hasFile('reciept') && in_array($request->status, ['paid', 'overdue'])
                ? $request->file('reciept')->store('invoices', 'public')
                : null;

            if ($request->invoiceType === 'Monthly') {
                // Fetch latest confirmed booking
                $booking = Booking::where('user_id', $userId)->where('duration', 'monthly')->whereNotIn('status', ['pending', 'rejected', 'upcoming'])->latest()->first();

                if (!$booking) {
                    return response()->json(['success' => false, 'message' => 'Booking not found.'], 400);
                }

                $bookingPlan = $booking->plan;

                $isCurrentMonth = $request->paidMonth === Carbon::now()->format('F') && $request->paidYear == Carbon::now()->year;

                $packageEndTime = Carbon::createFromDate($request->paidYear, date('m', strtotime($request->paidMonth)), 1)->endOfMonth();
                Log::info($packageEndTime);

                if ($booking->status !== 'confirmed') {
                    $newBookingData = $booking->only(['user_id', 'branch_id', 'floor_id', 'plan_id', 'chair_ids', 'name', 'phone_no', 'type', 'duration', 'time_slot', 'plan']);
                    $newBookingData += [
                        'start_date'  => Carbon::createFromDate($request->paidYear, $request->paidMonth, 1)->format('Y-m-d'),
                        'start_time'  => Carbon::createFromDate($request->paidYear, $request->paidMonth, 1)->format('H:i:s'),
                        'end_date'    => null,
                        'end_time'    => null,
                        'status'      => (
                            in_array($request->status, ['paid', 'overdue'])
                            && $isCurrentMonth
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

                    // If paid/overdue and for the current month, update chair booking
                    if (in_array($request->status, ['paid', 'overdue']) && $isCurrentMonth) {
                        $this->updateChairBooking($newBooking);
                        $this->updateUserQuota($newBooking);
                    }
                } elseif ($booking->status === 'confirmed' && in_array($request->status, ['paid', 'overdue']) && $isCurrentMonth) {
                    // Update confirmed booking
                    $bookingId = $booking->id;
                    $booking->update([
                        'total_price'       => $request->amount,
                        'package_detail'    => $request->packageDetail,
                        'package_end_time'  => $packageEndTime,
                        'payment_method' => $request->paymentType,
                        'reciept' => $InvoiceReciept
                    ]);

                    $this->updateUserQuota($booking);
                }
            }

            // Create invoice
            $invoice = Invoice::create([
                'branch_id'   => $admin->branch->id,
                'user_id'     => $userId,
                'booking_id'  => $request->invoiceType === 'Monthly' ? $bookingId : null,
                'plan'        => $bookingPlan,
                'invoice_type' => $request->invoiceType,
                'due_date'    => $request->dueDate,
                'quantity'    => $request->quantity,
                'hours'       => $request->hours,
                'status'      => $request->status,
                'paid_date'   => in_array($request->status, ['paid', 'overdue']) ? $request->paidDate : null,
                'paid_month'  => $request->paidMonth,
                'paid_year'   => $request->paidYear,
                'amount'      => $request->amount,
                'payment_type' => $request->paymentType,
                'receipt'     => $InvoiceReciept,
            ]);

            // Update user quotas based on invoice type
            $this->updateUserQuotaByInvoice($invoice);

            // Notify user & admin
            $this->sendNotifications($admin, $invoice);

            return response()->json(['success' => true, 'message' => 'Invoice created successfully', 'invoice' => $invoice]);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'error' => $th->getMessage()], 500);
        }
    }

    /**
     * Update user quota based on invoice type
     */
    private function updateUserQuotaByInvoice($invoice)
    {
        $user = User::find($invoice->user_id);

        if (!$user) return;

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
     *  Update user quota based on confirmed monthly invoice
     * */
    private function updateUserQuota($booking)
    {
        $totalChairs = count($booking->chair_ids);
        $bookingUser = User::find($booking->user_id);

        $bookingUser->increment('booking_quota', $totalChairs * 20);
        $bookingUser->increment('total_booking_quota', $totalChairs * 20);
        $bookingUser->increment('printing_quota', $totalChairs * 100);
        $bookingUser->increment('total_printing_quota', $totalChairs * 100);
    }

    /**
     * Update chair booking for a new confirmed monthly invoice
     */
    private function updateChairBooking($booking)
    {
        foreach ($booking->chair_ids as $chairId) {
            $chair = Chair::find($chairId);

            if (!$chair) continue;

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
    private function sendNotifications($admin, $invoice)
    {
        $user = User::find($invoice->user_id);

        if (!$user) return;

        // Notify user
        $user->notify(new GeneralNotification([
            'title'     => "Invoice Created - {$admin->branch->name}",
            'message'   => "Your invoice #{$invoice->id} for {$invoice->invoice_type} is due on {$invoice->due_date}.",
            'type'      => 'invoice_created',
            'invoice_id' => $invoice->id,
            'status'    => $invoice->status,
        ]));

        // Notify admin
        $admin->notify(new GeneralNotification([
            'title'     => "Invoice Created - User: {$user->name}",
            'message'   => "An invoice (#{$invoice->id}) has been created for User ID {$user->id}.",
            'type'      => 'invoice_created',
            'invoice_id' => $invoice->id,
            'created_by' => $admin->branch->name,
        ]));
    }

    /**
     * Get color based on duration
     *  */
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
                'unavailable_chairs' => $unavailableChairs,
                'booking' => $latestBooking
            ]);
        }

        // If all chairs are available, return success with booking info
        return response()->json([
            'success' => true,
            'message' => 'Chairs are available for booking.',
            'booking' => $latestBooking
        ]);
    }
}