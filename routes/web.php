<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\InvestorController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FloorPlanController;
use App\Http\Controllers\BranchManagerController;
use App\Http\Controllers\BranchSettingController;
use App\Http\Controllers\RolePermissionController;
use App\Http\Controllers\BookingCalendarController;
use App\Http\Controllers\BookingPlanController;
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
Route::post('api/check-chair-availability', [FloorPlanController::class, 'checkChairAvailability']);
Route::get('api/floor-plan', [FloorPlanController::class, 'getFloorPlan']);
Route::get('api/seat-allocations', [FloorPlanController::class, 'getSeatAllocations']);
Route::post('api/booking/create', [BookingPlanController::class, 'createBooking']);
// Booking Plans
Route::resource('api/booking-plans', BookingPlanController::class)->except(['create', 'show', 'edit']);

Route::group(['middleware' => 'auth'], function () {
    Route::get('dashboard', [DashboardController::class, 'dashboard'])->name('dashboard');
    Route::group(['prefix' => '/admin'], function () {
        // Branch section
        Route::get('branches', [BranchController::class, 'index'])->name('admin.branches');
        Route::get('branches/create', [BranchController::class, 'branchCreate'])->name('admin.branches.create');
        Route::post('branch/store', [BranchController::class, 'branchStore'])->name('admin.branch.store');
        Route::get('branch/edit/{id}', [BranchController::class, 'branchEdit'])->name('admin.branch.edit');
        Route::post('branch/update/{id}', [BranchController::class, 'branchUpdate'])->name('admin.branch.update');
        Route::get('branch/delete/{id}', [BranchController::class, 'branchDestroy'])->name('admin.branch.delete');

        // Branch Floor
        Route::get('branch/floor', [BranchSettingController::class, 'floorIndex'])->name('admin.branch.floor');
        Route::get('branch/floor/create', [BranchSettingController::class, 'floorCreate'])->name('admin.branch.floor.create');
        Route::post('branch/floor/store', [BranchSettingController::class, 'floorStore'])->name('admin.branch.floor.store');
        Route::get('branch/floor/edit/{id}', [BranchSettingController::class, 'floorEdit'])->name('admin.branch.floor.edit');
        Route::post('branch/floor/update/{id}', [BranchSettingController::class, 'floorUpdate'])->name('admin.branch.floor.update');
        Route::get('branch/floor/delete/{id}', [BranchSettingController::class, 'floorDestroy'])->name('admin.branch.floor.delete');
        // Branch Floor End
        // Branch Rooms
        Route::get('branch/room', [BranchSettingController::class, 'roomIndex'])->name('admin.branch.room');
        Route::get('branch/room/create', [BranchSettingController::class, 'roomCreate'])->name('admin.branch.room.create');
        Route::post('branch/room/store', [BranchSettingController::class, 'roomStore'])->name('admin.branch.room.store');
        Route::get('branch/room/edit/{id}', [BranchSettingController::class, 'roomEdit'])->name('admin.branch.room.edit');
        Route::post('branch/room/update/{id}', [BranchSettingController::class, 'roomUpdate'])->name('admin.branch.room.update');
        Route::get('branch/room/delete/{id}', [BranchSettingController::class, 'roomDestroy'])->name('admin.branch.room.delete');
        // Branch Rooms End
        // Branch tables
        Route::get('branch/table', [BranchSettingController::class, 'tableIndex'])->name('admin.branch.table');
        Route::get('branch/table/create', [BranchSettingController::class, 'tableCreate'])->name('admin.branch.table.create');
        Route::post('branch/table/store', [BranchSettingController::class, 'tableStore'])->name('admin.branch.table.store');
        Route::get('branch/table/edit/{id}', [BranchSettingController::class, 'tableEdit'])->name('admin.branch.table.edit');
        Route::post('branch/table/update/{id}', [BranchSettingController::class, 'tableUpdate'])->name('admin.branch.table.update');
        Route::get('branch/table/delete/{id}', [BranchSettingController::class, 'tableDestroy'])->name('admin.branch.table.delete');
        // Branch tables End
        // Branch chairs
        Route::get('branch/chair', [BranchSettingController::class, 'chairIndex'])->name('admin.branch.chair');
        Route::get('branch/chair/create', [BranchSettingController::class, 'chairCreate'])->name('admin.branch.chair.create');
        Route::post('branch/chair/store', [BranchSettingController::class, 'chairStore'])->name('admin.branch.chair.store');
        Route::get('branch/chair/edit/{id}', [BranchSettingController::class, 'chairEdit'])->name('admin.branch.chair.edit');
        Route::post('branch/chair/update/{id}', [BranchSettingController::class, 'chairUpdate'])->name('admin.branch.chair.update');
        Route::get('branch/chair/delete/{id}', [BranchSettingController::class, 'chairDestroy'])->name('admin.branch.chair.delete');
        // Branch chairs End
        // Branch section end
        // Branch Manager section
        Route::get('branch-manager', [BranchManagerController::class, 'index'])->name('admin.branch.manager');
        Route::get('branch-manager/create', [BranchManagerController::class, 'branchManagerCreate'])->name('admin.branch.manager.create');
        Route::post('branch-manager/store', [BranchManagerController::class, 'branchManagerStore'])->name('admin.branch.manager.store');
        Route::get('branch-manager/edit/{id}', [BranchManagerController::class, 'branchManagerEdit'])->name('admin.branch.manager.edit');
        Route::post('branch-manager/update/{id}', [BranchManagerController::class, 'branchManagerUpdate'])->name('admin.branch.manager.update');
        Route::get('branch-manager/delete/{id}', [BranchManagerController::class, 'branchManagerDestroy'])->name('admin.branch.manager.delete');
        // Branch Manager section end
        // Investor section
        Route::get('investor', [InvestorController::class, 'index'])->name('admin.investor');
        Route::get('investor/create', [InvestorController::class, 'investorCreate'])->name('admin.investor.create');
        Route::post('investor/store', [InvestorController::class, 'investorStore'])->name('admin.investor.store');
        Route::get('investor/edit/{id}', [InvestorController::class, 'investorEdit'])->name('admin.investor.edit');
        Route::post('investor/update/{id}', [InvestorController::class, 'investorUpdate'])->name('admin.investor.update');
        Route::get('investor/delete/{id}', [InvestorController::class, 'investorDestroy'])->name('admin.investor.delete');
        // Investor section end
        // Booking Calendar section
        Route::get('booking-calendar', [BookingCalendarController::class, 'index'])->name('admin.booking.calendar');
        // Booking Calendar section end
        // Booking section
        Route::get('booking', [BookingController::class, 'index'])->name('admin.booking');
        Route::get('booking/create', [BookingController::class, 'Create'])->name('admin.booking.create');
        Route::post('booking/user-details', [BookingController::class, 'storeUserDetails'])->name('booking.storeUserDetails');
        Route::post('booking/booking-details', [BookingController::class, 'storeBookingDetails'])->name('booking.storeBookingDetails');
        //
        Route::post('/chairs/toggle-status', [BookingController::class, 'toggleStatus'])->name('chairs.toggleStatus');

        Route::get('/payment/stripe', [BookingController::class, 'stripe'])->name('booking.stripe');
        //
        Route::get('floors/{branch}', [BookingController::class, 'getFloors']);
        Route::get('rooms/{floor}', [BookingController::class, 'getRooms']);
        Route::get('tables/{room}', [BookingController::class, 'getTables']);
        Route::get('chairs/{table}', [BookingController::class, 'getChairs']);
        Route::post('/book-chair', [BookingController::class, 'bookChair']);


        // Booking section end
        // Inventory Management section
        Route::get('inventory-management', [InventoryManagementController::class, 'index'])->name('admin.inventory.management');
        Route::get('booking/create', [BookingController::class, 'BookingCreate'])->name('admin.booking.create');
        // Booking section end
        // Inventory Management section
        Route::get('inventory-management', [InventoryManagementController::class, 'index'])->name('admin.inventory.management');
        Route::get('inventory-management/create', [InventoryManagementController::class, 'inventoryCreate'])->name('admin.inventory.create');
        // Inventory Management section end
        // Floor Plan Section
        Route::get('floor-plan', [FloorPlanController::class, 'index'])->name('admin.floor.plan');
        // Floor Plan Section end
        // Role Section
        Route::get('roles', [RolePermissionController::class, 'index'])->name('admin.roles');
        Route::get('roles/create', [RolePermissionController::class, 'roleCreate'])->name('admin.roles.create');
        Route::post('roles/store', [RolePermissionController::class, 'roleStore'])->name('admin.roles.store');
        Route::get('roles/edit/{id}', [RolePermissionController::class, 'roleEdit'])->name('admin.roles.edit');
        Route::post('roles/update/{id}', [RolePermissionController::class, 'roleUpdate'])->name('admin.roles.update');
        Route::get('roles/delete/{id}', [RolePermissionController::class, 'roleDestroy'])->name('admin.roles.delete');
        // Role Section end
        // Permission Section
        Route::get('permissions', [RolePermissionController::class, 'permissionIndex'])->name('admin.permissions');
        Route::get('permissions/create', [RolePermissionController::class, 'permissionCreate'])->name('admin.permissions.create');
        Route::post('permissions/store', [RolePermissionController::class, 'permissionStore'])->name('admin.permissions.store');
        Route::get('permissions/edit/{id}', [RolePermissionController::class, 'permissionEdit'])->name('admin.permissions.edit');
        Route::post('permissions/update/{id}', [RolePermissionController::class, 'permissionUpdate'])->name('admin.permissions.update');
        Route::get('permissions/delete/{id}', [RolePermissionController::class, 'permissionDestroy'])->name('admin.permissions.delete');
        // Permission Section end
        // Members Section
        Route::get('members', [MemberController::class, 'index'])->name('admin.members');
        Route::get('members/create', [MemberController::class, 'memberCreate'])->name('admin.members.create');
        Route::post('members/store', [MemberController::class, 'memberStore'])->name('admin.members.store');
        Route::get('members/edit/{id}', [MemberController::class, 'memberEdit'])->name('admin.members.edit');
        Route::post('members/update/{id}', [MemberController::class, 'memberUpdate'])->name('admin.members.update');
        Route::get('members/delete/{id}', [MemberController::class, 'memberDestroy'])->name('admin.members.delete');
        // Members Section end
        // Invoice Section
        Route::get('invoice', [InvoiceController::class, 'index'])->name('admin.invoice');
        Route::get('invoice/create', [InvoiceController::class, 'invoiceCreate'])->name('admin.invoice.create');
        Route::post('invoice/store', [InvoiceController::class, 'invoiceStore'])->name('admin.invoice.store');
        Route::get('invoice/show', [InvoiceController::class, 'invoiceShow'])->name('admin.invoice.show');
        Route::get('invoice/edit/{id}', [InvoiceController::class, 'invoiceEdit'])->name('admin.invoice.edit');
        Route::post('invoice/update/{id}', [InvoiceController::class, 'invoiceUpdate'])->name('admin.invoice.update');
        Route::get('invoice/delete/{id}', [InvoiceController::class, 'invoiceDestroy'])->name('admin.invoice.delete');
        // Invoice Section end
        // Seat Allocation
        Route::get('/seat-allocation', [DashboardController::class, 'seatAllocation'])->name('admin.seat.allocation');
        Route::get('/payment', [DashboardController::class, 'payment'])->name('admin.payment');
    });
});

require __DIR__ . '/auth.php';