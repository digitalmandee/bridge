<?php

namespace App\Http\Controllers\Api;

use App\Models\Table;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;
use Illuminate\Validation\Rule;


class TableController extends Controller
{
    public function getTables()
    {
        $tables = Table::all();
        return response()->json([
            'success' => true,
            'data' => $tables,
        ], 200);

    }

    public function createTable(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'floor_id' => 'required|exists:floors,id',
            'room_id' => 'required|exists:rooms,id',
            'name' => ['required','string','max:255',
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
            'table_id' => $request->name, // Save name as table_id
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Table created successfully',
            'data' => $table,
        ], 201);
    }


}
