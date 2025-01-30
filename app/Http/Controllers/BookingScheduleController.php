<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\BookingSchedule;
use App\Models\Branch;
use App\Models\Room;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
            'branch_id' => 'required|integer',
            'user_id' => 'required|integer',
            'room_id' => 'required|integer',
            'title' => 'required|string',
            'startTime' => 'required|date',
            'endTime' => 'required|date|after:startTime',
            'date' => 'required|date',
            'persons' => 'required|integer',
            // 'price' => 'required|numeric',
        ]);

        try {
            // Directly parse timestamps as they are
            $startTime = Carbon::parse($request->startTime);
            $endTime = Carbon::parse($request->endTime);
            $date = Carbon::parse($request->date);

            // Check if the room's schedule overlaps with the requested time
            $overlap = BookingSchedule::where('room_id', $request->room_id)
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

            $bookingSchedule = BookingSchedule::create([
                'branch_id' => $request->branch_id,
                'user_id' => $request->user_id,
                'room_id' => $request->room_id,
                'title' => $request->title,
                'startTime' => $startTime,  // Store as timestamp
                'endTime' => $endTime,      // Store as timestamp
                'date' => $date,            // Store as timestamp
                'persons' => $request->persons,
            ]);

            DB::commit();

            return response()->json(['success' => true, 'message' => 'Booking created successfully', 'data' => $bookingSchedule->load('branch', 'room', 'user')], 201);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $th->getMessage()], 500);
        }
    }

    public function filter(Request $request)
    {
        $branchId = $request->get('branch_id');
        $roomId = $request->get('room_id');
        $timestamp = $request->get('date'); // Get the timestamp from the request

        // Parse the timestamp to a Carbon instance if provided
        $date = $timestamp ? \Carbon\Carbon::parse($timestamp)->toDateString() : null;

        // Fetch all branches if no branch and room ID are provided
        if (empty($branchId) && empty($roomId)) {
            $branches = Branch::get();
            return response()->json(['success' => true, 'branches' => $branches], 200);
        }

        // Fetch branch with floors and rooms if only branch ID is provided
        if (!empty($branchId) && empty($roomId)) {
            $branch = Branch::with('floors.rooms')->findOrFail($branchId);
            $users = User::where('type', 'user')->get();
            $floors = $branch->floors;
            return response()->json(['success' => true, 'branch_id' => $branchId, 'floors' => $floors, 'users' => $users], 200);
        }

        // Fetch booking schedules based on branch ID, room ID, and optionally filter by date
        if (!empty($branchId) && !empty($roomId)) {
            $query = BookingSchedule::where('branch_id', $branchId)
                ->where('room_id', $roomId);

            // Apply date filter if the date parameter is provided
            if (!empty($date)) {
                $query->whereDate('date', '=', $date); // Match only the date part of the timestamp
            }


            $bookingSchedules = $query->with(['branch', 'room', 'user'])->get();

            return response()->json([
                'success' => true,
                'branch_id' => $branchId,
                'room_id' => $roomId,
                'schedules' => $bookingSchedules,
            ], 200);
        }

        // If parameters are invalid
        return response()->json(['success' => false, 'message' => 'Invalid parameters'], 400);
    }
}