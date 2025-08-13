<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FinanceCategory;
use Illuminate\Http\Request;

class FinanceCategoryController extends Controller
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

            if ($type == 'search') {
                if (empty($query)) {
                    $financeCategories = FinanceCategory::latest()->select('id', 'name')->take(5)->get();
                } else {
                    $financeCategories = FinanceCategory::where('name', 'like', "%$query%")->select('id', 'name')->get();
                }

                return response()->json(['success' => true, 'results' => $financeCategories], 200);
            } else {
                $limit = $request->query('limit') ?? 10;

                $financeCategories = FinanceCategory::select('id', 'name')->paginate($limit);
                return response()->json(['success' => true, 'message' => 'Finance Categories retrieved successfully', 'financeCategories' => $financeCategories], 200);
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
            $financeCategory = FinanceCategory::create([
                'name' => $request->name,
            ]);

            return response()->json(['success' => true, 'message' => 'Finance Category created successfully', 'financeCategory' => $financeCategory], 200);
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
        $financeCategory = FinanceCategory::find($id);

        return response()->json(['success' => true, 'message' => 'Finance Category retrieved successfully', 'financeCategory' => $financeCategory], 200);
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
            $financeCategory = FinanceCategory::find($id);
            $financeCategory->update([
                'name' => $request->name,
            ]);

            return response()->json(['success' => true, 'message' => 'Finance Category updated successfully', 'financeCategory' => $financeCategory], 200);
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
            $financeCategory = FinanceCategory::find($id);
            $financeCategory->delete();

            return response()->json(['success' => true, 'message' => 'Finance Category deleted successfully'], 200);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'message' => $th->getMessage()], 500);
        }
    }
}
