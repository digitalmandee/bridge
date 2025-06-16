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
    // Fetch all finance entries
    public function index(Request $request)
    {
        $limit = (int) $request->query('limit', 10);
        $month = $request->query('month');
        $year = $request->query('year');

        $finances = Finance::with('category:id,name')
            ->when($month, fn($q) => $q->whereMonth('due_date', $month))
            ->when($year, fn($q) => $q->whereYear('due_date', $year))
            ->orderByDesc('created_at')
            ->paginate($limit);

        return response()->json(['success' => true, 'finances' => $finances]);
    }

    public function getMonthlyStats(Request $request)
    {
        $currentYear = now()->year;

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
            'revenue' => $revenue,
            'bookings' => $bookings,
        ]);
    }

    public function getStats(Request $request)
    {
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

        return response()->json([
            'success' => true,
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
