<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class PermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Define the guard name
        $guardName = 'web'; // Change to your desired guard name

        // List of permissions
        $permissions = [
            'dashboard',
            'branches',
            'branch-manager',
            'products',
            'floor-plan',
            'inventory-management',
            'booking-management',
            'expense-management',
            'financial-report',
            'revenue-check',
            'roles',
            'permissions',
            'manage-members',
            'setup-invoice',
            'master-layout',
            'investor',
        ];

        // Create permissions for the specified guard
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(
                ['name' => $permission, 'guard_name' => $guardName]
            );
        }

        // Create or fetch the super admin role for the specified guard
        $superAdminRole = Role::firstOrCreate(
            ['name' => 'super_admin', 'guard_name' => $guardName]
        );

        // Assign all permissions to the super admin role
        $superAdminRole->syncPermissions(
            Permission::where('guard_name', $guardName)->pluck('name')->toArray()
        );



        // Assign the super admin role to the first user
        $user = User::find(1); // Adjust the user ID as needed

        if ($user) {
            // $user->role_id = $superAdminRole->id;
            $user->assignRole($superAdminRole); // Ensure the role uses the same guard as the user
        }
    }
}
