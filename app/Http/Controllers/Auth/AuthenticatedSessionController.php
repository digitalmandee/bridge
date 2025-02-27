<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request)
    {
        // Validate the incoming request
        $validatedData = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        // Attempt to find the user
        $user = User::where('email', $validatedData['email'])->select(['id', 'name', 'email', 'password'])->first();

        // Verify user existence and password
        if (!$user || !Hash::check($validatedData['password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials. Please try again.',
            ], 401);
        }

        // Generate authentication token
        $token = $user->createToken('my-app-token')->plainTextToken;

        // Fetch user role & permissions (if applicable)
        $role = $user->roles()->first(); // Assuming the user has a single role
        $permissions = $role ? $role->permissions->pluck('name')->toArray() : [];

        // Update last login time
        // $user->update(['last_login_at' => Carbon::now()]);

        // Prepare response data
        $responseData = [
            'id'           => $user->id,
            'name'         => $user->name,
            'email'        => $user->email,
            // 'phone_no'     => $user->phone_no,
            // 'profile_image'     => $user->profile_image,
            // 'last_login_human' => $user->last_login_human,
            // 'type'         => $user->type,
            // 'role'         => $role ? $user->type : null,
            'permissions'  => $permissions,
            'token'        => $token,
        ];

        // Return successful response
        return response()->json(['success' => true, 'message' => 'User logged in successfully.', 'data'    => $responseData], 200);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): Response
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return response()->noContent();
    }
}