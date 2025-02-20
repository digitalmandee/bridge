<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\LeaveCategory;
use Illuminate\Http\Request;

class LeaveCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        // $limit =  $request->query('limit', 10);

        $branchId = auth()->user()->branch->id;

        $leaveCategories = LeaveCategory::where('branch_id', $branchId)->orderByDesc('created_at')->get();

        return response()->json(['success' => true, 'leave_categories' => $leaveCategories]);
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
            'color' => 'required|string',
            'description' => 'required|string',
        ]);

        try {
            LeaveCategory::create([
                'branch_id' => auth()->user()->branch->id,
                'name' => $request->name,
                'color' => $request->color,
                'description' => $request->description,
            ]);

            return response()->json(['success' => true, 'message' => 'Leave Category created successfully'], 201);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
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
        $leaveCategory = LeaveCategory::find($id);

        return response()->json(['success' => true, 'leave_category' => $leaveCategory]);
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
            'color' => 'required|string',
            'description' => 'required|string',
            'status' => 'required|in:published,draft',
        ]);

        try {
            LeaveCategory::find($id)->update([
                'name' => $request->name,
                'color' => $request->color,
                'description' => $request->description,
                'status' => $request->status,
            ]);

            return response()->json(['success' => true, 'message' => 'Leave Category updated successfully'], 201);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
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
            LeaveCategory::find($id)->delete();
            return response()->json(['success' => true, 'message' => 'Leave Category deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
        }
    }
}