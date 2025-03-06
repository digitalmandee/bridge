<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Floor;
use App\Models\Invoice;
use App\Models\Tenant;
use App\Models\User;
use Carbon\Carbon;
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
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:tenants,email',
            'username' => 'required|string|unique:tenants,username',
            'location' => 'required|string|unique:tenants,location',
            'floors' => 'required|integer',
            'rooms' => 'required|integer',
            'seats' => 'required|integer',
            'tables' => 'required|integer',
            // 'password' => ['required', Rules\Password::defaults()],
            // 'domain_name' => 'required|string|unique:domains,domain',
        ]);

        $validatedData['id'] = strtolower(str_replace(' ', '-', $validatedData['location']));

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

    public function getBranches()
    {
        $branches = Tenant::select('id', 'name')->get();

        return response()->json(['success' => true, 'branches' => $branches]);
    }

    public function getBranchStats(Request $request)
    {
        $branchId = $request->query('branch');

        $tenant = Tenant::find($branchId);

        if (!$tenant) {
            return response()->json(['error' => 'Invalid Branch ID'], 404);
        }

        // Switch to tenant database
        tenancy()->initialize($tenant);

        // Fetch all floors with related rooms, tables, and chairs
        $floors = Floor::with(['rooms.tables.chairs'])->get();

        // Initialize counters
        $totalChairs = 0;
        $totalAvailableChairs = 0;
        $totalOccupiedChairs = 0;

        // Process all floors
        foreach ($floors as $floor) {
            foreach ($floor->rooms as $room) {
                foreach ($room->tables as $table) {
                    foreach ($table->chairs as $chair) {
                        $isOccupied = $chair->time_slot !== 'available';
                        $isFullDay = $chair->time_slot === 'full_day';
                        $totalChairs++;

                        if ($isOccupied) {
                            $totalOccupiedChairs++;
                            if (!$isFullDay) {
                                $totalAvailableChairs++;
                            }
                        } else {
                            $totalAvailableChairs++;
                        }
                    }
                }
            }
        }

        // Get total members
        $memberCount = User::whereIn('type', ['user', 'company'])->count();

        $totalRevenue = Invoice::where('status', 'paid')->where('paid_month', Carbon::now()->format('F'))->where('paid_year', Carbon::now()->year)->sum('amount');

        return response()->json([
            'branch_id' => $branchId,
            'total_chairs' => $totalChairs,
            'total_available_chairs' => $totalAvailableChairs,
            'total_occupied_chairs' => $totalOccupiedChairs,
            'total_members' => $memberCount,
            'total_revenue' => $totalRevenue,
        ]);
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