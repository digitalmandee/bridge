<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
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
                ->withCount(['chairs', 'tables'])
                ->get()
                ->map(function ($room) {
                    return [
                        'id' => $room->id,
                        'room_id' => $room->id,  // Map id to room_id for frontend
                        'name' => $room->name,
                        'floor_id' => $room->floor_id,
                        'floor' => $room->floor ? ['id' => $room->floor->id, 'name' => $room->floor->name] : null,
                        'chairs_count' => $room->chairs_count,
                        'tables_count' => $room->tables_count,
                        'status' => 'available',  // Default status (adjust if status field exists)
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
     * Move chairs from one room to another.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function moveChairs(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'target_room_id' => 'required|exists:rooms,id',
            'chair_ids' => 'required_without:move_all|array',
            'chair_ids.*' => 'exists:chairs,id',
            'source_room_id' => 'required|exists:rooms,id',
            'move_all' => 'boolean',
            'target_table_id' => 'nullable|exists:tables,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $targetRoom = Room::findOrFail($request->target_room_id);
            $floorId = $targetRoom->floor_id;

            $query = \App\Models\Chair::where('room_id', $request->source_room_id);

            if (!$request->move_all) {
                $query->whereIn('id', $request->chair_ids);
            }

            $updateData = [
                'room_id' => $targetRoom->id,
                'floor_id' => $floorId
            ];

            if ($request->has('target_table_id') && $request->target_table_id) {
                $updateData['table_id'] = $request->target_table_id;
            }

            $updated = $query->update($updateData);

            return response()->json([
                'success' => true,
                'message' => "Successfully moved {$updated} chairs.",
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to move chairs',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Move tables from one room to another (cascades to chairs).
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */

    /**
     * Move tables from one room to another (cascades to chairs).
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function moveTables(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'target_room_id' => 'required|exists:rooms,id',
            'source_room_id' => 'required|exists:rooms,id',
            'table_ids' => 'required_without:move_all|array',
            'table_ids.*' => 'exists:tables,id',
            'move_all' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $targetRoom = Room::findOrFail($request->target_room_id);
            $floorId = $targetRoom->floor_id;
            $sourceRoomId = $request->source_room_id;

            // 1. Prepare Table Query
            $tableQuery = \App\Models\Table::where('room_id', $sourceRoomId);

            if (!$request->move_all) {
                $tableQuery->whereIn('id', $request->table_ids);
            }

            // Get IDs of tables to be moved for chair update
            // We need to fetch IDs before updating because update clears the room_id condition if used in subquery logic improperly,
            // but here we are good. However, finding which chairs to move depends on which tables moved.
            $tablesToMoveIds = $tableQuery->pluck('id')->toArray();

            // 2. Update Tables
            $updatedTables = $tableQuery->update([
                'room_id' => $targetRoom->id,
                'floor_id' => $floorId
            ]);

            // 3. Update Chairs linked to those tables
            if (count($tablesToMoveIds) > 0) {
                $updatedChairs = \App\Models\Chair::whereIn('table_id', $tablesToMoveIds)
                    ->update([
                        'room_id' => $targetRoom->id,
                        'floor_id' => $floorId
                    ]);
            } else {
                $updatedChairs = 0;
            }

            return response()->json([
                'success' => true,
                'message' => "Moved {$updatedTables} tables and {$updatedChairs} linked chairs.",
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to move tables',
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

    /**
     * Remove the specified room from storage.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            $room = Room::findOrFail($id);

            // Cascade delete: Delete all chairs and tables in the room
            // Chairs and Tables are assumed to be exclusively owned by the room in this context
            $room->chairs()->delete();
            $room->tables()->delete();

            $room->delete();

            return response()->json([
                'success' => true,
                'message' => 'Room and all its contents deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete room',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
