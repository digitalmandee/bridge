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
            ],
            'admin' => [
                'Dashboard' => ['admin-dashboard'],
                'Seat Booking' => ['floor-plan', 'price-plan', 'booking-request', 'seat-card'],
                'Booking Management' => ['room-booking', 'booking-requests'],
                'Invoice' => ['invoice-dashboard', 'new-invoice', 'invoice-management'],
                'Member' => ['Company', 'users', 'contracts'],
                'Employee Management' => ['employee-dashboard', 'attendance', 'leave-category', 'leave-application', 'leave-management', 'leave-report', 'manage-attendance', 'monthly-report'],
                'Users Role Management' => ['roles', 'employee-users'],
            ]
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
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        // $investerRole = Role::firstOrCreate(['name' => 'invester']);
        // $userRole = Role::firstOrCreate(['name' => 'user']);

        // Assign Permissions to Roles
        $superAdminRole->syncPermissions(Permission::where('category', 'superadmin')->pluck('name'));
        $adminRole->syncPermissions(Permission::where('category', 'admin')->pluck('name'));
        // $investerRole->syncPermissions(Permission::where('category', 'invester')->pluck('name'));
        // $userRole->syncPermissions(Permission::where('category', 'user')->pluck('name'));

        // Assign Roles to Users
        $superAdmin = User::find(1);
        $branchManager = User::find(2);
        // $user = User::find(3);

        if ($superAdmin) {
            $superAdmin->assignRole('superadmin');
        }
        if ($branchManager) {
            $branchManager->assignRole('admin');
        }
    }
}
