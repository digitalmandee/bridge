<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class MemberController extends Controller
{
    public function getUsers(Request $request)
    {
        $limit = $request->query('limit') ?? 10;
        $branchId = auth()->user()->branch->id;
        $users = User::where('type', 'user')->where('created_by_branch_id', $branchId)->select('id', 'name', 'created_by_branch_id', 'company_id', 'status')->with(['userBranch:id,name', 'company:id,name'])->paginate($limit)->through(fn($user) => array_merge($user->toArray(), ['last_login_human' => $user->last_login_human]));;

        return response()->json(['success' => true, 'users' => $users]);
    }
    public function getCompanies(Request $request)
    {
        $limit = $request->query('limit') ?? 10;
        $branchId = auth()->user()->branch->id;
        $companies = User::where('type', 'company')->where('created_by_branch_id', $branchId)->select('id', 'name', 'created_by_branch_id', 'company_id', 'status', 'created_at')->with(['userBranch:id,name'])->paginate($limit)->through(fn($user) => array_merge($user->toArray(), ['total_members' => $user->total_members]));;

        return response()->json(['success' => true, 'companies' => $companies]);
    }
}