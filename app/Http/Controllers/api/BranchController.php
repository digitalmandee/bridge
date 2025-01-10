<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Branch;
use Illuminate\Support\Facades\DB;


class BranchController extends Controller
{
    public function index()
    {

        try {

            $branches = Branch::branches();

            return response()->json([
                'success' => true,
                'message' => 'Branches fetched successfully',
                'data' => $branches,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching branches: ' . $e->getMessage(),
            ], 500);
        }
    }


    public function store(Request $request)
    {
        try {
            DB::beginTransaction();

            $branch = Branch::storeBranch($request);
            // dd($branch);

            DB::commit();


            return response()->json([
                'success' => true,
                'message' => 'Branch created successfully!',
                'data' => $branch,
            ],201);

        
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
        try
        {
            $branch = Branch::findOrFail($id);
            return response()->json([
                'success' => true,
                'message' => 'Branch Fetched successfully',
                'data' => $branch,
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
            $branch = Branch::updateBranch($request, $id);

            return response()->json([
                'success' => true,
                'message' => 'Branch Updated successfully!',
                'data' => $branch,
            ],201);

        
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
            Branch::destroyBranch($id);

            return response()->json([
                'success' => true,
                'message' => 'Branch Deleted successfully!',
            ],201);

        
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
