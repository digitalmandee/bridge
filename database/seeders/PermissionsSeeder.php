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
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $investerRole = Role::firstOrCreate(['name' => 'invester']);
        $userRole = Role::firstOrCreate(['name' => 'user']);

        $superAdminRole->syncPermissions($permissions);
        $adminRole->syncPermissions($permissions);
        $investerRole->syncPermissions($permissions);
        $userRole->syncPermissions(['dashboard', 'booking-management', 'roles', 'permissions', 'manage-members']);

        $superAdmin = User::find(1);
        $branchManager = User::find(2);
        // $investor = User::find(3);
        $user = User::find(3);
        // $user2 = User::find(5);
        // $user3 = User::find(6);

        $superAdmin->assignRole('super_admin');
        $branchManager->assignRole('admin');
        // $investor->assignRole('invester');
        $user->assignRole('user');
        // $user2->assignRole('user');
        // $user3->assignRole('user');
    }
}