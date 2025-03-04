<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\BookingPlanController;
use App\Http\Controllers\Api\BookingScheduleController;
use App\Http\Controllers\Api\FloorPlanController;
use App\Http\Controllers\Api\GlobalController;
use App\Http\Controllers\Api\InvoicesController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\BranchAuthController;
use App\Http\Controllers\BranchController;
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

// Route::post('/branch/login', [BranchAuthController::class, 'login'])->middleware('guest');
Route::post('/login', [AuthenticatedSessionController::class, 'store'])->middleware('guest');
Route::post('/branch/login', [AuthController::class, 'userlogin'])->middleware('guest');

// Check Branch
Route::get('/branch/check', [BranchController::class, 'checkBranch'])->middleware('guest');

Route::group(['middleware' => 'auth:sanctum'], function () {
    Route::resource('branch', BranchController::class)->except(['create', 'edit']);

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

    // Booking Schedule Calendar
    Route::get('booking-schedules', [BookingScheduleController::class, 'index']);
    Route::group(['prefix' => 'booking-schedule'], function () {
        Route::post('create', [BookingScheduleController::class, 'create']);
        Route::get('filter', [BookingScheduleController::class, 'filter']);
        Route::get('availability-rooms', [BookingScheduleController::class, 'getAvailabilityRooms']);
        Route::get('requests', [BookingScheduleController::class, 'getRequests']);
        Route::post('update', [BookingScheduleController::class, 'update']);
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

    // Booking Plans
    Route::resource('booking-plans', BookingPlanController::class)->except(['create', 'show', 'edit']);
});

// Route::group(['middleware' => 'set_tenant'], function () {
// Route::post('/login', [AuthenticatedSessionController::class, 'store']);
// Route::post('/user/login', [BranchController::class, 'Login']);
// });