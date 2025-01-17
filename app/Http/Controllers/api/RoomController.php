<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Floor;
use App\Models\Room;

class RoomController extends Controller
{
    //
    public function store(Request $request)
    {
        try
        {
            $floor = Floor::where('id', $request->floor_id)
                ->first();

            if(!$floor)
            {
                return response()->json([
                    'success' => false,
                    'message' => 'Floor Not Found with given ID',
                ], 423);
            }

            $formattedName = ucwords(strtolower($request->name));

            $room = new Room();
            $room->floor_id = $request->floor_id;
            $room->name = $formattedName;
            $room->type = $request->type;
            $room->save();
            // Fetch all users including soft-deleted users

            return response()->json([
                'success' => true,
                'message' => 'Room Created successfully',
                'data' => $floor,
            ], 200);
            


        }catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function index()
{
    try {
        $rooms = Room::all();

        return response()->json([
            'success' => true,
            'message' => 'Rooms retrieved successfully',
            'data' => $rooms,
        ], 200);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => $e->getMessage(),
        ], 500);
    }
}

public function show($id)
{
    try {
        $room = Room::find($id);

        if (!$room) {
            return response()->json([
                'success' => false,
                'message' => 'Room not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Room retrieved successfully',
            'data' => $room,
        ], 200);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => $e->getMessage(),
        ], 500);
    }
}

public function delete($id)
{
    try {
        $room = Room::find($id);

        if (!$room) {
            return response()->json([
                'success' => false,
                'message' => 'Room not found',
            ], 404);
        }

        $room->delete();

        return response()->json([
            'success' => true,
            'message' => 'Room deleted successfully',
        ], 200);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => $e->getMessage(),
        ], 500);
    }
}

public function update(Request $request, $id)
{
    try {
        $room = Room::find($id);

        if (!$room) {
            return response()->json([
                'success' => false,
                'message' => 'Room not found',
            ], 404);
        }

        // Update room details
        if ($request->has('name')) {
            $room->name = ucwords(strtolower($request->name));
        }

        if ($request->has('type')) {
            $room->type = $request->type;
        }

        if ($request->has('floor_id')) {
            $floor = Floor::find($request->floor_id);

            if (!$floor) {
                return response()->json([
                    'success' => false,
                    'message' => 'Floor not found with given ID',
                ], 422);
            }

            $room->floor_id = $request->floor_id;
        }

        $room->save();

        return response()->json([
            'success' => true,
            'message' => 'Room updated successfully',
            'data' => $room,
        ], 200);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => $e->getMessage(),
        ], 500);
    }
}




}
