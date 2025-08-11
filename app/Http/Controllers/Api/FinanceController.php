<?php

namespace App\Http\Controllers\Api;

use App\Helpers\FileHelper;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Chair;
use App\Models\Finance;
use App\Models\FinanceCategory;
use App\Models\Invoice;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;

class FinanceController extends Controller
{
    public function index(Request $request)
    {
        $limit = (int) $request->query('limit', 10);
        $from = $request->query('from_date');
        $to = $request->query('to_date');

        if (!$from) {
            return response()->json([
                'success' => false,
                'message' => 'from_date is required.'
            ], 422);
        }

        $from = Carbon::parse($from)->startOfDay();
        $to = $to ? Carbon::parse($to)->endOfDay() : $from->copy()->endOfDay();

        $finances = Finance::with('category:id,name')
            ->whereBetween('due_date', [$from, $to])
            ->orderByDesc('created_at')
            ->paginate($limit);

        return response()->json([
            'success' => true,
            'finances' => $finances
        ]);
    }

    public function getStats(Request $request)
    {
        $from = $request->query('from_date');
        $to = $request->query('to_date');

        if (!$from) {
            return response()->json(['success' => false, 'message' => 'from_date is required.'], 422);
        }

        $from = Carbon::parse($from)->startOfDay();
        $to = $to ? Carbon::parse($to)->endOfDay() : $from->copy()->endOfDay();

        $previousFrom = $from->copy()->subDays($from->diffInDays($to) + 1);
        $previousTo = $from->copy()->subDay();

        $currentRevenue = Invoice::whereBetween('paid_date', [$from, $to])->sum('amount');
        $currentExpense = Finance::whereBetween('due_date', [$from, $to])->sum('amount');

        $previousRevenue = Invoice::whereBetween('paid_date', [$previousFrom, $previousTo])->sum('amount');
        $previousExpense = Finance::whereBetween('due_date', [$previousFrom, $previousTo])->sum('amount');

        $totalChairs = Chair::count('id');
        $bookedChairs = Chair::whereIn('time_slot', ['day', 'night', 'full_day'])->count('id');
        $availableChairs = Chair::whereIn('time_slot', ['available', 'day', 'night'])->count('id');
        $totalMembers = User::whereIn('type', ['user', 'company'])->whereNull('company_id')->count('id');

        $booking = $this->getTotalCustomerBookings($from, $to);

        $currentPL = $currentRevenue - $currentExpense;
        $previousPL = $previousRevenue - $previousExpense;

        $growth = fn($current, $previous) =>
            $previous != 0 ? (($current - $previous) / abs($previous)) * 100 : 0;

        // -------------------------
        // 🔄 Dynamic Labels Logic
        // -------------------------
        $diffInDays = $from->diffInDays($to);
        $labels = [];
        $revenueData = [];
        $bookingsData = [];

        if ($diffInDays <= 7) {
            // Day-wise chart (1 to 7 days)
            $current = $from->copy();
            while ($current->lte($to)) {
                $labels[] = $current->format('d M Y');

                $revenueData[] = Finance::whereDate('issue_date', $current)
                    ->where('status', 'paid')
                    ->sum('amount');

                $bookingsData[] = Booking::whereDate('start_date', $current)
                    ->whereIn('status', ['completed', 'confirmed'])
                    ->sum('total_price');

                $current->addDay();
            }
        } else {
            // Month-wise chart (default)
            $startMonth = $from->copy()->startOfMonth();
            $endMonth = $to->copy()->startOfMonth();

            while ($startMonth <= $endMonth) {
                $monthStart = $startMonth->copy()->startOfMonth();
                $monthEnd = $startMonth->copy()->endOfMonth();

                $labels[] = $startMonth->format('M Y');

                $revenueData[] = Finance::whereBetween('issue_date', [$monthStart, $monthEnd])
                    ->where('status', 'paid')
                    ->sum('amount');

                $bookingsData[] = Booking::whereBetween('start_date', [$monthStart, $monthEnd])
                    ->whereIn('status', ['completed', 'confirmed'])
                    ->sum('total_price');

                $startMonth->addMonth();
            }
        }

        // Occupancy
        $currentOccupancy = $totalChairs > 0 ? ($bookedChairs / $totalChairs) * 100 : 0;

        $previousBookedChairs = Chair::whereIn('time_slot', ['day', 'night', 'full_day'])
            ->whereBetween('updated_at', [$previousFrom, $previousTo])
            ->count('id');

        $previousOccupancy = $totalChairs > 0 ? ($previousBookedChairs / $totalChairs) * 100 : 0;

        $occupancyGrowth = $growth($currentOccupancy, $previousOccupancy);

        // -------------------------
        // 🧑‍💼 Customer New & Lost
        // -------------------------
        $newUsers = User::whereIn('type', ['user', 'company'])
            ->whereNull('company_id')
            ->whereHas('contracts', function ($q) use ($from, $to) {
                $q
                    ->where('status', 'signed')
                    ->whereBetween('created_at', [$from, $to]);
            })
            ->count();

        $lostUsers = User::whereIn('type', ['user', 'company'])
            ->whereNull('company_id')
            ->whereDoesntHave('contracts', function ($q) {
                $q->where('status', 'signed');
            })
            ->whereHas('contracts', function ($q) use ($from, $to) {
                $q->whereBetween('created_at', [$from, $to]);
            })
            ->count();

        // -------------------------
        // 🧾 Invoice Paid & Overdue
        // -------------------------
        $invoicePaid = Invoice::where('status', 'paid')
            ->whereBetween('paid_date', [$from, $to])
            ->count();

        $invoiceOverdue = Invoice::where('status', 'unpaid')
            ->where('due_date', '<', now())
            ->whereBetween('created_at', [$from, $to])
            ->count();

        $bookingNew = Booking::whereBetween('created_at', [$from, $to])->count();

        $bookingLost = Booking::whereIn('status', ['rejected', 'vacated'])
            ->whereBetween('updated_at', [$from, $to])
            ->count();

        return response()->json([
            'success' => true,
            'total_revenue' => number_format($currentRevenue, 2),
            'total_expense' => number_format($currentExpense, 2),
            'total_pl' => number_format($currentPL, 2),
            'total_chairs' => $totalChairs,
            'booked_chairs' => $bookedChairs,
            'available_chairs' => $availableChairs,
            'total_members' => $totalMembers,
            'total_bookings' => $booking['totalBookings'],
            'day_bookings' => $booking['dayBookings'],
            'night_bookings' => $booking['nightBookings'],
            'fullday_bookings' => $booking['fullDayBookings'],
            'total_seats' => $booking['totalSeats'],
            'day_seats' => $booking['daySeats'],
            'night_seats' => $booking['nightSeats'],
            'fullday_seats' => $booking['fullSeats'],
            // For chart
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

    // get finance by category
    public function getFinanceByCategory(Request $request, $categoryId)
    {
        $limit = $request->query('limit', 10);  // Default limit to 10
        $finances = Finance::where('category_id', $categoryId)->orderBy('created_at', 'desc')->paginate($limit);

        $category = FinanceCategory::select('id', 'name')->find($categoryId);

        return response()->json(['success' => true, 'finances' => $finances, 'category' => $category]);
    }

    // Store a new finance entry
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'category_id' => 'required|exists:finance_categories,id',
            'description' => 'nullable|string',
            'amount' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:1',
            'status' => 'required|in:paid,unpaid',
            'issue_date' => 'required|date',
            'due_date' => 'required|date|after_or_equal:issue_date',
            // "receipt" => "nullable|required_if:status,paid|image",
        ]);

        // Handle receipt upload
        $financeReciept = $request->hasFile('receipt') && in_array($request->status, ['paid'])
            ? FileHelper::saveImage($request->file('receipt'), 'finance')
            : null;

        Finance::create([
            'category_id' => $request->category_id,
            'name' => $request->name,
            'description' => $request->description,
            'amount' => $request->amount,
            'quantity' => $request->quantity,
            'issue_date' => $request->issue_date,
            'due_date' => $request->due_date,
            'status' => $request->status,
            'receipt' => $financeReciept,
        ]);

        return response()->json(['success' => true, 'message' => 'Finance entry created successfully!']);
    }

