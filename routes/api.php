<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookingPlanController;
use App\Http\Controllers\BookingScheduleController;
use App\Http\Controllers\FloorPlanController;
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

    // Booking Schedule Calendar
    Route::get('booking-schedules', [BookingScheduleController::class, 'index']);
    Route::post('booking-schedule/create', [BookingScheduleController::class, 'create']);
    Route::get('booking-schedule/filter', [BookingScheduleController::class, 'filter']);
});

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::get('floor-plan', [FloorPlanController::class, 'getFloorPlan']);
Route::post('check-chair-availability', [FloorPlanController::class, 'checkChairAvailability']);

Route::get('seat-allocations', [FloorPlanController::class, 'getSeatAllocations']);

// Bookings
Route::get('bookings', [BookingPlanController::class, 'getBookings']);
Route::post('booking/create', [BookingPlanController::class, 'createBooking']);
Route::post('bookings/update', [BookingPlanController::class, 'updateBooking']);

// Booking Plans
Route::resource('booking-plans', BookingPlanController::class)->except(['create', 'show', 'edit']);

// users
Route::get('users', [UserController::class, 'index']);