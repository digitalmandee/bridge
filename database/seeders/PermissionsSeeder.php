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
        // Define the guard name for Sanctum
        $guardName = 'sanctum';

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

        // Create permissions for the Sanctum guard
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(
                ['name' => $permission, 'guard_name' => $guardName]
            );
        }

        // Create or fetch the super admin role for the Sanctum guard
        $superAdminRole = Role::firstOrCreate(
            ['name' => 'admin', 'guard_name' => $guardName]
        );

        // Assign all permissions to the super admin role, except 'manage-members'
        $superAdminRole->syncPermissions(
            array_filter(
                $permissions,
                fn($permission) => $permission !== 'branch-manager'
            )
        );

        // Assign the super admin role to the first user
        $user = User::find(1); // Adjust the user ID as needed
        if ($user) {
            $user->role_id = 1;
        }
    }
}