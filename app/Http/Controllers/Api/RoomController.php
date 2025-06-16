<?php

namespace App\Http\Controllers\Api;

use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;
use Illuminate\Validation\Rule;

class RoomController extends Controller
{
    /**
     * Display a listing of rooms for a specific floor.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'floor_id' => 'required|exists:floors,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $rooms = Room::where('floor_id', $request->floor_id)
                ->with('floor')
                ->get()
                ->map(function ($room) {
                    return [
                        'id' => $room->id,
                        'room_id' => $room->id, // Map id to room_id for frontend
                        'name' => $room->name,
                        'floor_id' => $room->floor_id,
                        'floor' => $room->floor ? ['id' => $room->floor->id, 'name' => $room->floor->name] : null,
                        'status' => 'available', // Default status (adjust if status field exists)
                        'created_at' => $room->created_at,
                        'updated_at' => $room->updated_at,
                    ];
                });

            return response()->json([
                'success' => true,
                'rooms' => $rooms,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch rooms',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly created room in storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function create(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'floor_id' => 'required|exists:floors,id',
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('rooms')->where(function ($query) use ($request) {
                    return $query->where('floor_id', $request->floor_id);
                }),
            ],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        // Check if room name already exists for the given floor
        $existingRoom = Room::where('floor_id', $request->floor_id)
            ->where('name', $request->name)
            ->first();

        if ($existingRoom) {
            return response()->json([
                'success' => false,
                'errors' => ['name' => ['Room name already exists on this floor']],
            ], 422);
        }

        $room = Room::create([
            'floor_id' => $request->floor_id,
            'name' => $request->name,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Room created successfully',
            'data' => $room,
        ], 201);
    }
}
