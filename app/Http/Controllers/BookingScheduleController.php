<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\BookingSchedule;
use App\Models\ScheduleFloor;
use App\Models\ScheduleRoom;
use App\Models\User;
use App\Notifications\GeneralNotification;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class BookingScheduleController extends Controller
{
    public function index()
    {
        // Retrieve all booking schedules
        $bookingSchedules = BookingSchedule::all();
        return response()->json(['success' => true, 'schedules' => $bookingSchedules], 200);
    }

    public function create(Request $request)
    {
        $request->validate([
            'location_id' => 'required|integer',
            'room_id' => 'required|integer',
            'title' => 'required|string',
            'startTime' => 'required|date',
            'endTime' => 'required|date|after:startTime',
            'date' => 'required|date',
            'persons' => 'required|integer',
        ]);

        $LoggedInUser = auth()->user();

        if ($LoggedInUser->type === 'admin') {
            $request->validate([
                'user_id' => 'required|integer',
            ]);
        } else {
            $request->merge(['user_id' => $LoggedInUser->id]);
        }

        try {
            // Directly parse timestamps as they are
            $startTime = Carbon::parse($request->startTime);
            $endTime = Carbon::parse($request->endTime);
            $date = Carbon::parse($request->date)->setTimezone('Asia/Karachi');

            // Check if the room's schedule overlaps with the requested time
            $overlap = $this->checkBookingAvailability($request->room_id, $startTime, $endTime);
            Log::info($startTime);
            Log::info($endTime);
            if ($overlap) {
                return response()->json(['success' => false, 'already_exist' => 'The room is already booked during the selected time range.'], 409);
            }

            // No overlap found, proceed to create the booking
            DB::beginTransaction();

            $user = User::findOrFail($request->user_id);
            if ($user->booking_quota == 0) {
                DB::rollBack();
                return response()->json(['success' => false, 'user_limit_error' => 'User has reached the booking limit.'], 403);
            }

            $branchId = $LoggedInUser->type === 'admin' ? $LoggedInUser->branch->id : $LoggedInUser->created_by_branch_id;

            $quotaDecrement = $this->checkBookingHours($startTime, $endTime);

            if ($user->booking_quota < $quotaDecrement) {
                DB::rollBack();
                return response()->json(['success' => false, 'user_limit_error' => 'User has insufficient booking quota.'], 403);
            }

            // Create the booking
            $booking = BookingSchedule::create([
                'branch_id' => $branchId,
                'user_id' => $request->user_id,
                'company_id' => $user->company_id ?? null,
                'schedule_floor_id' => $request->location_id,
                'schedule_room_id' => $request->room_id,
                'title' => $request->title,
                'startTime' => $startTime,  // Store as timestamp
                'endTime' => $endTime,  // Store as timestamp
                'date' => $date,  // Store as timestamp
                'persons' => $request->persons,
            ]);


            $room = ScheduleRoom::find($request->room_id);  // Adjust according to your model
            $roomName = $room ? $room->name : 'Unknown Room';

            // Admin notification if the logged-in user is an admin
            if ($LoggedInUser->type === 'admin') {
                $userBookingNotificationData = [
                    'title' => "Booking Created - {$LoggedInUser->branch->name}",
                    'message' => "Booking #{$booking->event_id} for Meeting Room {$roomName} has been created.",
                    'type' => 'booking_schedule',
                    'booking_id' => $booking->event_id,
                ];
                $user->notify(new GeneralNotification($userBookingNotificationData));

                $adminBookingNotificationData = [
                    'title' => "New Booking - User: {$user->name}",
                    'message' => "Booking #{$booking->event_id} for Meeting Room {$roomName} created by {$LoggedInUser->name}.",
                    'type' => 'booking_schedule',
                    'booking_id' => $booking->event_id,
                    'created_by' => $LoggedInUser->name,
                ];
                $LoggedInUser->notify(new GeneralNotification($adminBookingNotificationData));
            }
            // If the logged-in user is a regular user, notify the admin
            else {
                $adminBookingNotificationData = [
                    'title' => "New Booking - User: {$LoggedInUser->name}",
                    'message' => "Booking #{$booking->event_id} for Meeting Room {$roomName} created by {$LoggedInUser->name}.",
                    'type' => 'booking_schedule',
                    'booking_id' => $booking->event_id,
                    'created_by' => $LoggedInUser->name,
                ];
                $admin = User::find($LoggedInUser->userBranch->user_id); // Get the admin user
                $admin->notify(new GeneralNotification($adminBookingNotificationData));
            }

            DB::commit();

            return response()->json(['success' => true, 'message' => 'Booking created successfully'], 201);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $th->getMessage()], 500);
        }
    }

    private function checkBookingAvailability($roomId, $startTime, $endTime)
    {
        return BookingSchedule::where('schedule_room_id', $roomId)
            ->where('status', 'approved')
            ->where(function ($query) use ($startTime, $endTime) {
                $query->where(function ($query) use ($startTime, $endTime) {
                    // Check for overlapping schedules
                    $query
                        ->where('startTime', '<', $endTime)
                        ->where('endTime', '>', $startTime);
                });
            })
            ->exists();
    }

    public function filter(Request $request)
    {
        $locationId = $request->get('location_id');
        $roomId = $request->get('room_id');
        $timestamp = $request->get('date'); // Get the timestamp from the request
        $view = $request->get('view', 'day'); // View type (day, week, month)

        $user = auth()->user();

        // Parse the timestamp to a Carbon instance if provided
        $date = $timestamp ? Carbon::parse($timestamp)->setTimezone('Asia/Karachi') : null;

        // Fetch all branches if no branch and room ID are provided
        if (empty($locationId) && empty($roomId)) {
            $locations = ScheduleFloor::select('id', 'branch_id', 'name')->get();
            return response()->json(['success' => true, 'locations' => $locations], 200);
        }

        // Fetch branch with floors and rooms if only branch ID is provided
        if (!empty($locationId) && empty($roomId)) {
            $floors = ScheduleRoom::where('schedule_floor_id', $locationId)->select('id', 'name')->get();
            return response()->json(['success' => true, 'location_id' => $locationId, 'rooms' => $floors], 200);
        }

        // Fetch booking schedules based on branch ID, room ID, and apply filters based on view
        if (!empty($locationId) && !empty($roomId)) {
            $branchId = $user->type === 'admin' ? $user->branch->id : $user->created_by_branch_id;

            $query = BookingSchedule::where('branch_id', $branchId)
                ->where('schedule_room_id', $roomId)
                ->where('status', 'approved');

            // Apply date filter based on view
            if (!empty($date)) {
                if ($view === 'day') {
                    Log::info($date->toDateString());
                    $query->whereDate('date', '=', $date->toDateString());
                } elseif ($view === 'week') {
                    // Set the week to start on Sunday and end on Saturday
                    $startOfWeek = $date->copy()->startOfWeek(Carbon::SUNDAY);
                    $endOfWeek = $date->copy()->endOfWeek(Carbon::SATURDAY);
                    $query->whereBetween('date', [$startOfWeek, $endOfWeek]);
                } elseif ($view === 'month') {
                    $startOfMonth = $date->copy()->startOfMonth(); // First day of the month
                    $endOfMonth = $date->copy()->endOfMonth(); // Last day of the month
                    $query->whereBetween('date', [$startOfMonth, $endOfMonth]);
                }
            }

            if ($user->type === 'admin') {
                // Admins get full booking schedule details
                $bookingSchedules = $query->with(['branch:id,name', 'room:id,name', 'floor:id,name', 'user:id,name,email'])
                    ->get()
                    ->makeHidden(['created_at', 'updated_at']);
            } else {
                $bookingSchedules = $query->with(['branch:id,name', 'room:id,name', 'floor:id,name', 'user:id,name,email'])
                    ->get()
                    ->makeHidden(['created_at', 'updated_at'])
                    ->map(function ($schedule) use ($user) {
                        // Hide timestamps for relationships
                        if ($schedule->user_id === $user->id) {
                            return $schedule; // Full details for own bookings
                        }

                        // Limited details for other users
                        return [
                            'event_id' => $schedule->event_id,
                            'startTime' => $schedule->startTime,
                            'endTime' => $schedule->endTime,
                            'date' => $schedule->date,
                        ];
                    });
            }

            return response()->json(['success' => true, 'location_id' => $locationId, 'room_id' => $roomId, 'schedules' => $bookingSchedules], 200);
        }

        return response()->json(['success' => false, 'message' => 'Invalid parameters'], 400);
    }

    public function getAvailabilityRooms()
    {
        $user = auth()->user();
        $branchId = $user->type === 'admin' ? $user->branch->id : $user->created_by_branch_id;

        if (!$branchId) {
            return response()->json(['message' => 'Branch ID parameter is required'], 400);
        }

        // Fetch floors with rooms, selecting only 'id' and 'name' for rooms
        $floors = ScheduleFloor::where('branch_id', $branchId)
            ->select('id', 'name')  // Select only id and name for floors
            ->with(['rooms' => function ($query) {
                $query->select('id', 'name', 'schedule_floor_id');
            }])
            ->get();

        return response()->json(['success' => true, 'floors' => $floors], 200);
    }

    public function getRequests()
    {
        $user = auth()->user();
        if ($user->type === 'user') {
            $bookingSchedules = BookingSchedule::where('user_id', $user->id)->orderBy('created_at', 'desc')->with(['branch:id,name', 'room:id,name', 'floor:id,name', 'user:id,name,email'])->get();
        } else if ($user->type === 'admin') { {
                $branchId = $user->branch->id;
                if (!$branchId) {
                    return response()->json(['message' => 'Branch ID parameter is required'], 400);
                }
                $bookingSchedules = BookingSchedule::where('branch_id', $branchId)->orderBy('created_at', 'desc')->with(['branch:id,name', 'room:id,name', 'floor:id,name', 'user:id,name,email'])->get();
            }
        } else if ($user->type === 'company') {
            $bookingSchedules = BookingSchedule::where('company_id', $user->id)->orderBy('created_at', 'desc')->with(['branch:id,name', 'room:id,name', 'floor:id,name', 'user:id,name,email'])->get();
        }

        return response()->json(['success' => true, 'schedules' => $bookingSchedules], 200);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'booking_id' => 'required|integer',
            'status' => 'required|string',
        ]);

        try {
            DB::beginTransaction();

            $bookingSchedule = BookingSchedule::findOrFail($validated['booking_id']);
            $oldStatus = $bookingSchedule->status; // Store the old status before updating

            // Check if the status is being updated to 'approved' and handle accordingly
            if ($validated['status'] === 'approved' && $bookingSchedule->status != 'approved') {
                // Check if the booking is available
                $overlap = $this->checkBookingAvailability($bookingSchedule->schedule_room_id, $bookingSchedule->startTime, $bookingSchedule->endTime);

                if ($overlap) {
                    return response()->json(['success' => false, 'already_exist' => 'The room is already booked during the selected time range.'], 409);
                }

                // Proceed with quota and availability checks as before
                $user = User::findOrFail($bookingSchedule->user_id);

                // Calculate booking duration in hours
                $quotaDecrement = $this->checkBookingHours($bookingSchedule->startTime, $bookingSchedule->endTime);

                // Check if the user has enough booking quota
                if ($user->booking_quota >= $quotaDecrement) {
                    $user->decrement('booking_quota', $quotaDecrement);
                } else {
                    DB::rollBack();
                    return response()->json(['success' => false, 'user_limit_error' => 'User has insufficient booking quota.'], 403);
                }
            }

            // Update the booking schedule status
            $bookingSchedule->update(['status' => $validated['status']]);

            // Get the meeting room name (assuming it's stored in a Room model)
            $room = ScheduleRoom::find($bookingSchedule->schedule_room_id);  // Adjust according to your model
            $roomName = $room ? $room->name : 'Unknown Room';

            // Notify user if status has changed (to approved or any other status)
            if ($validated['status'] !== $oldStatus) {
                $user = User::findOrFail($bookingSchedule->user_id);

                $userNotificationData = [
                    'title' => "Booking Status Updated - {$roomName}",
                    'message' => "Your booking #{$bookingSchedule->event_id} for Meeting Room {$roomName} is now {$validated['status']}.",
                    'type' => 'booking_status_updated',
                    'booking_id' => $bookingSchedule->event_id,
                    'status' => $validated['status'],
                ];
                $user->notify(new GeneralNotification($userNotificationData));

                // Notify admin (assuming the admin is the one who updated the status)
                $admin = auth()->user();  // Admin who updated the booking status

                $adminNotificationData = [
                    'title' => "Booking Status Updated - User: {$user->name}",
                    'message' => "Booking #{$bookingSchedule->event_id} for Meeting Room {$roomName} has been updated to {$validated['status']} by {$admin->name}.",
                    'type' => 'booking_status_updated',
                    'booking_id' => $bookingSchedule->event_id,
                    'status' => $validated['status'],
                    'updated_by' => $admin->name,
                ];
                $admin->notify(new GeneralNotification($adminNotificationData));
            }

            DB::commit();

            return response()->json(['success' => true, 'message' => 'Booking Schedule updated successfully'], 200);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $th->getMessage()], 500);
        }
    }

    // c
    private function checkBookingHours($bookingStartTime, $bookingEndTime)
    {
        // Calculate booking duration in hours
        $startTime = new Carbon($bookingStartTime);
        $endTime = new Carbon($bookingEndTime);
        $durationInHours = $startTime->diffInMinutes($endTime) / 60;

        // Round to 2 decimal places for duration
        $quotaDecrement = round($durationInHours, 2);

        return $quotaDecrement;
    }
}