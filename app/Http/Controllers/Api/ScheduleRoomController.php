<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ScheduleRoom;
use Illuminate\Http\Request;

class ScheduleRoomController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $per_page = $request->query('limit', 10);
        $scheduleRooms = ScheduleRoom::with('floor:id,name')->paginate($per_page);
        return response()->json(['success' => true, 'message' => 'Schedule rooms retrieved successfully', 'scheduleRooms' => $scheduleRooms]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string',
            'schedule_floor_id' => 'required|exists:schedule_floors,id'
        ]);
        $scheduleRoom = ScheduleRoom::create($validatedData);
        return response()->json(['success' => true, 'message' => 'Schedule room created successfully', 'data' => $scheduleRoom]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $scheduleRoom = ScheduleRoom::findOrFail($id);
        return response()->json(['success' => true, 'message' => 'Schedule room retrieved successfully', 'data' => $scheduleRoom]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validatedData = $request->validate([
            'name' => 'required|string',
            'schedule_floor_id' => 'required|exists:schedule_floors,id'
        ]);
        $scheduleRoom = ScheduleRoom::findOrFail($id);
        $scheduleRoom->update($validatedData);
        return response()->json(['success' => true, 'message' => 'Schedule room updated successfully', 'data' => $scheduleRoom]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $scheduleRoom = ScheduleRoom::findOrFail($id);
        $scheduleRoom->delete();
        return response()->json(['success' => true, 'message' => 'Schedule room deleted successfully']);
    }
}
