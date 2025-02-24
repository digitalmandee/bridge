<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class BranchUserController extends Controller
{
    /**
     * Display a listing of the users for the branch.
     */
    public function index(Request $request)
    {
        $limit = $request->query('limit') ?? 10;

        $users = User::where('created_by_branch_id', auth()->user()->branch->id)->with('roles')->where('type', 'admin')->paginate($limit);

        return response()->json(['success' => true, 'users' => $users], 200);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            // 'password' => 'required|min:6',
            'role' => 'required|string',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            // 'password' => bcrypt($validated['password']),
            'type' => 'admin',
            'created_by_branch_id' => auth()->user()->branch->id, // Assigning branch ID
        ]);

        $user->assignRole($validated['role']); // Assign role

        return response()->json(['message' => 'User created successfully', 'user' => $user]);
    }

    /**
     * Display the specified user.
     */
    public function show($id)
    {
        $user = User::with('roles')->select(['id', 'name', 'email', 'type'])->find($id); // Load user with role

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json($user);
    }

    /**
     * Update the specified user.
     */


    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string|exists:roles,name',
        ]);

        $user = User::findOrFail($id);

        $user->update([
            'name' => $validated['name'],
        ]);

        // Assign new role (replace previous ones)
        $user->syncRoles([$validated['role']]);

        // Refresh user instance to reflect changes
        $user->refresh();

        return response()->json(['message' => 'User updated successfully']);
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }
}