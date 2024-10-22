<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FloorPlanController;
use App\Http\Controllers\BranchManagerController;
use App\Http\Controllers\RolePermissionController;
use App\Http\Controllers\BookingCalendarController;
use App\Http\Controllers\InventoryManagementController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::group(['middleware' => 'auth'], function () {
    Route::get('/dashboard', [DashboardController::class, 'dashboard'])->name('dashboard');

    // Branch section
    Route::get('/branches', [BranchController::class, 'index'])->name('admin.branches');
    Route::get('/admin/branches/create', [BranchController::class, 'branchCreate'])->name('admin.branches.create');
    Route::post('/admin/branch/store', [BranchController::class, 'branchStore'])->name('admin.branch.store');
    Route::get('/admin/branch/edit/{id}', [BranchController::class, 'branchEdit'])->name('admin.branch.edit');
    Route::post('/admin/branch/update/{id}', [BranchController::class, 'branchUpdate'])->name('admin.branch.update');
    Route::get('/admin/branch/delete/{id}', [BranchController::class, 'branchDestroy'])->name('admin.branch.delete');
    // Branch section end
    // Branch section
    Route::get('/admin/branch-manager', [BranchManagerController::class, 'index'])->name('admin.branch.manager');
    Route::get('/admin/branch-manager/create', [BranchManagerController::class, 'branchManagerCreate'])->name('admin.branch.manager.create');
    // Branch section end
    // Booking Calendar section
    Route::get('/admin/booking-calendar', [BookingCalendarController::class, 'index'])->name('admin.booking.calendar');
    // Booking Calendar section end
    // Booking section
    Route::get('/admin/booking', [BookingController::class, 'index'])->name('admin.booking');
    Route::get('/admin/booking/create', [BookingController::class, 'BookingCreate'])->name('admin.booking.create');
    // Booking section end
    // Inventory Management section
    Route::get('/admin/inventory-management', [InventoryManagementController::class, 'index'])->name('admin.inventory.management');
    // Inventory Management section end
    // Floor Plan Section
    Route::get('/admin/floor-plan', [FloorPlanController::class, 'index'])->name('admin.floor.plan');
    // Floor Plan Section end
    // Role Section
    Route::get('/admin/roles', [RolePermissionController::class, 'index'])->name('admin.roles');
    Route::get('/admin/roles/create', [RolePermissionController::class, 'roleCreate'])->name('admin.roles.create');
    Route::post('/admin/roles/store', [RolePermissionController::class, 'roleStore'])->name('admin.roles.store');
    Route::get('/admin/roles/edit/{id}', [RolePermissionController::class, 'roleEdit'])->name('admin.roles.edit');
    Route::post('/admin/roles/update/{id}', [RolePermissionController::class, 'roleUpdate'])->name('admin.roles.update');
    Route::get('/admin/roles/delete/{id}', [RolePermissionController::class, 'roleDestroy'])->name('admin.roles.delete');
    // Role Section end
    // Permission Section
    Route::get('/admin/permissions', [RolePermissionController::class, 'permissionIndex'])->name('admin.permissions');
    Route::get('/admin/permissions/create', [RolePermissionController::class, 'permissionCreate'])->name('admin.permissions.create');
    Route::post('/admin/permissions/store', [RolePermissionController::class, 'permissionStore'])->name('admin.permissions.store');
    Route::get('/admin/permissions/edit/{id}', [RolePermissionController::class, 'permissionEdit'])->name('admin.permissions.edit');
    Route::post('/admin/permissions/update/{id}', [RolePermissionController::class, 'permissionUpdate'])->name('admin.permissions.update');
    Route::get('/admin/permissions/delete/{id}', [RolePermissionController::class, 'permissionDestroy'])->name('admin.permissions.delete');
    // Permission Section end
});

require __DIR__ . '/auth.php';
