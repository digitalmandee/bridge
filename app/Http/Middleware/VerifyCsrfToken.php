<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array<int, string>
     */
    protected $except = [
        'api/check-chair-availability', // Add your API route here
        'api/floor-plan', // Add your API route here
        'api/booking-plans', // Add your API route here
        'api/booking/create',
        'api/seat-allocations',
        'api/bookings/update',
        'api/booking-schedule/create'
        //
    ];
}