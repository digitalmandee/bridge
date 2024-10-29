<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\ResourceController;
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
    Route::post('/admin/branch-manager/store', [BranchManagerController::class, 'branchManagerStore'])->name('admin.branch.manager.store');
    Route::get('/admin/branch-manager/edit/{id}', [BranchManagerController::class, 'branchManagerEdit'])->name('admin.branch.manager.edit');
    Route::post('/admin/branch-manager/update/{id}', [BranchManagerController::class, 'branchManagerUpdate'])->name('admin.branch.manager.update');
    Route::get('/admin/branch-manager/delete/{id}', [BranchManagerController::class, 'branchManagerDestroy'])->name('admin.branch.manager.delete');
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
    // Members Section
    Route::get('/admin/members', [MemberController::class, 'index'])->name('admin.members');
    Route::get('/admin/members/create', [MemberController::class, 'memberCreate'])->name('admin.members.create');
    Route::post('/admin/members/store', [MemberController::class, 'memberStore'])->name('admin.members.store');
    Route::get('/admin/members/edit/{id}', [MemberController::class, 'memberEdit'])->name('admin.members.edit');
    Route::post('/admin/members/update/{id}', [MemberController::class, 'memberUpdate'])->name('admin.members.update');
    Route::get('/admin/members/delete/{id}', [MemberController::class, 'memberDestroy'])->name('admin.members.delete');
    // Members Section end
    // Invoice Section
    Route::get('/admin/invoice', [InvoiceController::class, 'index'])->name('admin.invoice');
    Route::get('/admin/invoice/create', [InvoiceController::class, 'invoiceCreate'])->name('admin.invoice.create');
    Route::post('/admin/invoice/store', [InvoiceController::class, 'invoiceStore'])->name('admin.invoice.store');
    Route::get('/admin/invoice/show', [InvoiceController::class, 'invoiceShow'])->name('admin.invoice.show');
    Route::get('/admin/invoice/edit/{id}', [InvoiceController::class, 'invoiceEdit'])->name('admin.invoice.edit');
    Route::post('/admin/invoice/update/{id}', [InvoiceController::class, 'invoiceUpdate'])->name('admin.invoice.update');
    Route::get('/admin/invoice/delete/{id}', [InvoiceController::class, 'invoiceDestroy'])->name('admin.invoice.delete');
    // Invoice Section end
    // Resource Section
    Route::get('/admin/resource', [ResourceController::class, 'index'])->name('admin.resource');
    Route::get('/admin/resource/create', [ResourceController::class, 'resourceCreate'])->name('admin.resource.create');
    Route::post('/admin/resource/store', [ResourceController::class, 'resourceStore'])->name('admin.resource.store');
    Route::get('/admin/resource/edit/{id}', [ResourceController::class, 'resourceEdit'])->name('admin.resource.edit');
    Route::post('/admin/resource/update/{id}', [ResourceController::class, 'resourceUpdate'])->name('admin.resource.update');
    Route::get('/admin/resource/delete/{id}', [ResourceController::class, 'resourceDestroy'])->name('admin.resource.delete');
    // Resource Section end
});

require __DIR__ . '/auth.php';
