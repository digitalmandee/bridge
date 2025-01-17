<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Table;
use App\Models\Room;
use Illuminate\Support\Facades\DB;


class TableController extends Controller
{
    //Tables Section
    public function index()
    {
        try
        {
            $tables = Table::getTables();

            return response()->json([
                'success' => true,
                'message' => 'Tables retrieved successfully',
                'data' => $tables,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
        

        
    }

    

    public function store(Request $request)
    {
        try {
            $room = Room::where('id', $request->room_id)
                ->first();

            if(!$room)
            {
                return response()->json([
                    'success' => false,
                    'message' => 'Room Not Found with given ID',
                ], 423);
            }
            DB::beginTransaction();
            $table = new Table();

            $table->room_id = $request->room_id;
            $table->name = $request->name;
            $table->save();


            DB::commit();
            return response()->json([
                'success' => true,
                'message' => 'Table Created successfully',
                'data' => $table,
            ], 200);
            


        }catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
{
    try {
        $table = Table::find($id);

        if (!$table) {
            return response()->json([
                'success' => false,
                'message' => 'Table not found',
            ], 404);
        }

        DB::beginTransaction();

        if ($request->has('room_id')) {
            $room = Room::find($request->room_id);

            if (!$room) {
                return response()->json([
                    'success' => false,
                    'message' => 'Room not found with given ID',
                ], 422);
            }

            $table->room_id = $request->room_id;
        }

        if ($request->has('name')) {
            $table->name = $request->name;
        }

        $table->save();
        DB::commit();

        return response()->json([
            'success' => true,
            'message' => 'Table updated successfully',
            'data' => $table,
        ], 200);
    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json([
            'success' => false,
            'message' => $e->getMessage(),
        ], 500);
    }
}

public function delete($id)
{
    try {
        $table = Table::find($id);

        if (!$table) {
            return response()->json([
                'success' => false,
                'message' => 'Table not found',
            ], 404);
        }

        DB::beginTransaction();
        $table->delete();
        DB::commit();

        return response()->json([
            'success' => true,
            'message' => 'Table deleted successfully',
        ], 200);
    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json([
            'success' => false,
            'message' => $e->getMessage(),
        ], 500);
    }
}

public function show($id)
{
    try {
        $table = Table::find($id);

        if (!$table) {
            return response()->json([
                'success' => false,
                'message' => 'Table not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Table retrieved successfully',
            'data' => $table,
        ], 200);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => $e->getMessage(),
        ], 500);
    }
}


    

   
    //Tables Section End
}
