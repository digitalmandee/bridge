<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\BookingPlanController;
use App\Http\Controllers\BookingScheduleController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\FloorPlanController;
use App\Http\Controllers\GlobalController;
use App\Http\Controllers\InvoicesController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\UserController;
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
    Route::get('/user', [AuthController::class, 'getUser']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Members and Companies
    Route::get('/members', [GlobalController::class, 'getMembers']);
    Route::get('/companies', [GlobalController::class, 'getCompanies']);
    Route::get('/search', [GlobalController::class, 'search']);

    Route::group(['prefix' => 'user'], function () {
        Route::get('dashboard', [UserController::class, 'index']);
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

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'getNotifications']);
    Route::post('/notifications/send', [NotificationController::class, 'sendNotification']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);

    // Booking Plans
    Route::resource('booking-plans', BookingPlanController::class)->except(['create', 'show', 'edit']);
});