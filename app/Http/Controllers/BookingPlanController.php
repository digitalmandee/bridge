<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\BookingInvoice;
use App\Models\BookingPlan;
use App\Models\Chair;
use App\Models\Room;
use App\Models\User;
use App\Notifications\GeneralNotification;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
                'floor_id' => 'required|integer',
                'bookingdetails' => 'required|string', // Will parse JSON
                'selectedPlan' => 'required|string',   // Will parse JSON
                'selectedChairs' => 'required|string', // Will parse JSON
            ]);

            // Parse JSON fields
            $bookingDetails = json_decode($validated['bookingdetails'], true);
            $selectedPlan = json_decode($validated['selectedPlan'], true);
            $selectedChairs = json_decode($validated['selectedChairs'], true);

            $branchId = auth()->user()->branch->id;
            $adminName = auth()->user()->name; // Get admin who created booking

            DB::beginTransaction();

            // Check if user exists or create a new user
            $user = User::where('email', $bookingDetails['email'])->first();
            if (!$user) {
                $type = $bookingDetails['type'] == 'individual' ? 'user' : 'company';
                $user = User::create([
                    'name' => $bookingDetails['name'],
                    'email' => $bookingDetails['email'],
                    'type' => $type,
                    'role' => $type == 'user' ? 1 : 1,
                    'password' => Hash::make('password'),
                    'booking_quota' => 20,
                    'total_booking_quota' => 20,
                ]);
                $user->assignRole('user');
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
            $booking = Booking::create([
                "user_id" => $userId,
                "branch_id" => $branchId,
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

            $invoice = BookingInvoice::create([
                'branch_id' => $branchId,
                'booking_id' => $booking->id,
                'user_id' => $userId,
                'due_date' => Carbon::parse($booking->start_date)->format('Y-m-d'),
                'payment_method' => $booking->payment_method,
                'amount' => $booking->total_price,
                'receipt' => $receiptPath,
            ]);

            $admin = User::where('id', auth()->user()->id)->first();

            // Notify user
            $userBookingNotificationData = [
                'title' => 'New Booking Created',
                'message' => "Your Booking has been created.",
                'type' => 'booking',
                'booking_id' => $booking->id,
            ];
            $user->notify(new GeneralNotification($userBookingNotificationData));

            $userInvoiceNotificationData = [
                'title' => 'New Invoice Created',
                'message' => "Your Invoice has been generated.",
                'type' => 'invoice',
                'invoice_id' => $invoice->id,
            ];
            $user->notify(new GeneralNotification($userInvoiceNotificationData));

            // Notify admin
            $adminBookingNotificationData = [
                'title' => 'New Booking',
                'message' => "A Booking has been created by $adminName.",
                'type' => 'booking',
                'booking_id' => $booking->id,
                'created_by' => $adminName,
            ];
            $admin->notify(new GeneralNotification($adminBookingNotificationData));

            $adminInvoiceNotificationData = [
                'title' => 'New Invoice',
                'message' => "An Invoice has been generated for a booking by $adminName.",
                'type' => 'invoice',
                'invoice_id' => $invoice->id,
                'created_by' => $adminName,
            ];

            $admin->notify(new GeneralNotification($adminInvoiceNotificationData));

            DB::commit();

            return response()->json(['success' => true, 'message' => 'Booking created successfully'], 202);
        } catch (\Throwable $th) {
            Log::info($th->getMessage());
            return response()->json(['success' => false, 'message' => $th->getMessage()], 500);
        }
    }

    public function getBookings()
    {
        try {
            $branchId = auth()->user()->branch->id;

            // Fetch bookings with user relationships
            $bookingPlans = Booking::where('branch_id', $branchId)->with(['user', 'floor'])->orderBy('created_at', 'desc')->get();

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

            DB::beginTransaction();

            // Retrieve the booking from the database
            $booking = Booking::findOrFail($request->booking_id);

            // Get the chair data from the request (grouped by C, D, etc.)
            $chairsData = $booking->chairs;
            $color = $this->getColorBasedOnDuration($booking->duration);

            // Loop through each chair group (C, D, etc.) in the chairs data
            foreach ($chairsData as $group => $chairList) {
                foreach ($chairList as &$chairData) {
                    // Assuming the chair ID is in the data, we need to update it
                    $chair = Chair::findOrFail($chairData['chair_id']);

                    // Update chair details based on the booking status
                    if ($request->status === 'accepted') {
                        $chair->update([
                            'booking_startdate' => $request->start_date . ' ' . $request->start_time,
                            'booking_enddate' => $request->end_date . ' ' . $request->end_time,
                            'booked' => true,
                            'duration' => $booking->duration,
                            'color' => $color, // Set the color based on duration
                        ]);
                    }
                    // else if ($request->status === 'vacate') {
                    //     if ($booking->status === 'accepted') {
                    //     $chair->update([
                    //         'booking_startdate' => null,
                    //         'booking_enddate' => null,
                    //         'booked' => false,
                    //         'color' => null,
                    //         'duration' => null,
                    //     ])
                    // }
                    // }
                }
            }

            // Update the booking details
            $booking->update([
                'status' => $request->status,
                'total_price' => $request->price,
                'start_date' => $request->start_date,
                'start_time' => $request->start_time,
                'end_date' => $request->end_date,
                'end_time' => $request->end_time,
                'chair' => $chairsData
            ]);

            DB::commit();

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
