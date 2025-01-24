<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\BookingSchedule;
use App\Models\Branch;
use App\Models\Room;
// use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

// use Illuminate\Support\Facades\DB;

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
            'start' => 'required|date',
            'end' => 'required|date|after:start',
            'persons' => 'required|integer',
            'price' => 'required|numeric',
        ]);

        try {
            // Convert start and end to Carbon date instances
            $start = \Carbon\Carbon::parse($request->start);
            $end = \Carbon\Carbon::parse($request->end);

            // Find the room by its ID
            $room = Room::findOrFail($request->room_id);

            // Check if the room's schedule overlaps with the requested time
            $overlap = Room::where('id', $request->room_id)
                ->where(function ($query) use ($start, $end) {
                    // Check if the requested start time overlaps with the room's existing booking
                    $query->whereBetween('schedule_start_date', [$start, $end])
                        // Or if the requested end time overlaps with the room's existing booking
                        ->orWhereBetween('schedule_end_date', [$start, $end])
                        // Or if the new booking's time fully overlaps the room's existing time
                        ->orWhere(function ($query) use ($start, $end) {
                            $query->where('schedule_start_date', '<=', $start)->where('schedule_end_date', '>=', $end);
                        });
                })->exists();

            // If there's an overlap, return an error message
            if ($overlap) {
                return response()->json(['success' => false, 'message' => 'The room is already booked during the selected time range.'], 409);
            }

            // No overlap found, so proceed to create the booking
            DB::beginTransaction();

            // Create the new booking schedule (this could be stored in a separate table or directly with the room)
            BookingSchedule::create($request->all());

            // Optionally update the room's schedule start and end dates if the room's schedule needs to be updated
            $room->update(['schedule_start_date' => $start, 'schedule_end_date' => $end]);

            DB::commit();

            return response()->json(['success' => true, 'message' => 'Booking created successfully'], 201);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $th->getMessage()], 500);
        }
    }

    public function filter(Request $request)
    {
        // Check if only branch_id is provided
        if ($request->has('branch_id') && !$request->has('room_id')) {
            // Retrieve the branch with its floors and rooms
            $branch = Branch::with('floors.rooms')->findOrFail($request->branch_id);
            $floors = $branch->floors; // Get floors with their rooms under the branch
            return response()->json(['success' => true, 'branch_id' => $request->branch_id, 'floors' => $floors], 200);
        }

        // Check if both branch_id and room_id are provided
        if ($request->has('branch_id') && $request->has('room_id')) {
            // Retrieve the booking schedules based on branch and room
            $bookingSchedules = BookingSchedule::where('branch_id', $request->branch_id)->where('room_id', $request->room_id)->with(['branch', 'room', 'user'])->get();

            return response()->json(['success' => true, 'branch_id' => $request->branch_id, 'schedules' => $bookingSchedules], 200);
        }

        // Return an error if parameters are invalid
        return response()->json(['success' => false, 'message' => 'Invalid parameters'], 400);
    }
}