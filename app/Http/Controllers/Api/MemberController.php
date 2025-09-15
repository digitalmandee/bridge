<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class MemberController extends Controller
{
    public function getUsers(Request $request)
    {
        $limit = $request->query('limit') ?? 10;
        $search = $request->query('search');  // Get search input

        $query = User::where('type', 'user')->select('id', 'email', 'name', 'company_id', 'status', 'last_login_at')->with(['company:id,name']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q
                    ->where('name', 'like', "%{$search}%")
                    ->orWhereHas('company', function ($q2) use ($search) {
                        $q2->where('name', 'like', "%{$search}%");
                    });
            });
        }

        $users = $query->paginate($limit);

        return response()->json(['success' => true, 'users' => $users]);
    }

    public function getMemberDetail(Request $request, $id)
    {
        // Fetch the company details with minimal data
        $user = User::where('id', $id)->select(['id', 'name', 'email', 'type', 'profile_image', 'phone_no'])->firstOrFail();

        return response()->json(['success' => true, 'user' => $user]);
    }

    public function getCompanies(Request $request)
    {
        $limit = $request->query('limit', 10);
        $companyId = $request->query('company_id');
        $search = $request->query('search');  // NEW: search parameter

        $query = User::where('type', 'company');

        if ($companyId) {
            $query->where('id', $companyId);
        }

        // NEW: Apply search filter
        if ($search) {
            $query->where('name', 'like', '%' . $search . '%');
        }

        $companies = $query
            ->select('id', 'name', 'company_id', 'status', 'created_at')
            ->paginate($limit)
            ->through(function ($user) {
                // Calculate total chairs for this company
                $chairIds = $user
                    ->booking()
                    ->where('status', 'confirmed')
                    ->get()
                    ->pluck('chair_ids')
                    ->flatten(1)
                    ->unique();

                $totalChairs = $chairIds->count();

                return array_merge($user->toArray(), [
                    'total_members' => $user->total_members,
                    'total_chairs' => $totalChairs
                ]);
            });

        return response()->json(['success' => true, 'companies' => $companies]);
    }

    public function getSimpleCompanies(Request $request)
    {
        $companies = User::where('type', 'company')->select('id', 'name')->orderBy('name')->take(15)->get();

        return response()->json(['success' => true, 'companies' => $companies]);
    }

    public function getCompanyDetail(Request $request, $id)
    {
        $limit = (int) $request->input('limit', 10);  // Ensure limit is integer for performance

        // Fetch company users with optimized pagination
        $companyUsers = User::where('company_id', $id)->select(['id', 'name', 'email', 'status', 'company_id', 'last_login_at'])->orderByDesc('created_at')->paginate($limit);

        return response()->json([
            'success' => true,
            'company_users' => $companyUsers,  // Paginated results
        ]);
    }
}