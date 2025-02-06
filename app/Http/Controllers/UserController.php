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

            $bookingSchedules = $user->bookingSchedules()->with(['floor:id,name', 'room:id,name'])->latest()->take(10)->get();

            $totalAmount = $user->invoices()->sum('amount');

            $overDueAmount = $user->invoices()->where('status', 'overdue')->sum('amount');

            return response()->json([
                'success' => true,
                'user' => $user,
                'bookingSchedules' => $bookingSchedules,
                'totalAmount' => $totalAmount,
                'overDueAmount' => $overDueAmount,
                'totalBookings' => $user->total_booking_quota,
                'remainingbookings' => $user->booking_quota,
                'totalPrintingPapers' => $user->total_printing_quota,
                'remainingPrintingPapers' => $user->printing_quota,
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