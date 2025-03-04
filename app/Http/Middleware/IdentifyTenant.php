<?php

namespace App\Http\Middleware;

use App\Models\Tenant;
use Laravel\Sanctum\PersonalAccessToken;
use Closure;

class IdentifyTenant
{
    public function handle($request, Closure $next)
    {
        if (!$request->hasHeader('Branch')) {
            return response()->json(['error' => 'Branch ID is required'], 400);
        }

        $branchId = $request->header('Branch');
        $tenant = Tenant::find($branchId);

        if (!$tenant) {
            return response()->json(['error' => 'Invalid Branch ID'], 404);
        }

        // Switch to tenant database
        tenancy()->initialize($tenant);

        // Get token from request
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json(['error' => 'Unauthorized - Token missing'], 401);
        }
        // Sanctum token format: "token_id|string"
        $parts = explode('|', $token);
        if (count($parts) !== 2) {
            return response()->json(['error' => 'Invalid token format'], 401);
        }

        [$tokenId, $plainTextToken] = $parts;

        // Hash the right part for comparison
        $hashedToken = hash('sha256', $plainTextToken);

        // Search for the token in the tenant database
        $personalAccessToken = PersonalAccessToken::where('id', $tokenId)->where('token', $hashedToken)->first();

        if (!$personalAccessToken) {
            return response()->json(['error' => 'Unauthorized.'], 401);
        }

        auth()->setUser($personalAccessToken->tokenable);

        return $next($request);
    }
}