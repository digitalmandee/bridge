<?php

namespace Database\Seeders;

use App\Models\Permission as ModelsPermission;
use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Define Permissions with Category (Role Type) and Subcategory (Functional Group)
        $permissions = [
            'superadmin' => [
                'Dashboard' => ['dashboard'],
                'Branch' => ['branch-management', 'branch-create'],
                'Investor' => ['investors-dashboard', 'investors-management', 'investors-create', 'investors-types'],
            ],
            'investor' => [
                'Dashboard' => ['investor-dashboard', 'investor-management'],
            ],
        ];

        // Create Permissions
        foreach ($permissions as $category => $subcategories) {
            foreach ($subcategories as $subcategory => $perms) {
                foreach ($perms as $perm) {
                    Permission::firstOrCreate([
                        'name' => $perm,
                        'category' => $category,  // User type (Admin, User, Investor, etc.)
                        'subcategory' => $subcategory,  // Functional Group (Booking Management, Finance, etc.)
                    ]);
                }
            }
        }

        // Create Roles
        $superAdminRole = Role::firstOrCreate(['name' => 'superadmin']);
        $investerRole = Role::firstOrCreate(['name' => 'investor']);
        // $investerRole = Role::firstOrCreate(['name' => 'invester']);
        // $userRole = Role::firstOrCreate(['name' => 'user']);

        // Assign Permissions to Roles
        $superAdminRole->syncPermissions(Permission::where('category', 'superadmin')->pluck('name'));
        $investerRole->syncPermissions(Permission::where('category', 'investor')->pluck('name'));
        // $investerRole->syncPermissions(Permission::where('category', 'invester')->pluck('name'));
        // $userRole->syncPermissions(Permission::where('category', 'user')->pluck('name'));

        // Assign Roles to Users
        $superAdmin = User::find(1);

        if ($superAdmin) {
            $superAdmin->assignRole('superadmin');
        }
    }
}