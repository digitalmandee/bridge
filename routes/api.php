<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookingPlanController;
use App\Http\Controllers\BookingScheduleController;
use App\Http\Controllers\FloorPlanController;
use App\Http\Controllers\InvoicesController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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

Route::post('/login', [AuthController::class, 'userlogin']);

Route::group(['middleware' => 'auth:sanctum'], function () {
    Route::get('/user', [AuthController::class, 'getUser']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::group(['prefix' => 'user'], function () {
        Route::get('dashboard', [UserController::class, 'index']);
    });

    // Booking Seats
    Route::get('floor-plan', [FloorPlanController::class, 'getFloorPlan']);
    Route::get('seat-allocations', [FloorPlanController::class, 'getSeatAllocations']);

    // Bookings
    Route::get('bookings', [BookingPlanController::class, 'getBookings']);
    Route::post('booking/create', [BookingPlanController::class, 'createBooking']);
    Route::post('bookings/update', [BookingPlanController::class, 'updateBooking']);

    // Booking Schedule Calendar
    Route::get('booking-schedules', [BookingScheduleController::class, 'index']);
    Route::post('booking-schedule/create', [BookingScheduleController::class, 'create']);
    Route::get('booking-schedule/filter', [BookingScheduleController::class, 'filter']);
    Route::get('booking-schedule/availability-rooms', [BookingScheduleController::class, 'getAvailabilityRooms']);
    Route::get('booking-schedule/requests', [BookingScheduleController::class, 'getRequests']);
    Route::post('booking-schedule/update', [BookingScheduleController::class, 'update']);
    // Booking Users
    Route::get('booking/users', [UserController::class, 'getBookingUsers']);

    // Invoices
    Route::get('invoices', [InvoicesController::class, 'index']);
    Route::post('invoices/update', [InvoicesController::class, 'update']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'getNotifications']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
});

Route::post('check-chair-availability', [FloorPlanController::class, 'checkChairAvailability']);

// Booking Plans
Route::resource('booking-plans', BookingPlanController::class)->except(['create', 'show', 'edit']);