<?php

namespace App\Http\Controllers;

use App\Jobs\SeedDatabase;
use App\Models\Booking;
use App\Models\Chair;
use App\Models\Finance;
use App\Models\Floor;
use App\Models\Invoice;
use App\Models\Tenant;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;

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
        ]);

        try {
            DB::beginTransaction();
            $validatedData['id'] = strtolower(str_replace(' ', '-', $validatedData['location']));

            $tenant = Tenant::create($validatedData);
            SeedDatabase::dispatch($tenant);

            tenancy()->initialize($tenant);

            $user = User::create([
                'name' => $validatedData['name'],
                'email' => $validatedData['email'],
                'type' => 'admin',
            ]);

            $user->assignRole('admin');
            DB::commit();

            return response()->json(['success' => true, 'message' => 'Branch created successfully']);
        } catch (QueryException $e) {
            Log::info('Error creating branch: ' . $e->getMessage());
            DB::rollBack();

            // Check if the error is for duplicate 'location'
            if ($e->getCode() === '23000' && str_contains($e->getMessage(), 'tenants_location_unique')) {
                return response()->json(['error' => 'branch already exists'], 422);
            }

            return response()->json(['error' => 'Branch not created.'], 500);
        } catch (\Exception $e) {
            Log::info('Error creating branch: ' . $e->getMessage());
            DB::rollBack();
            return response()->json(['error' => 'Branch not created.'], 500);
        }
    }

    public function checkBranch(Request $request)
    {
        return response()->json(['exist' => Tenant::whereKey($request->query('branch'))->where('status', 'active')->exists()]);
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

        $month = $request->query('month');
        $year = $request->query('year') ?? now()->year;
        $date = $request->query('date');  // NEW

        if ($date) {
            // Daily
            $currentRevenue = Invoice::whereDate('paid_date', $date)->sum('amount');
            $currentExpense = Finance::whereDate('due_date', $date)->sum('amount');

            $previousDate = Carbon::parse($date)->subDay();
            $previousRevenue = Invoice::whereDate('paid_date', $previousDate)->sum('amount');
            $previousExpense = Finance::whereDate('due_date', $previousDate)->sum('amount');

            $totalChairs = Chair::count('id');
            $bookedChairs = Chair::whereIn('time_slot', ['day', 'night', 'full_day'])->count('id');
            $availableChairs = Chair::whereIn('time_slot', ['available', 'day', 'night'])->count('id');
            $totalMembers = User::whereIn('type', ['user', 'company'])
                ->whereNull('company_id')
                ->count('id');

            $booking = $this->getTotalCustomerBooings($date, $year);
        } else if ($month == 0 || $month === 'all') {
            // Yearly
            $currentRevenue = $this->getTotal(Invoice::class, 'paid_date', $year);
            $currentExpense = $this->getTotal(Finance::class, 'due_date', $year);
            $previousRevenue = $this->getTotal(Invoice::class, 'paid_date', $year - 1);
            $previousExpense = $this->getTotal(Finance::class, 'due_date', $year - 1);
            $booking = $this->getTotalCustomerBooings(null, $year);
        } else {
            // Monthly
            $previousDate = Carbon::create($year, $month)->subMonth();
            $previousRevenue = $this->getTotal(Invoice::class, 'paid_date', $previousDate->year, $previousDate->month);
            $previousExpense = $this->getTotal(Finance::class, 'due_date', $previousDate->year, $previousDate->month);
            $currentRevenue = $this->getTotal(Invoice::class, 'paid_date', $year, $month);
            $currentExpense = $this->getTotal(Finance::class, 'due_date', $year, $month);

            $totalChairs = Chair::count('id');
            $bookedChairs = Chair::whereIn('time_slot', ['day', 'night', 'full_day'])->count('id');
            $availableChairs = Chair::whereIn('time_slot', ['available', 'day', 'night'])->count('id');
            $totalMembers = User::whereIn('type', ['user', 'company'])
                ->whereNull('company_id')
                ->count('id');

            $booking = $this->getTotalCustomerBooings(null, $year, $month);
        }

        $currentPL = $currentRevenue - $currentExpense;
        $previousPL = $previousRevenue - $previousExpense;

        $growth = fn($current, $previous) =>
            $previous != 0 ? (($current - $previous) / abs($previous)) * 100 : 0;

        $currentYear = $year;

        $revenue = [];  // Invoice amounts
        $bookings = [];  // Booking amounts (you might need to adjust this if you track booking differently)

        for ($i = 1; $i <= 12; $i++) {
            $revenue[] = Finance::whereYear('issue_date', $currentYear)
                ->whereMonth('issue_date', $i)
                ->where('status', 'paid')
                ->sum('amount');

            $bookings[] = Booking::whereYear('start_date', $currentYear)
                ->whereMonth('start_date', $i)
                ->whereIn('status', ['completed', 'confirmed'])
                ->sum('total_price');  // or seats * price if you need total booking amount
        }

        return response()->json([
            'success' => true,
            'branch_id' => $branchId,
            'total_revenue' => number_format($currentRevenue, 2),
            'total_expense' => number_format($currentExpense, 2),
            'total_pl' => number_format($currentPL, 2),
            'total_chairs' => $totalChairs ?? 0,
            'booked_chairs' => $bookedChairs ?? 0,
            'available_chairs' => $availableChairs ?? 0,
            'total_members' => $totalMembers ?? 0,
            'total_bookings' => $booking['totalBookings'] ?? 0,
            'day_bookings' => $booking['dayBookings'] ?? 0,
            'night_bookings' => $booking['nightBookings'] ?? 0,
            'fullday_bookings' => $booking['fullDayBookings'] ?? 0,
            'total_seats' => $booking['totalSeats'] ?? 0,
            'day_seats' => $booking['daySeats'] ?? 0,
            'night_seats' => $booking['nightSeats'] ?? 0,
            'fullday_seats' => $booking['fullSeats'] ?? 0,
            'revenue' => $revenue,
            'bookings' => $bookings,
            'growth' => [
                'total_revenue' => number_format($growth($currentRevenue, $previousRevenue), 2),
                'total_expense' => number_format($growth($currentExpense, $previousExpense), 2),
                'total_pl' => number_format($growth($currentPL, $previousPL), 2),
            ],
        ]);
    }

    private function getTotalCustomerBooings($date = null, $year, $month = null)
    {
        if ($date) {
            // Daily
            $totalBookings = Booking::whereDate('start_date', $date)->count();

            $dayBookings = Booking::whereDate('start_date', $date)->where('time_slot', 'day')->count();

            $nightBookings = Booking::whereDate('start_date', $date)->where('time_slot', 'night')->count();

            $fullDayBookings = Booking::whereDate('start_date', $date)->where('time_slot', 'full_day')->count();

            $totalSeats = Booking::whereDate('start_date', $date)
                ->get()
                ->sum(function ($booking) {
                    return is_array($booking->chair_ids) ? count($booking->chair_ids) : 0;
                });

            $daySeats = Booking::whereDate('start_date', $date)
                ->where('time_slot', 'day')
                ->get()
                ->sum(function ($booking) {
                    return is_array($booking->chair_ids) ? count($booking->chair_ids) : 0;
                });

            $nightSeats = Booking::whereDate('start_date', $date)
                ->where('time_slot', 'night')
                ->get()
                ->sum(function ($booking) {
                    return is_array($booking->chair_ids) ? count($booking->chair_ids) : 0;
                });

            $fullSeats = Booking::whereDate('start_date', $date)
                ->where('time_slot', 'full_day')
                ->get()
                ->sum(function ($booking) {
                    return is_array($booking->chair_ids) ? count($booking->chair_ids) : 0;
                });
        } else if ($month && $month !== 'all') {
            // Monthly
            $totalBookings = Booking::whereYear('start_date', $year)
                ->whereMonth('start_date', $month)
                ->count();

            $dayBookings = Booking::whereYear('start_date', $year)
                ->whereMonth('start_date', $month)
                ->where('time_slot', 'day')
                ->count();

            $nightBookings = Booking::whereYear('start_date', $year)
                ->whereMonth('start_date', $month)
                ->where('time_slot', 'night')
                ->count();

            $fullDayBookings = Booking::whereYear('start_date', $year)
                ->whereMonth('start_date', $month)
                ->where('time_slot', 'full_day')
                ->count();

            $totalSeats = Booking::whereYear('start_date', $year)
                ->whereMonth('start_date', $month)
                ->get()
                ->sum(function ($booking) {
                    return is_array($booking->chair_ids) ? count($booking->chair_ids) : 0;
                });

            $daySeats = Booking::whereYear('start_date', $year)
                ->whereMonth('start_date', $month)
                ->where('time_slot', 'day')
                ->get()
                ->sum(function ($booking) {
                    return is_array($booking->chair_ids) ? count($booking->chair_ids) : 0;
                });

            $nightSeats = Booking::whereYear('start_date', $year)
                ->whereMonth('start_date', $month)
                ->where('time_slot', 'night')
                ->get()
                ->sum(function ($booking) {
                    return is_array($booking->chair_ids) ? count($booking->chair_ids) : 0;
                });

            $fullSeats = Booking::whereYear('start_date', $year)
                ->whereMonth('start_date', $month)
                ->where('time_slot', 'full_day')
                ->get()
                ->sum(function ($booking) {
                    return is_array($booking->chair_ids) ? count($booking->chair_ids) : 0;
                });
        } else {
            // Yearly
            $totalBookings = Booking::whereYear('start_date', $year)->count();

            $dayBookings = Booking::whereYear('start_date', $year)->where('time_slot', 'day')->count();

            $nightBookings = Booking::whereYear('start_date', $year)->where('time_slot', 'night')->count();

            $fullDayBookings = Booking::whereYear('start_date', $year)->where('time_slot', 'full_day')->count();

            $totalSeats = Booking::whereYear('start_date', $year)
                ->get()
                ->sum(function ($booking) {
                    return is_array($booking->chair_ids) ? count($booking->chair_ids) : 0;
                });

            $daySeats = Booking::whereYear('start_date', $year)
                ->where('time_slot', 'day')
                ->get()
                ->sum(function ($booking) {
                    return is_array($booking->chair_ids) ? count($booking->chair_ids) : 0;
                });

            $nightSeats = Booking::whereYear('start_date', $year)
                ->where('time_slot', 'night')
                ->get()
                ->sum(function ($booking) {
                    return is_array($booking->chair_ids) ? count($booking->chair_ids) : 0;
                });

            $fullSeats = Booking::whereYear('start_date', $year)
                ->where('time_slot', 'full_day')
                ->get()
                ->sum(function ($booking) {
                    return is_array($booking->chair_ids) ? count($booking->chair_ids) : 0;
                });
        }

        return [
            'totalBookings' => $totalBookings,
            'dayBookings' => $dayBookings,
            'nightBookings' => $nightBookings,
            'fullDayBookings' => $fullDayBookings,
            'totalSeats' => $totalSeats,
            'daySeats' => $daySeats,
            'nightSeats' => $nightSeats,
            'fullSeats' => $fullSeats,
        ];
    }

    /**
     * Get total amount based on model, date field, year, and optional month.
     */
    private function getTotal(string $modelClass, string $dateField, int $year, ?int $month = null): float
    {
        $query = $modelClass::where('status', 'paid')->whereYear($dateField, $year);

        if ($month) {
            $query->whereMonth($dateField, $month);
        }

        return $query->sum('amount');
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
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'floors' => 'required|integer',
            'rooms' => 'required|integer',
            'seats' => 'required|integer',
            'tables' => 'required|integer',
            'status' => 'required|in:active,inactive,blocked',
        ]);

        try {
            DB::beginTransaction();

            $tenant = Tenant::find($id);

            if (!$tenant) {
                return response()->json(['error' => 'Invalid Branch ID'], 404);
            }

            $tenant->name = $validatedData['name'];
            $tenant->floors = $validatedData['floors'];
            $tenant->rooms = $validatedData['rooms'];
            $tenant->seats = $validatedData['seats'];
            $tenant->tables = $validatedData['tables'];
            $tenant->status = $validatedData['status'];
            $tenant->save();

            // Update tenant database
            // tenancy()->initialize($tenant);

            // User::where('email', $tenant->email)->update([
            //     'name' => $validatedData['name'],
            // ]);
            DB::commit();

            return response()->json(['success' => true, 'message' => 'Branch updated successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Something went wrong.'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}