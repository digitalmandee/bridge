<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Floor;
use App\Models\Invoice;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function index()
    {
        // Fetch all floors with related rooms, tables, and chairs
        $floors = Floor::with(['rooms.tables.chairs'])->get();

        // Initialize counters
        $totalChairs = 0;
        $totalOccupiedChairs = 0;

        foreach ($floors as $floor) {
            foreach ($floor->rooms as $room) {
                foreach ($room->tables as $table) {
                    foreach ($table->chairs as $chair) {
                        if ($chair->time_slot !== 'available') {
                            $totalOccupiedChairs++;
                        }
                        $totalChairs++;
                    }
                }
            }
        }

        // Get total members
        // $memberCount = User::whereIn('type', ['user', 'company'])->count();

        // Get current and last month
        $currentMonth = Carbon::now()->format('F');
        $currentYear = Carbon::now()->year;
        $lastMonth = Carbon::now()->subMonth()->format('F');
        $lastYear = Carbon::now()->subMonth()->year;

        // Total Revenue (Current Month)
        $totalRevenue = Invoice::where('status', 'paid')->where('paid_month', $currentMonth)->where('paid_year', $currentYear)->sum('amount');

        // Members Revenue (Current Month)
        $totalMembersRevenue = Invoice::where('status', 'paid')->where('invoice_type', 'Monthly')->where('paid_month', $currentMonth)->where('paid_year', $currentYear)->sum('amount');

        // Total Expenses (Current Month)
        $totalExpenses = Invoice::where('status', 'paid')->where('invoice_type', 'Expense')->where('paid_month', $currentMonth)->where('paid_year', $currentYear)->sum('amount');

        // Total PNL (Current Month)
        $totalPNL = $totalRevenue - $totalExpenses;

        // Last Month Revenue
        $lastMonthRevenue = Invoice::where('status', 'paid')->where('paid_month', $lastMonth)->where('paid_year', $lastYear)->sum('amount');

        // Last Month Members Revenue
        $lastMonthMembersRevenue = Invoice::where('status', 'paid')->where('invoice_type', 'Monthly')->where('paid_month', $lastMonth)->where('paid_year', $lastYear)->sum('amount');

        // Last Month Expenses
        $lastMonthExpenses = Invoice::where('status', 'paid')->where('invoice_type', 'Expense')->where('paid_month', $lastMonth)->where('paid_year', $lastYear)->sum('amount');

        // Last Month PNL
        $lastMonthPNL = $lastMonthRevenue - $lastMonthExpenses;

        // Compare PNL (Current vs Last Month)
        $pnlDifference = $totalPNL - $lastMonthPNL;
        $pnlPercentageChange = $lastMonthPNL != 0 ? round(($pnlDifference / abs($lastMonthPNL)) * 100, 2) : 0;
        $pnlStatus = $pnlDifference > 0 ? 'Profit' : ($pnlDifference < 0 ? 'Loss' : 'No Change');

        // Compare Members Revenue (Current vs Last Month)
        $membersRevenueDifference = $totalMembersRevenue - $lastMonthMembersRevenue;
        $membersRevenuePercentageChange = $lastMonthMembersRevenue != 0 ? round(($membersRevenueDifference / abs($lastMonthMembersRevenue)) * 100, 2) : 0;
        $membersRevenueStatus = $membersRevenueDifference > 0 ? 'Profit' : ($membersRevenueDifference < 0 ? 'Loss' : 'No Change');

        // Desk Occupancy Rate
        $deskOccupancy = $totalChairs > 0 ? round(($totalOccupiedChairs / $totalChairs) * 100, 2) : 0;

        return response()->json([
            'total_revenue' => [
                'amount' => number_format($totalRevenue, 2),
                'change' => ($lastMonthRevenue != 0 ? round((($totalRevenue - $lastMonthRevenue) / abs($lastMonthRevenue)) * 100, 2) : 0) . '%',
                'status' => 'Profit'  // Revenue is always profit
            ],
            'total_members_revenue' => [
                'amount' => number_format($totalMembersRevenue, 2),
                'change' => $membersRevenuePercentageChange . '%',
                'status' => $membersRevenueStatus
            ],
            'total_pnl' => [
                'amount' => number_format($totalPNL, 2),
                'change' => $pnlPercentageChange . '%',
                'status' => $pnlStatus
            ],
            'desk_occupancy' => [
                'percentage' => $deskOccupancy . '%',
                'change' => 'N/A'
            ]
        ]);
    }

    public function customerStats(Request $request)
    {
        $from = Carbon::parse($request->query('from_date'))->startOfDay();
        $to = $request->query('to_date') ? Carbon::parse($request->query('to_date'))->endOfDay() : $from->copy()->endOfDay();

        $newUsers = User::whereIn('type', ['user', 'company'])
            ->whereNull('company_id')
            ->whereHas('contracts', function ($q) use ($from, $to) {
                $q
                    ->where('status', 'signed')
                    ->whereBetween('created_at', [$from, $to]);
            })
            ->get();

        $lostUsers = User::whereIn('type', ['user', 'company'])
            ->whereNull('company_id')
            ->whereDoesntHave('contracts', function ($q) {
                $q->where('status', 'signed');
            })
            ->whereHas('contracts', function ($q) use ($from, $to) {
                $q->whereBetween('created_at', [$from, $to]);
            })
            ->get();

        $growth = fn($curr, $prev) => $prev != 0 ? round((($curr - $prev) / $prev) * 100, 2) : 0;
        $totalUsers = User::whereIn('type', ['user', 'company'])
            ->whereNull('company_id')
            ->count();

        return response()->json([
            'stats' => [
                'new' => $newUsers->count(),
                'lost' => $lostUsers->count(),
                'total' => $totalUsers,
                'growth_new' => $growth($newUsers->count(), $lostUsers->count()),  // adjust logic if needed
                'growth_lost' => $growth($lostUsers->count(), $newUsers->count()),  // adjust logic if needed
            ],
            'customers' => collect()
                ->merge($newUsers->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'type' => $user->type,
                        'status' => 'new',
                        'profile_image' => $user->profile_image,
                    ];
                }))
                ->merge($lostUsers->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'type' => $user->type,
                        'status' => 'lost',
                        'profile_image' => $user->profile_image,
                    ];
                }))
                ->values(),
        ]);
    }
}