<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    const USER_FOUND = 'User Found Successfully';
    const USER_ADD =   'Added User Successfully';
    const USER_UPDATED = 'Updated User Successfully';
    const ERROR_MESSAGE = 'Something Went Wrong';
    const STATUS_OK          = 200;
    const STATUS_CREATED     = 201;
    const STATUS_VALIDATED   = 422;
    const STATUS_UNAUTHORIZE = 401;
    const STATUS_ERROR       = 500;
    const NEED_VERIFICATION  = 202;
    const USER_UPDATE = 'User Update Successfully';

    protected $httpResponse;

    public function index()
    {
        try {
            // Fetch all users including soft-deleted users
            $users = User::all();

            return response()->json([
                'success' => true,
                'message' => 'Users fetched successfully',
                'data' => $users,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching users: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {

            DB::beginTransaction();
            // Validate the input
            $validated = $request->validate([
                'name' => 'required|string',
                'email' => 'required|email',
                'password' => 'required|string',
                'role_id' => 'required|numeric',

            ]);

            $hash_password = Hash::make($validated['password']);

            // Create the booking
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => $hash_password,
                'role_id' => $validated['role_id'],
            ]);


            DB::commit();


            return response()->json([
                'success' => true,
                'message' => 'User created successfully!',
                'data' => $user,
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->validator->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }




    public function update(Request $request, $id)
    {
        try {
            // Validate the input
            $validated = $request->validate([
                'name' => 'sometimes|required|string',
                'email' => 'sometimes|required|email|unique:users,email,' . $id,
                'password' => 'sometimes|required|string',
                'role_id' => 'sometimes|required|numeric',
            ]);

            // Find the user or fail
            $user = User::findOrFail($id);

            // Update the user's attributes
            if (isset($validated['name'])) {
                $user->name = $validated['name'];
            }
            if (isset($validated['email'])) {
                $user->email = $validated['email'];
            }
            if (isset($validated['password'])) {
                $user->password = Hash::make($validated['password']);
            }
            if (isset($validated['password'])) {
                $user->role_id = $validated['role_id'];
            }

            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'User updated successfully!',
                'data' => $user,
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->validator->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating user: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function delete($id)
    {
        try {
            // Find the user or fail
            $user = User::findOrFail($id);

            // Soft delete the user
            $user->delete();

            return response()->json([
                'success' => true,
                'message' => 'User deleted successfully!',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting user: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function userLogin(Request $request)
    {
        // Validate the incoming request
        $validatedData = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        // Attempt to find the user
        $user = User::where('email', $validatedData['email'])
            ->select(['id', 'name', 'email', 'phone_no', 'type', 'password'])
            ->first();

        // Verify user existence and password
        if (!$user || !Hash::check($validatedData['password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials. Please try again.',
            ], 401);
        }

        // Generate token
        $token = $user->createToken('my-app-token')->plainTextToken;

        // Fetch the user's role and permissions
        $role = $user->roles()->first(); // Assuming the user has one role
        $permissions = $role ? $role->permissions->pluck('name')->toArray() : [];

        // Convert User model to an array & hide password
        $userData = $user->makeHidden(['password'])->toArray();

        // Prepare response data
        $data = array_merge($userData, [
            'token' => $token,
            'role' => $role ? $role->name : null,
            'permissions' => $permissions,
        ]);

        // Return success response
        return response()->json([
            'success' => true,
            'message' => 'User logged in successfully.',
            'data' => $data,
        ], 200);
    }

    public function getUser()
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found.'
            ], 404);
        }

        // Fetch user role and permissions
        $role = $user->roles()->first();
        $permissions = $role ? $role->permissions->pluck('name')->toArray() : [];

        // Basic user data without password
        $data = $user->only(['id', 'name', 'email', 'phone_no', 'type']);

        // Role and permissions
        $data['role'] = $role ? $role->name : null;
        $data['permissions'] = $permissions;

        // Add branch-related data based on user type
        if ($user->type === 'user') {
            $data['branch'] = $user->userBranch->only(['id', 'name', 'location']);
            $data['created_by_branch_id'] = $user->created_by_branch_id;
        } elseif ($user->type === 'admin') {
            $data['branch_id'] = $user->branch->id ?? null;
        }

        return response()->json($data, 200);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }
}