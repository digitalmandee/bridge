<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Permission;

class UserController extends Controller
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
        $user = User::where('email', $validatedData['email'])->first();

        // Verify user existence and password
        if (!$user || !Hash::check($validatedData['password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials. Please try again.',
            ], 401); // 401 Unauthorized is a more appropriate status code here
        }

        // Generate token
        $token = $user->createToken('my-app-token')->plainTextToken;

        // Fetch the user's role and permissions
        $role = $user->roles()->first(); // Assuming the user has one role
        $permissions = $role ? $role->permissions->pluck('name')->toArray() : [];

        // Prepare response data
        $data = [
            'token' => $token,
            ...$user->only(['id', 'name', 'email', 'phone']),
            'role' => $role ? $role->name : null,
            'permissions' => $permissions,
        ];

        // Return success response
        return response()->json([
            'success' => true,
            'message' => 'User logged in successfully.',
            'data' => $data,
        ], 200); // 200 OK is appropriate for successful logins
    }

    public function getUser()
    {
        $user = auth()->user();
        $role = $user->roles()->first(); // Assuming the user has one role
        $permissions = $role ? $role->permissions->pluck('name')->toArray() : [];

        $data = [
            ...$user->only(['id', 'name', 'email', 'phone']),
            'role' => $role ? $role->name : null,
            'permissions' => $permissions,
        ];

        return response()->json($data);
    }
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }
}
