<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class GlobalController extends Controller
{
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
