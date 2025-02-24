<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\BookingPlan;
use App\Models\User;
use Illuminate\Http\Request;

class GlobalController extends Controller
{

    public function search(Request $request)
    {
        $branchId = auth()->user()->branch->id;
        $query = $request->input('query');
        $type = $request->input('type');

        // Allowed types
        $allowedTypes = ['user', 'company', 'employee'];
        if (!in_array($type, $allowedTypes)) {
            return response()->json(['success' => false, 'message' => 'Invalid type'], 400);
        }

        return $this->searchUsersByType($branchId, $query, $type);
    }

    private function searchUsersByType($branchId, $query, $type)
    {
        $conditions = [
            'created_by_branch_id' => $branchId,
            'type' => $type,
            'status' => 'active'
        ];

        if ($type === 'user') {
            $conditions['company_id'] = null;
        }

        $results = User::where($conditions)
            ->where('name', 'like', "%$query%")
            ->select('id', 'name', 'email', 'phone_no')
            ->get();

        return response()->json(['success' => true, 'results' => $results], 200);
    }

    public function searchPlan(Request $request)
    {
        $branchId = auth()->user()->branch->id;
        $query = $request->input('query');

        $plans = BookingPlan::where(['branch_id' => $branchId])->where('name', 'like', "%$query%")->select('id', 'name', 'price', 'type')->get();

        return response()->json(['success' => true, 'results' => $plans], 200);
    }

    public function getMembers()
    {
        $branchId = auth()->user()->branch->id;

        $members = User::where(['created_by_branch_id' => $branchId, 'type' => 'user', 'status' => 'active', 'company_id' => null])->select('id', 'name')->get();

        return response()->json(['success' => true, 'members' => $members], 200);
    }

    public function getCompanies()
    {
        $branchId = auth()->user()->branch->id;

        $companies = User::where(['created_by_branch_id' => $branchId, 'type' => 'company', 'status' => 'active'])->select('id', 'name')->get();

        return response()->json(['success' => true, 'companies' => $companies], 200);
    }
}