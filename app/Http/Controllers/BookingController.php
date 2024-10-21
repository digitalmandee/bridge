<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function index()
    {
        return view('admin.booking.index');
    }

    public function BookingCreate()
    {
        return view('admin.booking.create');
    }
}
