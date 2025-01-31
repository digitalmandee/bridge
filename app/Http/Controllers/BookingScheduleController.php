<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\BookingSchedule;
use App\Models\Branch;
use App\Models\Room;
use App\Models\ScheduleFloor;
use App\Models\ScheduleRoom;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Scheduling\Schedule;
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
            'user_id' => 'required|integer',
            'room_id' => 'required|integer',
            'title' => 'required|string',
            'startTime' => 'required|date',
            'endTime' => 'required|date|after:startTime',
            'date' => 'required|date',
            'persons' => 'required|integer',
        ]);

        try {
            // Directly parse timestamps as they are
            $startTime = Carbon::parse($request->startTime);
            $endTime = Carbon::parse($request->endTime);
            $date = Carbon::parse($request->date);

            // Check if the room's schedule overlaps with the requested time
            $overlap = BookingSchedule::where('schedule_room_id', $request->room_id)
                ->where(function ($query) use ($startTime, $endTime) {
                    $query->where(function ($query) use ($startTime, $endTime) {
                        // Check for overlapping schedules
                        $query->where('startTime', '<', $endTime)
                            ->where('endTime', '>', $startTime);
                    });
                })->exists();

            if ($overlap) {
                return response()->json([
                    'success' => false,
                    'already_exist' => 'The room is already booked during the selected time range.'
                ], 409);
            }

            // No overlap found, proceed to create the booking
            DB::beginTransaction();

            $user = User::findOrFail($request->user_id);
            if ($user->booking_quota > 0) {
                $user->decrement('booking_quota');
            } else {
                DB::rollBack();
                return response()->json(['success' => false, 'user_limit_error' => 'User has reached the booking limit.'], 403);
            }

            $LoggedInUser = auth()->user();
            $branchId = $LoggedInUser->type === 'admin' ? $LoggedInUser->branch->id : $LoggedInUser->created_by_branch_id;

            $bookingSchedule = BookingSchedule::create([
                'branch_id' => $branchId,
                'user_id' => $request->user_id,
                'schedule_floor_id' => $request->location_id,
                'schedule_room_id' => $request->room_id,
                'title' => $request->title,
                'startTime' => $startTime,  // Store as timestamp
                'endTime' => $endTime,      // Store as timestamp
                'date' => $date,            // Store as timestamp
                'persons' => $request->persons,
            ]);

            DB::commit();

            return response()->json(['success' => true, 'message' => 'Booking created successfully', 'data' => $bookingSchedule->load('branch', 'room', 'floor', 'user')], 201);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $th->getMessage()], 500);
        }
    }

    public function filter(Request $request)
    {
        $locationId = $request->get('location_id');
        $roomId = $request->get('room_id');
        $timestamp = $request->get('date'); // Get the timestamp from the request

        $user = auth()->user();


        // Parse the timestamp to a Carbon instance if provided
        $date = $timestamp ? Carbon::parse($timestamp)->setTimezone('Asia/Karachi')->toDateString() : null;

        // Fetch all branches if no branch and room ID are provided
        if (empty($locationId) && empty($roomId)) {
            $locations = ScheduleFloor::get();
            return response()->json(['success' => true, 'locations' => $locations], 200);
        }

        // Fetch branch with floors and rooms if only branch ID is provided
        if (!empty($locationId) && empty($roomId)) {
            $floors = ScheduleFloor::where('id', $locationId)->with('rooms')->get();
            $users = $user->type === 'user' ? [] : User::where('type', 'user')->get();

            return response()->json([
                'success' => true,
                'location_id' => $locationId,
                'floors' => $floors,
                'users' => $users
            ], 200);
        }

        // Fetch booking schedules based on branch ID, room ID, and optionally filter by date
        if (!empty($locationId) && !empty($roomId)) {
            $branchId = $user->type === 'admin' ? $user->branch->id : $user->created_by_branch_id;

            $query = BookingSchedule::where('branch_id', $branchId)->where('schedule_room_id', $roomId);

            // Apply date filter if provided
            if (!empty($date)) {
                $query->whereDate('date', '=', $date);
            }

            if ($user->type === 'admin') {
                // Admins get full booking schedule details
                $bookingSchedules = $query->with(['branch', 'room', 'floor', 'user:id,name'])->get();
            } else {
                // Regular users:
                // - Get full details for **their own bookings** (with branch, floor, and user)
                // - Get only `id`, `startTime`, and `endTime` for **other users' bookings**
                $bookingSchedules = $query->with(['branch', 'room', 'floor', 'user:id,name'])->get()->map(function ($schedule) use ($user) {
                    if ($schedule->user_id === $user->id) {
                        return $schedule; // Full details for own bookings
                    }
                    return [
                        'id' => $schedule->id,
                        'startTime' => $schedule->startTime,
                        'endTime' => $schedule->endTime,
                        'date' => $schedule->date
                    ]; // Limited details for other users
                });
            }

            return response()->json([
                'success' => true,
                'branch_id' => $locationId,
                'room_id' => $roomId,
                'schedules' => $bookingSchedules,
            ], 200);
        }

        return response()->json(['success' => false, 'message' => 'Invalid parameters'], 400);
    }
}