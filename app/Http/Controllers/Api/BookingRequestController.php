<?php

namespace App\Http\Controllers\Api;

use App\Models\BookingRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class BookingRequestController extends Controller
{
    public function index()
    {
        $bookingRequests = BookingRequest::with('user')->get();
        return response()->json([
            'success' => true,
            'data' => $bookingRequests,
        ], 200);
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

        return response()->json([
            'message' => 'Booking request created successfully',
            'data' => $bookingRequest,
        ], 201);
    }
}
?>
