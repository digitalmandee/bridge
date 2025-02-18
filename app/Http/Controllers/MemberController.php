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
        $users = User::where('type', 'user')->where('created_by_branch_id', $branchId)->select('id', 'name', 'created_by_branch_id', 'company_id', 'status', 'last_login_at')->with(['userBranch:id,name', 'company:id,name'])->paginate($limit);

        return response()->json(['success' => true, 'users' => $users]);
    }

    public function getMemberDetail(Request $request, $id)
    {
        // Fetch the company details with minimal data
        $user = User::where('id', $id)->select(['id', 'name', 'email', 'type', 'profile_image', 'phone_no', 'created_by_branch_id'])->with(['userBranch:id,name'])->firstOrFail();

        return response()->json(['success' => true, 'user' => $user]);
    }

    public function getCompanies(Request $request)
    {
        $limit = $request->query('limit') ?? 10;
        $branchId = auth()->user()->branch->id;
        $companyId = $request->query('company_id');
        $query = User::where('type', 'company')->where('created_by_branch_id', $branchId);

        if ($companyId) {
            $query->where('id', $companyId);
        }

        $companies = $query->select('id', 'name', 'created_by_branch_id', 'company_id', 'status', 'created_at')->with(['userBranch:id,name'])->paginate($limit)->through(fn($user) => array_merge($user->toArray(), ['total_members' => $user->total_members]));;

        return response()->json(['success' => true, 'companies' => $companies]);
    }

    public function getSimpleCompanies(Request $request)
    {
        $branchId = auth()->user()->branch->id;
        $companies = User::where('type', 'company')->where('created_by_branch_id', $branchId)->select('id', 'name')->orderBy('name')->take(15)->get();

        return response()->json(['success' => true, 'companies' => $companies]);
    }

    public function getCompanyDetail(Request $request, $id)
    {
        $limit = (int) $request->input('limit', 10); // Ensure limit is integer for performance

        // Fetch company users with optimized pagination
        $companyUsers = User::where('company_id', $id)->select(['id', 'name', 'email', 'status', 'company_id', 'last_login_at'])->orderByDesc('created_at')->paginate($limit);

        return response()->json([
            'success' => true,
            'company_users' => $companyUsers, // Paginated results
        ]);
    }
}