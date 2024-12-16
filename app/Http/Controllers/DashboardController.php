<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function dashboard()
    {
        return view('dashboard');
    }

    public function seatAllocation()
    {
        return view('admin.seat_allocation.index');
    }

    public function payment()
    {
        return view('admin.payment.index');
    }
}
