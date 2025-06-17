<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BookingRequest;
use App\Models\User;
use App\Notifications\GeneralNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class BookingRequestController extends Controller
{
    public function index()
    {
        if (Auth::user()->type === 'admin') {
            $bookingRequests = BookingRequest::with('user')->get();
        } else {
            $bookingRequests = BookingRequest::where('user_id', Auth::id())->with('user')->get();
        }
        return response()->json(['success' => true, 'data' => $bookingRequests], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'no_of_seats' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->errors()->first(),
            ], 422);
        }

        $bookingRequest = BookingRequest::create([
            'user_id' => Auth::id(),
            'no_of_seats' => $request->no_of_seats,
        ]);

        $user = Auth::user();
        $admins = User::where('type', 'admin')->where('status', 'active')->get();

        foreach ($admins as $admin) {
            $admin->notify(new GeneralNotification([
                'title' => "Booking Seat Request - User: {$user->name}",
                'message' => "User ID {$user->id} has requested a booking seat Booking ID {$bookingRequest->id}.",
                'type' => 'booking_seat_request',
                'created_by' => $admin->name,
            ]));
        }

        return response()->json(['message' => 'Booking request created successfully', 'data' => $bookingRequest], 201);
    }
}
?>
