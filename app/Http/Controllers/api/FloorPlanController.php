<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Floor;
use App\Models\Branch;

class FloorPlanController extends Controller
{
    //
    public function index()
    {
        try {
            // Fetch all users including soft-deleted users
            $users = Floor::getFloors();

            return response()->json([
                'success' => true,
                'message' => 'Floors fetched successfully',
                'data' => $users,
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

            $branch = Branch::where('id', $request->branch_id)
                ->where('status', 1)
                ->first();
            if(!$branch)
            {
                return response()->json([
                    'success' => false,
                    'message' => 'Branch Not Found with given ID or Branch is Inactive',
                ], 423);
            }

            $formattedName = ucwords(strtolower($request->name));

            $floor = new Floor();
            $floor->branch_id = $request->branch_id;
            $floor->name = $formattedName;
            $floor->save();
            // Fetch all users including soft-deleted users

            return response()->json([
                'success' => true,
                'message' => 'Floor Created successfully',
                'data' => $floor,
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

            $floor = Floor::with(['branch' => function ($query) {
                $query->where('status', 1);
            }])
                ->find($id);

            if(!$floor)
            {
                return response()->json([
                    'success' => False,
                    'message' => 'Floor Not Found with Given ID or Floor related Branch Is Inactive',
                ], 423);

            }

            return response()->json([
                'success' => true,
                'message' => 'Floor Fetched successfully',
                'data' => $floor,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching Floor: ' . $e->getMessage(),
            ], 500);
        }
    }


    public function update(Request $request,$id)
    {
        try
        {
            $floor = Floor::findOrFail($id);

            $branch = Branch::where('id',$request->branch_id)->where('status',1)->first();

            if(!$branch)
            {
                return response()->json([
                    'success' => false,
                    'message' => 'Your Given Branch Id is Invalid or Branch is Inactive',
                ], 423);
            }
            

            $upd_floor = Floor::updateFloor($request,$id);

            return response()->json([
                'success' => true,
                'message' => 'Floor Updated successfully',
                'data' => $upd_floor,
            ], 200);

        }catch(\Exception $e){
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function delete($id)
    {
        try
        {
            $floor = Floor::findOrfail($id);

            $floor->delete();

            return response()->json([
                'success' => true,
                'message' => 'Floor Deleted successfully',
            ], 200);


        }catch(\Exception $e){
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
