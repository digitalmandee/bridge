<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\BookingPlanController;
use App\Http\Controllers\Api\BookingRequestController;
use App\Http\Controllers\Api\BookingScheduleController;
use App\Http\Controllers\Api\BranchUserController;
use App\Http\Controllers\Api\CompanyController;
use App\Http\Controllers\Api\ContractController;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\FinanceCategoryController;
use App\Http\Controllers\Api\FinanceController;
use App\Http\Controllers\Api\FloorPlanController;
use App\Http\Controllers\Api\GlobalController;
use App\Http\Controllers\Api\InvestmentTypeController;
use App\Http\Controllers\Api\InvoicesController;
use App\Http\Controllers\Api\InvoiceTypeController;
use App\Http\Controllers\Api\KitchenController;
use App\Http\Controllers\Api\LeaveApplicationController;
use App\Http\Controllers\Api\LeaveCategoryController;
use App\Http\Controllers\Api\MemberController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\RolePermissionController;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\ScheduleFloorController;
use App\Http\Controllers\Api\ScheduleRoomController;
use App\Http\Controllers\Api\TableController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\BranchAuthController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\InvestorController;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use PharIo\Manifest\AuthorCollection;

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

Route::post('/login', [AuthenticatedSessionController::class, 'store'])->middleware('guest');
Route::post('/branch/login', [AuthController::class, 'userlogin'])->middleware('guest');

// Check Branch
Route::get('/branch/check', [BranchController::class, 'checkBranch'])->middleware('guest');

Route::group(['middleware' => 'auth:sanctum'], function () {
    Route::get('super/user', [AuthController::class, 'getAdmin']);
    Route::post('super/logout', [AuthController::class, 'logout']);
    // Branches
    Route::resource('branches', BranchController::class)->except(['create', 'edit']);
    // Dashboard
    Route::get('/dashboard/branches', [BranchController::class, 'getBranches']);
    Route::get('/dashboard/branch/stats', [BranchController::class, 'getBranchStats']);
    // Booking Seats
});

