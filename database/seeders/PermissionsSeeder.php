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

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        $superAdminRole = Role::firstOrCreate(['name' => 'super_admin']);

        $superAdminRole->syncPermissions($permissions);

        $user = User::find(1);
        if ($user) {
            $user->role_id = 1;
            // $user->assignRole('super_admin');
        }
    }
}