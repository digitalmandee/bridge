<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Branch;
use App\Models\Floor;
use App\Models\Room;
use App\Models\Table;
use App\Models\Chair;
use App\Models\Booking;
use Illuminate\Support\Facades\Auth;




class BookingController extends Controller
{
    public function index()
    {
        return view('admin.booking.index');
    }


    public function create()
    {
        $branches = Branch::with('floors.rooms.tables.chairs')->get();
        //$branches = Branch::all();
       // dd($branches);
        return view('admin.booking.create', compact('branches'));
    }

    public function storeUserDetails(Request $request)
    {
        try {
            // Validate the input
            $validated = $request->validate([
                'name' => 'required|string',
                'email' => 'required|email',
                'phone' => 'required|string',
                'product' => 'required|string',
                'duration' => 'required|string',
                'start_date' => 'required|date',
                'end_date' => 'required|date',
                'time' => 'required',
                'branch_id' => 'required|numeric',
                'floor_id' => 'required|numeric',
                'room_id' => 'required|numeric',
                'table_id' => 'required|numeric',
                'chair_id' => 'required',
            ]);

            $chairIds = explode(',', $validated['chair_id']);
            $userId = Auth::id();

            // Create the booking
            $booking = Booking::create([
                'user_id' => $userId, 
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'product' => $validated['product'],
                'duration' => $validated['duration'],
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
                'time' => $validated['time'],
                'branch_id' => $validated['branch_id'],
                'floor_id' => $validated['floor_id'],
                'room_id' => $validated['room_id'],
                'table_id' => $validated['table_id'],
                'chair_id' => json_encode($chairIds),
            ]);

            // Update chair statuses
            Chair::whereIn('id', $chairIds)->update(['status' => 1]);

            return response()->json([
                'success' => true,
                'message' => 'Booking created successfully!',
                'data' => $booking,
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->validator->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }


    public function BookingCreate()
    {
       // return view('admin.booking.create');
       $branches = Branch::with('floors.rooms.tables.chairs')->get();
        //$branches = Branch::all();
       // dd($branches);
        return view('admin.booking.create', compact('branches'));
    }
}
