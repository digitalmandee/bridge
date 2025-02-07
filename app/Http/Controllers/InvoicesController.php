<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\BookingInvoice;
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
        // Validate the request
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
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $selectedPlan = json_decode($request->plan, true);

        try {
            $admin = auth()->user();
            $booking = null;

            $userId = $request->selectedTab == 'individual' ? $request->member_id : $request->company_id;

            // Check if it's a Monthly invoice, and fetch the related booking
            // if ($request->invoiceType == 'Monthly') {
            //     $booking = Booking::where('user_id', $userId)->first();
            // }

            // Create the invoice
            $invoice = new Invoice();
            $invoice->branch_id = $admin->branch->id;
            $invoice->user_id = $userId;

            if ($request->invoiceType === 'Monthly') {
                // $invoice->booking_id = $booking->id;
                $invoice->plan = ["id" => $selectedPlan['id'], "name" => $selectedPlan['name'], "price" => $selectedPlan['price']];
            }

            $invoice->invoice_type = $request->invoiceType;
            $invoice->due_date = $request->dueDate ? $request->dueDate : null;
            $invoice->quantity = $request->quantity;
            $invoice->hours = $request->hours;
            $invoice->status = $request->status;
            $invoice->paid_date = $request->paidDate && $request->status === 'paid' ? $request->paidDate : null;
            $invoice->paid_month = $request->paidMonth;
            $invoice->paid_year = $request->paidYear;
            $invoice->amount = $request->invoiceType === 'Monthly' ? $selectedPlan['price'] : $request->amount;
            $invoice->payment_type = $request->paymentType;

            // Store receipt if provided
            if ($request->hasFile('reciept') && $request->status === 'paid') {
                $filePath = $request->file('reciept')->store('invoices', 'public');
                $invoice->receipt = $filePath;
            }

            // Save the invoice
            $invoice->save();

            $user = User::find($invoice->user_id);

            if ($request->invoiceType === 'Printing Papers' && $request->status === 'paid') {
                $user->printing_quota = $user->printing_quota + $request->quantity;
                $user->total_printing_quota = $user->total_printing_quota + $request->quantity;
            }
            if ($request->invoiceType === 'Meeting Rooms' && $request->status === 'paid') {
                $user->booking_quota = $user->booking_quota + $request->hours;
                $user->total_booking_quota = $user->total_booking_quota + $request->hours;
            }

            $user->save();


            // Notify the user about the created invoice
            $userNotificationData = [
                'title' => "Invoice Created - {$admin->branch->name}",
                'message' => "Your invoice #{$invoice->id} for {$invoice->invoice_type} has been created and is due on {$invoice->due_date}.",
                'type' => 'invoice_created',
                'invoice_id' => $invoice->id,
                'status' => $invoice->status,
            ];
            $user->notify(new GeneralNotification($userNotificationData));

            // Notify the admin about the created invoice
            $adminNotificationData = [
                'title' => "Invoice Created - User: {$user->name}",
                'message' => "An invoice (#{$invoice->id}) has been created for User ID {$user->id} in {$admin->branch->name}.",
                'type' => 'invoice_created',
                'invoice_id' => $invoice->id,
                'created_by' => $admin->branch->name,
            ];
            $admin->notify(new GeneralNotification($adminNotificationData));

            return response()->json(['success' => true, 'message' => 'Invoice created successfully', 'invoice' => $invoice]);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'error' => $th->getMessage()], 500);
        }
    }
}
