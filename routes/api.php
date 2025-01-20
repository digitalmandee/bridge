<?php

use App\Http\Controllers\api\BookingPlanController;
use App\Http\Controllers\api\BranchManagerController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\api\UserController;
use App\Http\Controllers\api\FloorPlanController;
use App\Http\Controllers\api\RolePermissionController;
use App\Http\Controllers\api\RoomController;
use App\Http\Controllers\api\BranchController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/login', [UserController::class, 'userlogin']);

Route::group(['middleware' => 'auth:sanctum'], function () {

    Route::get('roles', [RolePermissionController::class, 'index']);
    // Route::get('roles/create', [RolePermissionController::class, 'roleCreate'])->name('admin.roles.create');
    Route::post('roles/store', [RolePermissionController::class, 'roleStore'])->name('admin.roles.store');
    // Route::get('roles/edit/{id}', [RolePermissionController::class, 'roleEdit'])->name('admin.roles.edit');
    Route::post('roles/update/{id}', [RolePermissionController::class, 'roleUpdate'])->name('admin.roles.update');
    Route::get('roles/delete/{id}', [RolePermissionController::class, 'roleDestroy'])->name('admin.roles.delete');
    // Role Section end
    // Permission Section
    Route::get('permissions', [RolePermissionController::class, 'permissionIndex'])->name('admin.permissions');
    // Route::get('permissions/create', [RolePermissionController::class, 'permissionCreate'])->name('admin.permissions.create');
    Route::post('permissions/store', [RolePermissionController::class, 'permissionStore'])->name('admin.permissions.store');
    // Route::get('permissions/edit/{id}', [RolePermissionController::class, 'permissionEdit'])->name('admin.permissions.edit');
    Route::post('permissions/update/{id}', [RolePermissionController::class, 'permissionUpdate'])->name('admin.permissions.update');
    Route::get('permissions/delete/{id}', [RolePermissionController::class, 'permissionDestroy'])->name('admin.permissions.delete');

    // User Module
    Route::post('user/store', [UserController::class, 'store']);
    Route::get('users', [UserController::class, 'index']);
    Route::post('user/update/{id}', [UserController::class, 'update']);
    Route::get('user/delete/{id}', [UserController::class, 'delete']);

    // Branch Module
    Route::post('branch/store', [BranchController::class, 'store']);
    Route::get('branches', [BranchController::class, 'index']);
    Route::post('branch/update/{id}', [BranchController::class, 'update']);
    Route::get('branch/get/{id}', [BranchController::class, 'show']);
    Route::get('branch/delete/{id}', [BranchController::class, 'delete']);

    // Branch Manager Module
    Route::post('branch-manager/store', [BranchManagerController::class, 'store']);
    Route::get('branch/managers', [BranchManagerController::class, 'index']);
    Route::post('branch-manager/update/{id}', [BranchManagerController::class, 'update']);
    Route::get('branch-manager/get/{id}', [BranchManagerController::class, 'show']);
    Route::get('branch-manager/delete/{id}', [BranchManagerController::class, 'delete']);

    // Floor Management Module
    Route::post('floor/store', [FloorPlanController::class, 'store']);
    Route::get('floors', [FloorPlanController::class, 'index']);
    Route::post('floor/update/{id}', [FloorPlanController::class, 'update']);
    Route::get('floor/get/{id}', [FloorPlanController::class, 'show']);
    Route::get('floor/delete/{id}', [FloorPlanController::class, 'delete']);


    // Rooms Management Module
    Route::post('room/store', [RoomController::class, 'store']);
    Route::get('rooms', [RoomController::class, 'index']);
    Route::post('room/update/{id}', [RoomController::class, 'update']);
    Route::get('room/get/{id}', [RoomController::class, 'show']);
    Route::get('room/delete/{id}', [RoomController::class, 'delete']);

    // table Management Module
    Route::post('table/store', [RoomController::class, 'store']);
    Route::get('tables', [RoomController::class, 'index']);
    Route::post('table/update/{id}', [RoomController::class, 'update']);
    Route::get('table/get/{id}', [RoomController::class, 'show']);
    Route::get('table/delete/{id}', [RoomController::class, 'delete']);

    // Chairs Management Module
    Route::post('Chair/store', [RoomController::class, 'store']);
    Route::get('Chairs', [RoomController::class, 'index']);
    Route::get('avail-Chairs', [RoomController::class, 'AvailableChairs']);
    Route::post('Chair/update/{id}', [RoomController::class, 'update']);
    Route::get('Chair/get/{id}', [RoomController::class, 'show']);
    Route::get('Chair/delete/{id}', [RoomController::class, 'delete']);


    // Booking Plans
    Route::resource('booking-plans', BookingPlanController::class)->except(['create', 'show', 'edit']);
});