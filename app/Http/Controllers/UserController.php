<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    //
    public function index()
    {
        try {
            $user = auth()->user();

            $bookingInvoices = $user->BookingInvoices()->with('user')->latest()->take(10)->get();

            $totalAmount = $user->BookingInvoices()->sum('amount');

            $overDueAmount = $user->BookingInvoices()->where('status', 'overdue')->sum('amount');

            return response()->json([
                'success' => true,
                'user' => $user,
                'bookingInvoices' => $bookingInvoices,
                'totalAmount' => $totalAmount,
                'overDueAmount' => $overDueAmount,
                'remainingbookings' => $user->booking_quota,
                'totalBookings' => $user->total_booking_quota
            ]);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'message' => $th->getMessage()]);
        }
    }

    public function getBookingUsers()
    {
        $user = auth()->user();
        $users = $user->type === 'user' ? [] : User::where('type', 'user')->get();

        return response()->json(['success' => true, 'users' => $users]);
    }
}
