<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Chair;
use Illuminate\Support\Facades\DB;
use App\Models\Table;

class ChairsController extends Controller
{
    public function index()
    {
        try
        {
            $chairs = Chair::getChairs();


            return response()->json([
                'success' => true,
                'message' => 'All chairs retrieved successfully',
                'data' => $chairs,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function AvailableChairs()
    {
        try
        {
            $chairs = Chair::where('status',0)->get();


            return response()->json([
                'success' => true,
                'message' => 'Available chairs retrieved successfully',
                'data' => $chairs,
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
            $table = Table::where('id', $request->table_id)
                ->first();

            if(!$table)
            {
                return response()->json([
                    'success' => false,
                    'message' => 'table Not Found with given ID',
                ], 423);
            }
            DB::beginTransaction();
            $chair = new Chair();

            $chair->table_id = $request->table_id;
            $chair->name = $request->name;
            $chair->status = $request->status;
            $chair->save();


            DB::commit();
            return response()->json([
                'success' => true,
                'message' => 'Chair Created successfully',
                'data' => $chair,
            ], 200);
            


        }catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

   
    public function show($id)
{
    try {
        $chair = Chair::find($id);

        if (!$chair) {
            return response()->json([
                'success' => false,
                'message' => 'Chair not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Chair retrieved successfully',
            'data' => $chair,
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
        $chair = Chair::find($id);

        if (!$chair) {
            return response()->json([
                'success' => false,
                'message' => 'Chair not found',
            ], 404);
        }

        DB::beginTransaction();
        $chair->delete();
        DB::commit();

        return response()->json([
            'success' => true,
            'message' => 'Chair deleted successfully',
        ], 200);
    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json([
            'success' => false,
            'message' => $e->getMessage(),
        ], 500);
    }
}

public function update(Request $request, $id)
{
    try {
        $chair = Chair::find($id);

        if (!$chair) {
            return response()->json([
                'success' => false,
                'message' => 'Chair not found',
            ], 404);
        }

        DB::beginTransaction();

        if ($request->has('table_id')) {
            $table = Table::find($request->table_id);

            if (!$table) {
                return response()->json([
                    'success' => false,
                    'message' => 'Table not found with given ID',
                ], 422);
            }

            $chair->table_id = $request->table_id;
        }

        if ($request->has('name')) {
            $chair->name = $request->name;
        }

        if ($request->has('status')) {
            $chair->status = $request->status;
        }

        $chair->save();
        DB::commit();

        return response()->json([
            'success' => true,
            'message' => 'Chair updated successfully',
            'data' => $chair,
        ], 200);
    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json([
            'success' => false,
            'message' => $e->getMessage(),
        ], 500);
    }
}



   
    //Chairs Section End
}
