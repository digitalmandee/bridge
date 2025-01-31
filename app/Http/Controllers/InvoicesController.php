<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\BookingInvoice;
use Illuminate\Http\Request;

class InvoicesController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        if ($user->type == 'admin') {
            $invoices = BookingInvoice::where('branch_id', $user->branch->id)
                ->with('user')
                ->orderBy('created_at', 'desc')
                ->get();
        } else {
            $invoices = BookingInvoice::where('user_id', $user->id)
                ->with('user')
                ->orderBy('created_at', 'desc')
                ->get();
        }

        return response()->json([
            'success' => true,
            'invoices' => $invoices
        ]);
    }

    public function update(Request $request)
    {

        $invoice = BookingInvoice::find($request->invoice_id);

        if (!$invoice) {
            return response()->json([
                'success' => false,
                'message' => 'Invoice not found or not match with user',
            ], 404);
        }

        $invoice->update([
            'amount' => $request->amount,
            'status' => $request->status,
            'paid_date' => $request->paid_date,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Invoice updated successfully',
        ]);
    }
}
