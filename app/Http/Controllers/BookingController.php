<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Branch;
use App\Models\Floor;
use App\Models\Room;
use App\Models\Table;
use App\Models\Chair;
use App\Models\Booking;
use Illuminate\Support\Facades\DB;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class BookingController extends Controller
{
    public function index()
    {
        return view('admin.booking.index');
    }

    public function storeUserDetails(Request $request)
    {

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required',
            'product' => 'required|string',
            'branch_id' => 'required|integer',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'time' => 'required|date_format:H:i',
            'duration' => 'required|string',
            'chair_id' => 'required',
            'floor_id' => 'required|integer',
            'card_number' => 'required|string',
            'expiration_date' => 'required|string',
            'cvv' => 'required|string',
            'save_card_details' => 'required|boolean',
            'receipt' => 'required|file|mimes:pdf,jpg,jpeg,png',
        ]);


        $chairIds = is_array($request->chair_id)
            ? $request->chair_id
            : (array) $request->chair_id;

        $filePath = null;
        if ($request->hasFile('receipt')) {
            $filePath = $request->file('receipt')->store('receipts', 'public');
        }
        $userId = Auth::id();

        $booking = Booking::create([
            'user_id' => $userId,
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'product' => $request->product,
            'branch_id' => $request->branch_id,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'time' => $request->time,
            'duration' => $request->duration,
            'chair_id' => json_encode($chairIds),
            'floor_id' => $request->floor_id,
            'card_number' => $request->card_number,
            'expiration_date' => $request->expiration_date,
            'cvv' => $request->cvv,
            'save_card_details' => $request->save_card_details,
            'receipt' => $filePath,
        ]);

        Chair::whereIn('id', $chairIds)->update(['status' => 1]);

        return redirect()->route('admin.booking.calendar')->with('success', 'Booking created successfully!');
    }

    public function BookingCreate()
    {
       $branches = Branch::with('floors.chairs')->get();
        $chairs = Chair::all();
        return view('admin.booking.create', compact('branches','chairs'));
    }

}
