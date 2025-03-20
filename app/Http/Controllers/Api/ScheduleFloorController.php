<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ScheduleFloor;
use Illuminate\Http\Request;

class ScheduleFloorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $per_page = $request->query('limit', 10);
        $scheduleFloors = ScheduleFloor::paginate($per_page);
        return response()->json(['success' => true, 'message' => 'Schedule floors retrieved successfully', 'scheduleFloors' => $scheduleFloors]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string'
        ]);
        $scheduleFloor = ScheduleFloor::create($validatedData);
        return response()->json(['success' => true, 'message' => 'Schedule floor created successfully', 'data' => $scheduleFloor]);
    }

    /**
     * Show the specified resource.
     */
    public function edit(string $id)
    {
        $scheduleFloor = ScheduleFloor::findOrFail($id);
        return response()->json(['success' => true, 'message' => 'Schedule floor retrieved successfully', 'data' => $scheduleFloor]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validatedData = $request->validate([
            'name' => 'required|string'
        ]);
        $scheduleFloor = ScheduleFloor::findOrFail($id);
        $scheduleFloor->update($validatedData);
        return response()->json(['success' => true, 'message' => 'Schedule floor updated successfully', 'data' => $scheduleFloor]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $scheduleFloor = ScheduleFloor::findOrFail($id);
        $scheduleFloor->delete();
        return response()->json(['success' => true, 'message' => 'Schedule floor deleted successfully']);
    }
}