Route::group(['middleware' => ['set_tenant']], function () {
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

    // Booking Seats
    Route::get('floor-plan', [FloorPlanController::class, 'getFloorPlan']);
    Route::get('floor-plan/floor-plan-list', [FloorPlanController::class, 'getFloorPlanList']);
    Route::get('floor-plan/floors', [FloorPlanController::class, 'getFloors']);
    Route::get('floor-plan/chairs', [FloorPlanController::class, 'getChairs']);
    Route::delete('floor-plan/chairs/{id}', [FloorPlanController::class, 'deleteChair']);
    Route::post('floor-plan/chairs', [FloorPlanController::class, 'createChair']);
    Route::get('floor-plan/{floor_id}/rooms', [FloorPlanController::class, 'getRooms']);
    Route::get('seat-allocations', [FloorPlanController::class, 'getSeatAllocations']);

    // tables
    Route::get('floor-plan/tables', [TableController::class, 'getTables']);
    Route::post('floor-plan/tables', [TableController::class, 'createTable']);
    // tables
    Route::get('floor-plan/rooms', [RoomController::class, 'index']);
    Route::post('floor-plan/rooms', [RoomController::class, 'create']);

    // Bookings
    Route::get('bookings', [BookingController::class, 'getBookings']);
    // booking seat request
    Route::get('booking-request', [BookingRequestController::class, 'index']);
    Route::post('booking-request', [BookingRequestController::class, 'store']);

    Route::group(['prefix' => 'booking'], function () {
        Route::post('create', [BookingController::class, 'createBooking']);
        Route::post('update', [BookingController::class, 'updateBooking']);
        // Check Availability
        Route::post('check-availability', [FloorPlanController::class, 'checkAvailability']);
        // Booking Users
        Route::get('users', [UserController::class, 'getBookingUsers']);
    });

    // Booking Plans
    Route::resource('booking-plans', BookingPlanController::class)->except(['create', 'show', 'edit']);

    // Booking Schedule Calendar
    Route::group(['prefix' => 'schedule'], function () {
        Route::resource('floor', ScheduleFloorController::class)->except(['create', 'show', 'edit']);
        Route::resource('room', ScheduleRoomController::class)->except(['create', 'show', 'edit']);
    });

    Route::get('booking-schedules', [BookingScheduleController::class, 'index']);
    Route::group(['prefix' => 'booking-schedule'], function () {
        Route::post('create', [BookingScheduleController::class, 'create']);
        Route::get('filter', [BookingScheduleController::class, 'filter']);
        Route::get('search', [BookingScheduleController::class, 'search']);
        Route::get('availability-rooms', [BookingScheduleController::class, 'getAvailabilityRooms']);
        Route::get('requests', [BookingScheduleController::class, 'getRequests']);
        Route::post('update', [BookingScheduleController::class, 'update']);
        Route::delete('{id}', [BookingScheduleController::class, 'destroy']);
    });

    // Investment
    Route::group(['prefix' => 'investor'], function () {
        Route::get('/investments', [InvestorController::class, 'investments']);
        Route::get('/users/search', [InvestorController::class, 'search']);
        Route::get('/investment/types', [InvestorController::class, 'getTypes']);
        Route::post('/users/create-investment', [InvestorController::class, 'createInvestment']);
        Route::get('/investor-dashboard', [InvestorController::class, 'dashboard']);
        Route::post('/become-investor', [InvestorController::class, 'becomeInvestor']);
        // Investment Types
        Route::resource('investment-types', InvestmentTypeController::class)->except(['create', 'show', 'edit']);
    });

    // Invoices
    Route::resource('invoice-types', InvoiceTypeController::class)->except(['create', 'edit']);
    Route::group(['prefix' => 'invoices'], function () {
        Route::get('', [InvoicesController::class, 'index']);
        Route::get('customer-detail/{id}', [InvoicesController::class, 'customerDetail']);
        Route::get('view/{id}', [InvoicesController::class, 'viewInvoice']);
        Route::post('create', [InvoicesController::class, 'store']);
        Route::post('update', [InvoicesController::class, 'update']);
        Route::get('dashboard', [InvoicesController::class, 'dashboard']);
        // Get realted user booking data
        Route::get('user-booking', [InvoicesController::class, 'userBooking']);
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

    // Employee Module
    Route::resource('departments', DepartmentController::class)->except(['create', 'edit']);

    Route::group(['prefix' => 'employees'], function () {
        Route::get('', [EmployeeController::class, 'index']);
        Route::get('dashboard', [EmployeeController::class, 'dashboard']);
        Route::post('create', [EmployeeController::class, 'store']);
        Route::get('show/{id}', [EmployeeController::class, 'show']);
        Route::put('update/{id}', [EmployeeController::class, 'update']);

        // Leave Categories
        Route::get('leavecategories/all', [LeaveCategoryController::class, 'getAll']);
        Route::resource('leavecategories', LeaveCategoryController::class)->only(['index', 'show', 'store', 'update', 'destroy']);

        // Leave Applicaitons
        Route::get('leaves/reports', [LeaveApplicationController::class, 'leaveReport']);
        Route::get('leaves/reports/monthly', [LeaveApplicationController::class, 'leaveReportMonthly']);
        Route::resource('leaves', LeaveApplicationController::class)->except(['create', 'edit']);

        // Attendances
        Route::group(['prefix' => 'attendances'], function () {
            Route::get('', [AttendanceController::class, 'index']);
            Route::get('reports', [AttendanceController::class, 'attendanceReport']);
            Route::put('{attendanceId}', [AttendanceController::class, 'updateAttendance']);
            Route::get('profile/report/{employeeId}', [AttendanceController::class, 'profileReport']);
            Route::post('all/report', [AttendanceController::class, 'allEmployeesReport']);
        });
    });

    // Kitchen
    Route::get('/kitchens', [KitchenController::class, 'index']);
    Route::post('/kitchens', [KitchenController::class, 'store']);
    Route::put('/kitchens/{id}', [KitchenController::class, 'update']);
    Route::delete('/kitchens/{id}', [KitchenController::class, 'destroy']);

    // Admin Dasboard
    Route::group(['prefix' => 'admin'], function () {
        Route::get('dashboard', [AdminController::class, 'index']);
        Route::get('customer/dashboard', [AdminController::class, 'customerStats']);
    });

    // User Dasboard
    Route::group(['prefix' => 'user'], function () {
        Route::get('dashboard', [UserController::class, 'index']);
        Route::get('profile', [UserController::class, 'profile']);
        Route::post('profile/update', [UserController::class, 'updateProfile']);
    });

    // Company Dashboard
    Route::group(['prefix' => 'company'], function () {
        Route::get('dashboard', [CompanyController::class, 'index']);
        Route::get('dashboard/staff', [CompanyController::class, 'getStaff']);
        Route::get('staffs', [CompanyController::class, 'getStaffs']);
        Route::post('staff/create', [CompanyController::class, 'createStaff']);
        Route::put('staffs/{id}', [CompanyController::class, 'updateStaff']);
        Route::delete('staffs/{id}', [CompanyController::class, 'deleteStaff']);
    });

    // finance management
    Route::resource('finances', FinanceController::class)->except(['create', 'edit']);
    Route::post('download', [FinanceController::class, 'download']);
    Route::group(['prefix' => 'finance'], function () {
        Route::get('stats', [FinanceController::class, 'getStats']);
        Route::get('get-analytics', [FinanceController::class, 'getMonthlyStats']);
        Route::get('category/{categoryId}', [FinanceController::class, 'getFinanceByCategory']);
        Route::resource('categories', FinanceCategoryController::class)->except(['create', 'edit']);
    });

    // -------------- Roles Management
    Route::get('permissions', [RolePermissionController::class, 'getPermissions']);
    // -------------- Roles
    Route::resource('roles', RolePermissionController::class)->except(['create', 'edit']);
    // -------------- Branch Users
    Route::resource('branch-users', BranchUserController::class)->except(['create', 'edit']);

    // Notifications
    Route::get('notifications', [NotificationController::class, 'getNotifications']);
    Route::post('notifications/send', [NotificationController::class, 'sendNotification']);
    Route::post('notifications/{id}/read', [NotificationController::class, 'markAsRead']);
});