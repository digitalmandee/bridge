<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionController extends Controller
{
    public function index()
    {
        $roles = Role::all();

        return response()->json([
            'success' => true,
            'message' => 'Get All Roles Successfully',
            'data' => $roles,
        ],201);
    }

    

    public function roleStore(Request $request)
    {
        try {

            DB::beginTransaction();
            $formattedName = Str::snake(strtolower($request->name));
            

            $role = new Role();
            $role->name = $formattedName;
            $role->save();

            $permissions = json_decode($request->permissions, true); // Converts JSON string to an array

            if ($permissions) {
                $permissions = array_map('intval', $permissions);
                $role->syncPermissions($permissions);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Role Created Successfully',
                'data' => $role,
            ],201);

        }catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => $th->getMessage(),
            ]);
        }
    }

    // public function roleEdit($id)
    // {
    //     $role = Role::find($id);
    //     $permissions = Permission::all();
    //     $assignedPermissions = $role->permissions->pluck('id')->toArray();

    //     return view('admin.roles.edit', compact('role', 'permissions', 'assignedPermissions'));
    // }

    public function roleUpdate(Request $request, $id)
    {
        try {
            $formattedName = Str::snake(strtolower($request->name));

            $role = Role::find($id);
            $role->name = $formattedName;
            $role->save();

            $permissions = json_decode($request->permissions, true); // Converts JSON string to an array

            if ($request->permissions) {
                $permissionIds = array_map('intval', $permissions);
                $role->syncPermissions($permissionIds);
            } else {
                $role->syncPermissions([]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Permission Updated Successfully',
                'data' => $role,
            ],201);

        }catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => $th->getMessage(),
            ]);
        }
    }

    public function roleDestroy($id)
    {
        try {
            $role = Role::find($id);
            $role->syncPermissions([]);
            $role->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Permission Deleted Successfully',
                'data' => $role,
            ],201);

        }catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => $th->getMessage(),
            ]);
        }
    }

    public function permissionIndex()
    {
        $permissions = Permission::all();

        return response()->json([
            'success' => true,
            'message' => 'Get All Roles Successfully',
            'data' => $permissions,
        ],201);
    }

    

    public function permissionStore(Request $request)
    {
        try {
            $formattedName = strtolower(trim($request->name));
            $formattedName = str_replace(' ', '-', $formattedName);

            $permission = new Permission();
            $permission->name = $formattedName;
            $permission->save();

            $superAdminRole = Role::findByName('super_admin');

            if ($superAdminRole) {
                $superAdminRole->givePermissionTo($permission);
            }

            return response()->json([
                'success' => true,
                'message' => 'Permission Created Successfully',
                'data' => $permission,
            ],201);

        }catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => $th->getMessage(),
            ]);
        }
    }

    

    public function permissionUpdate(Request $request, $id)
    {
        try {
            $formattedName = strtolower(trim($request->name));
            $formattedName = str_replace(' ', '-', $formattedName);

            $permission = Permission::findOrFail($id);
            $permission->name = $formattedName;
            $permission->save();

            $superAdminRole = Role::findByName('super_admin');

            if ($superAdminRole) {
                if (!$superAdminRole->hasPermissionTo($permission)) {

                    $superAdminRole->givePermissionTo($permission);
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Permission Updated Successfully',
                'data' => $permission,
            ],201);

        }catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => $th->getMessage(),
            ]);
        }
    }

    public function permissionDestroy($id)
    {
        DB::beginTransaction();
        try {
            $permission = Permission::findOrFail($id);

            $permission->roles()->detach();

            $permission->delete();

            DB::commit();
            return response()->json([
                'success' => true,
                'message' => 'Permission Deleted Successfully',
                'data' => $permission,
            ],201);

        }catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => $th->getMessage(),
            ]);
        }
    }
}
