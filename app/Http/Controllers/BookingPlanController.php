<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\BookingPlan;
use App\Models\Chair;
use App\Models\Room;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class BookingPlanController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function createBooking(Request $request)
    {
        try {
            // Validate required fields
            $validated = $request->validate([
                'branch_id' => 'required|integer',
                'floor_id' => 'required|integer',
                'bookingdetails' => 'required|string', // Will parse JSON
                'selectedPlan' => 'required|string',   // Will parse JSON
                'selectedChairs' => 'required|string', // Will parse JSON
            ]);

            // Parse JSON fields
            $bookingDetails = json_decode($validated['bookingdetails'], true);
            $selectedPlan = json_decode($validated['selectedPlan'], true);
            $selectedChairs = json_decode($validated['selectedChairs'], true);

            // Check if user exists or create a new user
            $user = User::where('email', $bookingDetails['email'])->first();
            if (!$user) {
                $type = $bookingDetails['type'] == 'individual' ? 'user' : 'company';
                $user = User::create([
                    'name' => $bookingDetails['name'],
                    'email' => $bookingDetails['email'],
                    'type' => $type,
                    'role' => $type == 'user' ? 1 : 1,
                    'password' => Hash::make('bridge@123'),
                ]);
            }

            $userId = $user->id;

            // Handle profile_image upload
            if ($request->hasFile('profile_image')) {
                $profileImagePath = $request->file('profile_image')->store('profile_images', 'public');
                $user->update(['profile_image' => $profileImagePath]);
            }

            // Handle receipt upload
            $receiptPath = null;
            if ($request->hasFile('receipt')) {
                $receiptPath = $request->file('receipt')->store('receipts', 'public');
            }

            // Create booking
            Booking::create([
                "user_id" => $userId,
                "branch_id" => $validated['branch_id'],
                "floor_id" => $validated['floor_id'],
                "plan_id" => $selectedPlan['id'],
                "chairs" => $selectedChairs,
                "name" => $bookingDetails['name'],
                "phone_no" => $bookingDetails['phone_no'],
                "type" => $bookingDetails['type'],
                "duration" => $bookingDetails['duration'],
                "start_date" => $bookingDetails['start_date'],
                "start_time" => $bookingDetails['start_time'],
                "total_price" => $bookingDetails['total_price'],
                "package_detail" => $bookingDetails['package_detail'],
                "payment_method" => $bookingDetails['payment_method'],
                "plan" => $selectedPlan,
                "receipt" => $receiptPath,
            ]);

            return response()->json(['success' => true, 'message' => 'Booking created successfully'], 202);
        } catch (\Throwable $th) {
            Log::info($th->getMessage());
            return response()->json(['success' => false, 'message' => $th->getMessage()], 500);
        }
    }


    public function getBookings(Request $request)
    {
        try {
            $branchId = $request->branch_id;

            if (!$branchId) {
                return response()->json(['message' => 'Branch ID parameter is required'], 400);
            }

            // Fetch bookings with user relationships
            $bookingPlans = Booking::where('branch_id', $branchId)->with(['user', 'floor'])->get();

            // Fetch all rooms (assuming you have a Room model)
            $rooms = Room::all()->keyBy('id'); // Create a map of rooms by room_id

            // Transform the bookings to include room names and total chairs count
            $bookingPlans = $bookingPlans->map(function ($booking) use ($rooms) {
                $chairsData = collect($booking->chairs); // Assuming chairs is JSON

                // Calculate the total number of chairs
                $totalChairs = $chairsData->flatMap(function ($chairs) {
                    return $chairs;
                })->count();

                // Extract unique room IDs
                $roomIds = $chairsData->flatMap(function ($chairs) {
                    return collect($chairs)->pluck('room_id'); // Extract room_ids
                })->unique();

                // Map room IDs to room names
                $roomNames = $roomIds->map(function ($roomId) use ($rooms) {
                    return $rooms->get($roomId)?->name; // Fetch room name by room_id
                })->filter(); // Remove null values in case of missing room_ids

                // Add room names and total chairs count to the booking object
                $booking->rooms = $roomNames->values(); // Reset indices for rooms
                $booking->total_chairs = $totalChairs; // Add total chairs count
                return $booking;
            });

            return response()->json([
                'success' => true,
                'message' => 'Bookings retrieved successfully',
                'bookings' => $bookingPlans,
            ], 200);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'message' => $th->getMessage()], 500);
        }
    }

    public function updateBooking(Request $request)
    {
        try {
            $request->validate([
                'booking_id' => 'required|integer',
                'status' => 'required|string',
                'price' => 'required|numeric',
            ]);

            // Retrieve the booking from the database
            $booking = Booking::findOrFail($request->booking_id);

            // Update the booking details
            $booking->update([
                'status' => $request->status,
                'total_price' => $request->price,
                'start_date' => $request->start_date,
                'start_time' => $request->start_time,
                'end_date' => $request->end_date,
                'end_time' => $request->end_time
            ]);

            // Get the chair data from the request (grouped by C, D, etc.)
            $chairsData = $booking->chairs;
            $color = $this->getColorBasedOnDuration($booking->duration);

            // Loop through each chair group (C, D, etc.) in the chairs data
            foreach ($chairsData as $group => $chairList) {
                foreach ($chairList as &$chairData) {
                    // Assuming the chair ID is in the data, we need to update it
                    $chair = Chair::findOrFail($chairData['chair_id']);

                    // Update chair details based on the booking status
                    if ($booking->status === 'accepted') {
                        $chair->update([
                            'booking_startdate' => $booking->start_date . ' ' . $booking->start_time,
                            'booking_enddate' => $booking->end_date . ' ' . $booking->end_time,
                            'booked' => true,
                            'duration' => $booking->duration,
                            'color' => $color, // Set the color based on duration
                        ]);
                    }
                    // else {
                    //     // Clear booking details if status is pending or rejected
                    //     $chair->update([
                    //         'booking_startdate' => null,
                    //         'booking_enddate' => null,
                    //         'booked' => false,
                    //         'duration' => null,
                    //         'color' => 'gray', // Reset color when not booked
                    //     ]);
                    // }
                    // // Update the chair data within the grouped array (C, D, etc.)
                    // $chairData['booking_startdate'] = $request->status === 'accepted' ? $request->start_date : null;
                    // $chairData['booking_enddate'] = $request->status === 'accepted' ? $request->end_date : null;
                    // $chairData['booked'] = $request->status === 'accepted' ? 1 : 0;
                    // $chairData['duration'] = $request->status === 'accepted' ? $request->duration : null;
                    // $chairData['color'] = $request->status === 'accepted' ? $color : null;
                }
            }

            // Save updated chair data back to the booking
            $booking->update(['chair' => $chairsData]);

            return response()->json(['success' => true, 'message' => 'Booking and chairs updated successfully'], 200);
        } catch (\Throwable $th) {
            Log::info($th->getMessage());
            return response()->json(['success' => false, 'message' => $th->getMessage()], 500);
        }
    }

    private function getColorBasedOnDuration($duration)
    {
        // Set color based on duration
        switch ($duration) {
            case 'day':
                return '#F59E0B';
            case 'night':
                return '#6366F1';
            case '24':
                return 'green';
            default:
                return 'gray';
        }
    }

    public function index(Request $request)
    {
        try {
            $branchId = $request->branch_id;

            if (!$branchId) return response()->json(['message' => 'Branch ID parameter is required'], 400);

            $bookingPlans = BookingPlan::where('branch_id', $branchId)->with('branch')->get();

            return response()->json([
                'success' => true,
                'message' => 'Booking Plans retrieved successfully',
                'data' => $bookingPlans,
            ], 200);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'message' => $th->getMessage()], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'branch_id' => 'required|integer',
            'name' => 'required|string',
            'type' => 'required|string',
            'price' => 'required|numeric',
        ]);
        try {
            // Create a new booking plan
            BookingPlan::firstOrCreate($validated);

            return response()->json(['success' => true, 'message' => 'Booking Plan created successfully'], 201);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'message' => $th->getMessage()], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'type' => 'required|string',
            'price' => 'required|numeric',
        ]);

        try {
            $bookingPlan = BookingPlan::findOrFail($id);
            $bookingPlan->update($validated);

            $bookingPlan->load('branch');

            return response()->json(['success' => true, 'message' => 'Booking Plan updated successfully', 'data' => $bookingPlan], 200);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'message' => $th->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            $bookingPlan = BookingPlan::find($id);
            if (!$bookingPlan) {
                return response()->json(['success' => false, 'message' => 'Booking Plan not found'], 500);
            }
            $bookingPlan->delete();

            return response()->json(['success' => true, 'message' => 'Booking Plan deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}