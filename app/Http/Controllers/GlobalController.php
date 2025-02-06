<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class GlobalController extends Controller
{

    public function search(Request $request)
    {
        $branchId = auth()->user()->branch->id;
        $query = $request->input('query');
        $type = $request->input('type');

        // If searching for members (type = 'user')
        if ($type == 'user') {
            $members = User::where(['created_by_branch_id' => $branchId, 'type' => 'user', 'status' => 'active', 'company_id' => null])->where('name', 'like', "%$query%")->select('id', 'name', 'email')->get();

            return response()->json(['success' => true, 'results' => $members], 200);
        }

        // If searching for companies (type = 'company')
        if ($type == 'company') {
            $companies = User::where(['created_by_branch_id' => $branchId, 'type' => 'company', 'status' => 'active'])->where('name', 'like', "%$query%")->select('id', 'name', 'email')->get();

            return response()->json(['success' => true, 'results' => $companies], 200);
        }

        return response()->json(['success' => false, 'message' => 'Invalid type'], 400);
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