<?php

namespace App\Http\Controllers;

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

        return view('admin.roles.index', compact('roles'));
    }

    public function roleCreate()
    {
        $permissions = Permission::all();

        return view('admin.roles.create', compact('permissions'));
    }

    public function roleStore(Request $request)
    {
        try {
            $formattedName = Str::snake(strtolower($request->name));

            $role = new Role();
            $role->name = $formattedName;
            $role->save();

            if ($request->permissions) {
                $permissions = array_map('intval', $request->permissions);
                $role->syncPermissions($permissions);
            }

            return redirect()->route('admin.roles')->with('success', 'Role created successfully');
        } catch (\Exception $e) {
            return redirect()->route('admin.roles.create')->with('error', 'There was an error creating the role. Please try again.');
        }
    }

    public function roleEdit($id)
    {
        $role = Role::find($id);
        $permissions = Permission::all();
        $assignedPermissions = $role->permissions->pluck('id')->toArray();

        return view('admin.roles.edit', compact('role', 'permissions', 'assignedPermissions'));
    }

    public function roleUpdate(Request $request, $id)
    {
        try {
            $formattedName = Str::snake(strtolower($request->name));

            $role = Role::find($id);
            $role->name = $formattedName;
            $role->save();

            if ($request->permissions) {
                $permissionIds = array_map('intval', $request->permissions);
                $role->syncPermissions($permissionIds);
            } else {
                $role->syncPermissions([]);
            }

            return redirect()->route('admin.roles')->with('success', 'Role update successfully');
        } catch (\Exception $e) {
            return redirect()->route('admin.roles.edit')->with('error', 'There was an error update the role. Please try again.');
        }
    }

    public function roleDestroy($id)
    {
        try {
            $role = Role::find($id);
            $role->syncPermissions([]);
            $role->delete();
            
            return redirect()->route('admin.roles')->with('success', 'Role deleted successfully');
        } catch (\Exception $e) {
            return redirect()->route('admin.roles')->with('error', 'There was an error deleted the role. Please try again.');
        }
    }

    public function permissionIndex()
    {
        $permissions = Permission::all();

        return view('admin.permissions.index', compact('permissions'));
    }

    public function permissionCreate()
    {

        return view('admin.permissions.create');
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

            return redirect()->route('admin.permissions')->with('success', 'Permission created successfully');
        } catch (\Exception $e) {
            return redirect()->route('admin.permissions.create')->with('error', 'There was an error creating the permission. Please try again.');
        }
    }

    public function permissionEdit($id)
    {
        $permission = Permission::find($id);

        return view('admin.permissions.edit', compact('permission'));
    }

    public function permissionUpdate(Request $request, $id)
    {
        try {
            $formattedName = strtolower(trim($request->name));
            $formattedName = str_replace(' ', '-', $formattedName);

            $permission = Permission::find($id);
            $permission->name = $formattedName;
            $permission->save();

            $superAdminRole = Role::findByName('super_admin');

            if ($superAdminRole) {
                if (!$superAdminRole->hasPermissionTo($permission)) {

                    $superAdminRole->givePermissionTo($permission);
                }
            }
            return redirect()->route('admin.permissions')->with('success', 'Permission update successfully');
        } catch (\Exception $e) {
            return redirect()->route('admin.permissions.edit')->with('error', 'There was an error update the permission. Please try again.');
        }
    }

    public function permissionDestroy($id)
    {
        DB::beginTransaction();
        try {
            $permission = Permission::find($id);

            $permission->roles()->detach();

            $permission->delete();

            DB::commit();
            return redirect()->route('admin.permissions')->with('success', 'Permission deleted successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('admin.permissions')->with('error', 'There was an error deleted the permission. Please try again.');
        }
    }
}
