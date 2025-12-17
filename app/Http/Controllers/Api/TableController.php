<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Table;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class TableController extends Controller
{
    public function getTables(Request $request)
    {
        $query = Table::with('room')->withCount('chairs');  // Eager load room and chair count

        if ($request->has('floor_id')) {
            $query->where('floor_id', $request->floor_id);
        }

        if ($request->has('room_id')) {
            $query->where('room_id', $request->room_id);
        }

        $tables = $query->get();

        return response()->json([
            'success' => true,
            'tables' => $tables,
        ], 200);
    }

    /**
     * Remove the specified table from storage.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            $table = Table::findOrFail($id);

            // Delete associated chairs (cascade delete)
            // Note: If we wanted to "move or delete", the move part happens via moveChairs endpoint
            // BEFORE calling this destroy endpoint. This endpoint assumes "delete all" intent
            // for any remaining chairs.
            $table->chairs()->delete();

            $table->delete();

            return response()->json([
                'success' => true,
                'message' => 'Table and associated chairs deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete table',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function createTable(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'floor_id' => 'required|exists:floors,id',
            'room_id' => 'required|exists:rooms,id',
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('tables')->where(function ($query) use ($request) {
                    return $query->where('room_id', $request->room_id);
                }),
            ],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        // Check if table name already exists for the given room
        $existingTable = Table::where('room_id', $request->room_id)
            ->where('name', $request->name)
            ->first();

        if ($existingTable) {
            return response()->json([
                'success' => false,
                'errors' => ['name' => ['Table name already exists in this room']],
            ], 422);
        }

        $table = Table::create([
            'floor_id' => $request->floor_id,
            'room_id' => $request->room_id,
            'name' => $request->name,
            'table_id' => $request->name,  // Save name as table_id
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Table created successfully',
            'data' => $table,
        ], 201);
    }
}
