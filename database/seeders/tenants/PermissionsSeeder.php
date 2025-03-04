<?php

namespace Database\Seeders\Tenants;

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
            'admin' => [
                'Dashboard' => ['admin-dashboard'],
                'Seat Booking' => ['floor-plan', 'price-plan', 'booking-request', 'seat-card'],
                'Booking Management' => ['room-booking', 'booking-requests'],
                'Invoice' => ['invoice-dashboard', 'new-invoice', 'invoice-management'],
                'Member' => ['Company', 'users', 'contracts'],
                'Employee Management' => ['employee-dashboard', 'attendance', 'leave-category', 'leave-application', 'leave-management', 'leave-report', 'manage-attendance', 'monthly-report'],
                'Users Role Management' => ['roles', 'employee-users'],
            ],
            'company' => [
                'Dashboard' => ['company-dashboard'],
                'Booking Management' => ['company-room-booking', 'company-booking-requests'],
                'Invoice' => ['company-invoice-management'],
                'Staff Management' => ['company-add-staff', 'company-staff-management'],
                'Contracts' => ['company-contracts'],
            ],
            'user' => [
                'Dashboard' => ['user-dashboard'],
                'Booking Management' => ['user-room-booking', 'user-booking-requests'],
                'Invoice' => ['user-invoice-management'],
                'Contracts' => ['user-contracts'],
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
                        'guard_name' => 'web',
                    ]);
                }
            }
        }

        // Create Roles
        $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $investerRole = Role::firstOrCreate(['name' => 'invester', 'guard_name' => 'web']);
        $userRole = Role::firstOrCreate(['name' => 'user', 'guard_name' => 'web']);

        // Assign Permissions to Roles
        $adminRole->syncPermissions(Permission::where('category', 'admin')->pluck('name'));
        $investerRole->syncPermissions(Permission::where('category', 'invester')->pluck('name'));
        $userRole->syncPermissions(Permission::where('category', 'user')->pluck('name'));
    }
}