    // Update a finance entry
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string',
            // 'category_id' => 'required|exists:finance_categories,id',
            'description' => 'nullable|string',
            'amount' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:1',
            'status' => 'required|in:paid,unpaid',
            'receipt' => 'nullable|required_if:status,paid|image',
            // 'issue_date' => 'required|date',
            // 'due_date' => 'required|date|after_or_equal:issue_date',
        ]);
        // Handle receipt upload
        $financeReciept = $request->hasFile('receipt') && in_array($request->status, ['paid'])
            ? FileHelper::saveImage($request->file('receipt'), 'finance')
            : null;

        $finance = Finance::find($id);

        if (!$finance) {
            return response()->json(['success' => false, 'message' => 'Finance entry not found'], 404);
        }

        $finance->update([
            'name' => $request->name,
            'description' => $request->description,
            'amount' => $request->amount,
            'quantity' => $request->quantity,
            'status' => $request->status,
            'receipt' => $financeReciept,
        ]);

        return response()->json(['success' => true, 'message' => 'Finance entry updated successfully!']);
    }

    // Delete a finance entry
    public function destroy($id)
    {
        $finance = Finance::find($id);

        if (!$finance) {
            return response()->json(['success' => false, 'message' => 'Finance entry not found'], 404);
        }

        $finance->delete();

        return response()->json(['success' => true, 'message' => 'Finance entry deleted successfully']);
    }

    public function download(Request $request)
    {
        $request->validate([
            'fileName' => 'required|string',
        ]);

        $filePath = public_path($request->fileName);

        if (!file_exists($filePath)) {
            return response()->json(['success' => false, 'message' => 'File not found.'], 404);
        }

        return response()->download($filePath);
    }
}