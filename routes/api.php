<?php

use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\BookingPlanController;
use App\Http\Controllers\BookingScheduleController;
use App\Http\Controllers\BranchUserController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\ContractController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\FloorPlanController;
use App\Http\Controllers\GlobalController;
use App\Http\Controllers\InvoicesController;
use App\Http\Controllers\LeaveCategoryController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\RolePermissionController;
use App\Http\Controllers\UserController;
use App\Models\LeaveCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
 * |--------------------------------------------------------------------------
 * | API Routes
 * |--------------------------------------------------------------------------
 * |
 * | Here is where you can register API routes for your application. These
 * | routes are loaded by the RouteServiceProvider within a group which
 * | is assigned the "api" middleware group. Enjoy building your API!
 * |
 */

Route::post('/login', [AuthController::class, 'userlogin']);

Route::group(['middleware' => 'auth:sanctum'], function () {
    // -------------- Roles Management
    Route::get('/permissions', [RolePermissionController::class, 'getPermissions']);
    // -------------- Roles
    Route::resource('roles', RolePermissionController::class)->except(['create', 'edit']);
    // -------------- Branch Users
    Route::resource('branch-users', BranchUserController::class)->except(['create', 'edit']);

    // -------------- Webs
    Route::get('/user', [AuthController::class, 'getUser']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Members and Companies
    // only Individual user
    Route::get('/members', [GlobalController::class, 'getMembers']);
    // only Company with id, name
    Route::get('/companies', [GlobalController::class, 'getCompanies']);
    // show all members and companies based on query
    Route::get('/search', [GlobalController::class, 'search']);

    Route::get('/search-plan', [GlobalController::class, 'searchPlan']);

    Route::group(['prefix' => 'user'], function () {
        Route::get('dashboard', [UserController::class, 'index']);
    });

    // Member Module for admin
    Route::group(['prefix' => 'member'], function () {
        // get all users
        Route::get('users', [MemberController::class, 'getUsers']);
        // get all companies
        Route::get('detail/{id}', [MemberController::class, 'getMemberDetail']);
        Route::get('companies', [MemberController::class, 'getCompanies']);
        Route::get('companies/simple', [MemberController::class, 'getSimpleCompanies']);
        Route::get('company-detail/{id}', [MemberController::class, 'getCompanyDetail']);
        // Contrcts
        Route::get('contracts', [ContractController::class, 'index']);
        Route::post('contract/create', [ContractController::class, 'create']);
        Route::put('contract/update', [ContractController::class, 'update']);
        Route::put('contract/user/update', [ContractController::class, 'UserUpdate']);
    });

    Route::group(['prefix' => 'company'], function () {
        Route::get('dashboard', [CompanyController::class, 'index']);
        Route::get('dashboard/staff', [CompanyController::class, 'getStaff']);
        Route::get('staffs', [CompanyController::class, 'getStaffs']);
        Route::post('staff/create', [CompanyController::class, 'createStaff']);
        Route::put('staffs/{id}', [CompanyController::class, 'updateStaff']);
        Route::delete('staffs/{id}', [CompanyController::class, 'deleteStaff']);
    });

    // Booking Seats
    Route::get('floor-plan', [FloorPlanController::class, 'getFloorPlan']);
    Route::get('seat-allocations', [FloorPlanController::class, 'getSeatAllocations']);

    // Bookings
    Route::get('bookings', [BookingController::class, 'getBookings']);
    Route::group(['prefix' => 'booking'], function () {
        Route::post('create', [BookingController::class, 'createBooking']);
        Route::post('update', [BookingController::class, 'updateBooking']);
        // Check Availability
        Route::post('check-availability', [FloorPlanController::class, 'checkAvailability']);
        // Booking Users
        Route::get('users', [UserController::class, 'getBookingUsers']);
    });

    // Invoices
    Route::group(['prefix' => 'invoices'], function () {
        Route::get('', [InvoicesController::class, 'index']);
        Route::get('customer-detail/{id}', [InvoicesController::class, 'customerDetail']);
        Route::post('create', [InvoicesController::class, 'store']);
        Route::post('update', [InvoicesController::class, 'update']);
        Route::get('dashboard', [InvoicesController::class, 'dashboard']);
        // Get realted user booking data
        Route::get('user-booking', [InvoicesController::class, 'userBooking']);
    });

    // Booking Schedule Calendar
    Route::get('booking-schedules', [BookingScheduleController::class, 'index']);
    Route::group(['prefix' => 'booking-schedule'], function () {
        Route::post('create', [BookingScheduleController::class, 'create']);
        Route::get('filter', [BookingScheduleController::class, 'filter']);
        Route::get('availability-rooms', [BookingScheduleController::class, 'getAvailabilityRooms']);
        Route::get('requests', [BookingScheduleController::class, 'getRequests']);
        Route::post('update', [BookingScheduleController::class, 'update']);
    });

    // Employee Module
    Route::resource('departments', DepartmentController::class)->except(['create', 'edit']);

    Route::group(['prefix' => 'employees'], function () {
        Route::get('', [EmployeeController::class, 'index']);
        Route::get('dashboard', [EmployeeController::class, 'dashboard']);
        Route::post('create', [EmployeeController::class, 'store']);
        Route::get('show/{id}', [EmployeeController::class, 'show']);
        Route::put('update/{id}', [EmployeeController::class, 'update']);

        Route::resource('leavecategories', LeaveCategoryController::class)->only(['index', 'show', 'store', 'update', 'destroy']);

        Route::group(['prefix' => 'attendances'], function () {
            Route::get('', [AttendanceController::class, 'index']);
            Route::put('{attendanceId}', [AttendanceController::class, 'updateAttendance']);
            Route::get('profile/report/{employeeId}', [AttendanceController::class, 'profileReport']);
            Route::post('all/report', [AttendanceController::class, 'allEmployeesReport']);
            Route::post('leave/create', [AttendanceController::class, 'createLeave']);
            Route::put('leave/update/{id}', [AttendanceController::class, 'updateLeave']);
            Route::post('leave/report', [AttendanceController::class, 'leaveReport']);
        });
    });

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'getNotifications']);
    Route::post('/notifications/send', [NotificationController::class, 'sendNotification']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);

    // Booking Plans
    Route::resource('booking-plans', BookingPlanController::class)->except(['create', 'show', 'edit']);
});


// $branchId = auth()->user()->branch->id;
// $query = $request->input('query');

// $plans = BookingPlan::where(['branch_id' => $branchId])->where('name', 'like', "%$query%")->select('id', 'name', 'price', 'type')->get();

// return response()->json(['success' => true, 'results' => $plans], 200);
