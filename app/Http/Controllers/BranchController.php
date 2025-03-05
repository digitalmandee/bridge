<?php

namespace App\Http\Controllers;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules;

class BranchController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $limit = $request->query('limit', 10);

        $branches = Tenant::paginate($limit);

        return response()->json(['success' => true, 'branches' => $branches]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function Login(Request $request)
    {
        $user = User::all();

        return response()->json($user);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:tenants,email',
            'username' => 'required|string|unique:tenants,username',
            'location' => 'required|string',
            'floors' => 'required|integer',
            'rooms' => 'required|integer',
            'seats' => 'required|integer',
            'tables' => 'required|integer',
            // 'password' => ['required', Rules\Password::defaults()],
            // 'domain_name' => 'required|string|unique:domains,domain',
        ]);

        $tenant = Tenant::create($validatedData);

        tenancy()->initialize($tenant);

        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'type' => 'admin',
        ]);

        $user->assignRole('admin');

        // $branch->domains()->create([
        //     'domain' => $validatedData['domain_name'],
        // ]);

        return response()->json(['success' => true, 'message' => 'Branch created successfully']);
    }

    public function checkBranch(Request $request)
    {
        return response()->json(['exist' => Tenant::whereKey($request->query('branch'))->exists()]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    public function getBranchStats()
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}