<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionController extends Controller
{
    public function index()
    {
        $roles = Role::with('permissions')->whereNotIn('name', ['super_admin', 'invester', 'user'])->get();
        return response()->json($roles);
    }

    public function getPermissions()
    {
        $permissions = Permission::where('category', 'admin')->get()->groupBy('subcategory');

        return response()->json($permissions);
    }

    public function show($id)
    {
        // Find role by ID with assigned permissions
        $role = Role::with('permissions')->findOrFail($id);

        return response()->json($role);
    }


    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:roles,name',
            'permissions' => 'array',
        ]);

        DB::beginTransaction();
        // Create role
        $role = Role::firstOrCreate(['name' => $request->name, 'guard_name' => 'web']);

        // Convert permission IDs to names before syncing
        if ($request->has('permissions')) {
            $permissions = Permission::whereIn('id', $request->permissions)->pluck('name')->toArray();
            $role->syncPermissions($permissions);
        }

        DB::commit();

        return response()->json(['message' => 'Role created successfully']);
    }


    public function update(Request $request, Role $role)
    {
        $request->validate([
            'name' => 'required|unique:roles,name,' . $role->id,
            'permissions' => 'array',
        ]);

        // Update role name
        $role->update(['name' => $request->name]);

        // Convert permission IDs to names if needed
        if ($request->has('permissions')) {
            $permissions = Permission::whereIn('id', $request->permissions)->pluck('name')->toArray();
            $role->syncPermissions($permissions);
        }

        return response()->json(['message' => 'Role updated successfully']);
    }

    public function destroy(Role $role)
    {
        $role->delete();
        return response()->json(['message' => 'Role deleted successfully']);
    }
}