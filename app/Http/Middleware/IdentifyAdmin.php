<?php

namespace App\Http\Middleware;

use App\Models\Tenant;
use Closure;

class IdentifyAdmin
{
    public function handle($request, Closure $next)
    {
        $tenant = Tenant::find(auth()->user()->id);
        // Switch to tenant database
        tenancy()->initialize($tenant);

        return $next($request);
    }
}
