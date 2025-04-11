<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BookingPlan;
use App\Models\User;
use Illuminate\Http\Request;

class GlobalController extends Controller
{
    public function search(Request $request)
    {
        $query = $request->input('query');
        $type = $request->input('type');

        // Allowed types
        $allowedTypes = ['user', 'company', 'employee'];
        if (!in_array($type, $allowedTypes)) {
            return response()->json(['success' => false, 'message' => 'Invalid type'], 400);
        }

        return $this->searchUsersByType($query, $type);
    }

    private function searchUsersByType($query, $type)
    {
        $conditions = [
            'type' => $type,
            'status' => 'active'
        ];

        $queryBuilder = User::where($conditions);

        if ($type === 'user') {
            $conditions['company_id'] = null;
            $queryBuilder->with('userProfile:id,user_id,linkedin,facebook,freelance_site');
        } elseif ($type === 'company') {
            $queryBuilder->with('companyProfile:id,user_id,name,website,industry,employees,address');
        }

        $results = $queryBuilder
            ->where($conditions)
            ->where('name', 'like', "%$query%")
            ->select('id', 'name', 'email', 'phone_no', 'secondary_phone_no', 'designation', 'cnic_number', 'cnic_image')
            ->get();

        return response()->json(['success' => true, 'results' => $results], 200);
    }

    public function searchPlan(Request $request)
    {
        $query = $request->input('query');

        $plans = BookingPlan::where('name', 'like', "%$query%")->select('id', 'name', 'price', 'type')->get();

        return response()->json(['success' => true, 'results' => $plans], 200);
    }

    public function getMembers()
    {
        $members = User::where(['type' => 'user', 'status' => 'active', 'company_id' => null])->select('id', 'name')->get();

        return response()->json(['success' => true, 'members' => $members], 200);
    }

    public function getCompanies()
    {
        $companies = User::where(['type' => 'company', 'status' => 'active'])->select('id', 'name')->get();

        return response()->json(['success' => true, 'companies' => $companies], 200);
    }
}
