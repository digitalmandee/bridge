<?php

namespace App\Http\Controllers;

use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class BranchAuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Find tenant by email
        $tenant = Tenant::where('email', $request->email)->first();

        if (!$tenant || !Hash::check($request->password, $tenant->password)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        // Initialize tenant's database
        tenancy()->initialize($tenant);

        // Generate a token
        $token = $tenant->createToken('tenant_token')->plainTextToken;

        return response()->json(['message' => 'Login successful', 'token' => $token, 'tenant_id' => $tenant->id]);
    }
}