<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\BranchManager;
use Illuminate\Support\Facades\DB;


class BranchManagerController extends Controller
{
    public function index()
    {
        try
        {
            $branchManagers = BranchManager::getBranchManagers();

            return response()->json([
                'success' => true,
                'message' => 'BranchMangers fetched successfully',
                'data' => $branchManagers,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching BranchMangers: ' . $e->getMessage(),
            ], 500);
        }
    }


    public function store(Request $request)
    {
        try {
            DB::beginTransaction();

            $branch_manger = BranchManager::storeBranchManager($request);

            DB::commit();
            return response()->json([
                'success' => true,
                'message' => 'BranchManger created successfully',
                'data' => $branch_manger,
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
        try
        {
            $branch_manger = BranchManager::with(['branch' => function ($query) {
                $query->select('id', 'name');
            },
            'user' => function ($query) {
                $query->select('id', 'name', 'email');
            }])
            ->find($id);

            return response()->json([
                'success' => true,
                'message' => 'BranchManger Fetched successfully',
                'data' => $branch_manger,
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
            DB::beginTransaction();

            $branch_manger = BranchManager::updateBranchManager($request, $id);

            DB::commit();
            return response()->json([
                'success' => true,
                'message' => 'BranchManger updated successfully',
                'data' => $branch_manger,
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
            DB::beginTransaction();
            BranchManager::deleteBranchManager($id);
            DB::commit();
            return response()->json([
                'success' => true,
                'message' => 'BranchManger Deleted successfully',
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
