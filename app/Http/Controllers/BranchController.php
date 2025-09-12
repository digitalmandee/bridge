<?php

namespace App\Http\Controllers;

use App\Jobs\SeedDatabase;
use App\Models\Booking;
use App\Models\BookingChair;
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

        $from = $request->query('from_date');
        $to = $request->query('to_date');

        if (!$from) {
            return response()->json(['success' => false, 'message' => 'from_date is required.'], 422);
        }

        $from = Carbon::parse($from)->startOfDay();
        $to = $to ? Carbon::parse($to)->endOfDay() : $from->copy()->endOfDay();

        $previousFrom = $from->copy()->subDays($from->diffInDays($to) + 1);
        $previousTo = $from->copy()->subDay();

        // 💰 Finance
        $currentRevenue = Invoice::whereBetween('paid_date', [$from, $to])->sum('amount');
        $currentExpense = Finance::whereBetween('due_date', [$from, $to])->sum('amount');

        $previousRevenue = Invoice::whereBetween('paid_date', [$previousFrom, $previousTo])->sum('amount');
        $previousExpense = Finance::whereBetween('due_date', [$previousFrom, $previousTo])->sum('amount');

        $totalChairs = Chair::count('id');

        // 🪑 Seats now come from booking_chairs
        $bookedChairs = BookingChair::whereHas('booking', function ($q) use ($from, $to) {
            $q
                ->whereIn('status', ['confirmed'])
                ->whereBetween('start_date', [$from, $to]);
        })->count();

        $availableChairs = $totalChairs - $bookedChairs;

        $totalMembers = User::whereIn('type', ['user', 'company'])
            ->whereNull('company_id')
            ->count('id');

        // 📊 Totals using booking_chairs
        $bookingChairs = BookingChair::whereHas('booking', function ($q) use ($from, $to) {
            $q
                ->whereIn('status', ['confirmed'])
                ->whereBetween('start_date', [$from, $to]);
        })->with('chair')->get();

        $daySeats = $bookingChairs->where('booking.time_slot', 'day')->count();
        $nightSeats = $bookingChairs->where('booking.time_slot', 'night')->count();
        $fullSeats = $bookingChairs->where('booking.time_slot', 'full_day')->count();

        $totalSeats = $daySeats + $nightSeats + $fullSeats;

        // 📈 Current vs Previous PL
        $currentPL = $currentRevenue - $currentExpense;
        $previousPL = $previousRevenue - $previousExpense;

        $growth = fn($current, $previous) => $previous != 0 ? (($current - $previous) / abs($previous)) * 100 : 0;

        // -------------------------
        // 🔄 Dynamic Labels Logic
        // -------------------------
        $diffInDays = $from->diffInDays($to);
        $labels = [];
        $revenueData = [];
        $bookingsData = [];

        if ($diffInDays <= 7) {
            // Day-wise chart
            $current = $from->copy();
            while ($current->lte($to)) {
                $labels[] = $current->format('d M Y');

                $revenueData[] = Invoice::whereDate('paid_date', $current)->sum('amount');

                $bookingsData[] = Booking::whereDate('start_date', $current)
                    ->whereIn('status', ['confirmed'])
                    ->sum('total_price');

                $current->addDay();
            }
        } else {
            // Month-wise chart
            $startMonth = $from->copy()->startOfMonth();
            $endMonth = $to->copy()->startOfMonth();

            while ($startMonth <= $endMonth) {
                $monthStart = $startMonth->copy()->startOfMonth();
                $monthEnd = $startMonth->copy()->endOfMonth();

                $labels[] = $startMonth->format('M Y');

                $revenueData[] = Invoice::whereBetween('paid_date', [$monthStart, $monthEnd])->sum('amount');

                $bookingsData[] = Booking::whereBetween('start_date', [$monthStart, $monthEnd])
                    ->whereIn('status', ['completed', 'confirmed'])
                    ->sum('total_price');

                $startMonth->addMonth();
            }
        }

        // 🪑 Occupancy
        $currentOccupancy = $totalChairs > 0 ? ($bookedChairs / $totalChairs) * 100 : 0;

        $previousBookedChairs = BookingChair::whereHas('booking', function ($q) use ($previousFrom, $previousTo) {
            $q
                ->whereIn('status', ['confirmed'])
                ->whereBetween('start_date', [$previousFrom, $previousTo]);
        })->count();

        $previousOccupancy = $totalChairs > 0 ? ($previousBookedChairs / $totalChairs) * 100 : 0;

        $occupancyGrowth = $growth($currentOccupancy, $previousOccupancy);

        // 🧑‍💼 Customers
        $newUsers = User::whereIn('type', ['user', 'company'])
            ->whereNull('company_id')
            ->whereHas('contracts', function ($q) use ($from, $to) {
                $q->where('status', 'signed')->whereBetween('created_at', [$from, $to]);
            })
            ->count();

        $lostUsers = User::whereIn('type', ['user', 'company'])
            ->whereNull('company_id')
            ->whereDoesntHave('contracts', fn($q) => $q->where('status', 'signed'))
            ->whereHas('contracts', fn($q) => $q->whereBetween('created_at', [$from, $to]))
            ->count();

        // 🧾 Invoices
        $invoicePaid = Invoice::where('status', 'paid')->whereBetween('paid_date', [$from, $to])->count();
        $invoiceOverdue = Invoice::where('status', 'unpaid')->where('due_date', '<', now())->whereBetween('created_at', [$from, $to])->count();

        $bookingNew = Booking::whereBetween('created_at', [$from, $to])->count();
        $bookingLost = Booking::whereIn('status', ['rejected', 'vacated'])->whereBetween('updated_at', [$from, $to])->count();

        return response()->json([
            'success' => true,
            'total_revenue' => number_format($currentRevenue, 2),
            'total_expense' => number_format($currentExpense, 2),
            'total_pl' => number_format($currentPL, 2),
            'total_chairs' => $totalChairs,
            'booked_chairs' => $bookedChairs,
            'available_chairs' => $availableChairs,
            'total_members' => $totalMembers,
            'total_bookings' => $bookingNew,  // now counting new bookings in range
            'day_bookings' => $daySeats,
            'night_bookings' => $nightSeats,
            'fullday_bookings' => $fullSeats,
            'total_seats' => $totalSeats,
            'day_seats' => $daySeats,
            'night_seats' => $nightSeats,
            'fullday_seats' => $fullSeats,
            // Chart data
            'revenue' => $revenueData,
            'bookings' => $bookingsData,
            'labels' => $labels,
            'occupancy' => [
                'current' => number_format($currentOccupancy, 2),
                'previous' => number_format($previousOccupancy, 2),
                'growth' => number_format($occupancyGrowth, 2),
            ],
            'customer' => [
                'new' => $newUsers,
                'lost' => $lostUsers,
                'growth' => number_format($growth($newUsers, $lostUsers), 2),
            ],
            'invoice' => [
                'paid' => $invoicePaid,
                'overdue' => $invoiceOverdue,
                'growth' => number_format($growth($invoicePaid, $invoiceOverdue), 2),
            ],
            'booking' => [
                'new' => $bookingNew,
                'lost' => $bookingLost,
                'growth' => number_format($growth($bookingNew, $bookingLost), 2),
            ],
            'growth' => [
                'total_revenue' => number_format($growth($currentRevenue, $previousRevenue), 2),
                'total_expense' => number_format($growth($currentExpense, $previousExpense), 2),
                'total_pl' => number_format($growth($currentPL, $previousPL), 2),
            ],
        ]);
    }

    private function getTotalCustomerBookings(Carbon $from, Carbon $to)
    {
        $baseQuery = Booking::whereBetween('start_date', [$from, $to]);

        $totalBookings = (clone $baseQuery)->count();

        $dayBookings = (clone $baseQuery)->where('time_slot', 'day')->count();
        $nightBookings = (clone $baseQuery)->where('time_slot', 'night')->count();
        $fullDayBookings = (clone $baseQuery)->where('time_slot', 'full_day')->count();

        $totalSeats = (clone $baseQuery)->get()->sum(fn($b) => is_array($b->chair_ids) ? count($b->chair_ids) : 0);

        $daySeats = (clone $baseQuery)->where('time_slot', 'day')->get()->sum(fn($b) => is_array($b->chair_ids) ? count($b->chair_ids) : 0);
        $nightSeats = (clone $baseQuery)->where('time_slot', 'night')->get()->sum(fn($b) => is_array($b->chair_ids) ? count($b->chair_ids) : 0);
        $fullSeats = (clone $baseQuery)->where('time_slot', 'full_day')->get()->sum(fn($b) => is_array($b->chair_ids) ? count($b->chair_ids) : 0);

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