<?php

namespace App\Http\Middleware;

use App\Models\Tenant;
use Stancl\Tenancy\Tenancy;
use Closure;

class IdentifyTenant
{
    public function handle($request, Closure $next)
    {
        // Get branch ID from URL
        $branch_id = $request->route('branch');

        // Find tenant (branch) in the central database
        $tenant = Tenant::find($branch_id);

        if (!$tenant) {
            return response()->json(['error' => 'Branch not found'], 404);
        }

        // Switch to the correct branch database
        tenancy()->initialize($tenant);

        return $next($request);
    }
}