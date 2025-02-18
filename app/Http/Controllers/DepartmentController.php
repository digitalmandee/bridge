<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Department;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        try {
            $type = $request->query('type', 'list');
            $query = $request->query('query');
            $branchId = auth()->user()->branch->id;
            if (!$branchId) return response()->json(['message' => 'Branch ID parameter is required'], 400);

            if ($type == 'search') {
                $departments = Department::where('branch_id', $branchId)->where('name', 'like', "%$query%")->select('id', 'name')->get();

                return response()->json(['success' => true, 'results' => $departments], 200);
            } else {
                $limit = $request->query('limit') ?? 10;

                $departments = Department::where('branch_id', $branchId)->select('id', 'branch_id', 'name')->with('branch:id,name')->paginate($limit);
                return response()->json(['success' => true, 'message' => 'Departments retrieved successfully', 'deparments' => $departments], 200);
            }
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'message' => $th->getMessage()], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
        ]);

        try {
            $branchId = auth()->user()->branch->id;
            if (!$branchId) return response()->json(['message' => 'Branch ID parameter is required'], 400);

            $department = Department::create([
                'branch_id' => $branchId,
                'name' => $request->name,
            ]);

            return response()->json(['success' => true, 'message' => 'Department created successfully', 'department' => $department], 200);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'message' => $th->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $department = Department::find($id);

        return response()->json(['success' => true, 'message' => 'Department retrieved successfully', 'department' => $department], 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string',
        ]);

        try {
            $department = Department::find($id);
            $department->update([
                'name' => $request->name,
            ]);

            return response()->json(['success' => true, 'message' => 'Department updated successfully', 'department' => $department], 200);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'message' => $th->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            $department = Department::find($id);
            $department->delete();

            return response()->json(['success' => true, 'message' => 'Department deleted successfully'], 200);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'message' => $th->getMessage()], 500);
        }
    }
}