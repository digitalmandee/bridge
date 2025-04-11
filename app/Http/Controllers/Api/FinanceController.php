<?php

namespace App\Http\Controllers\Api;

use App\Helpers\FileHelper;
use App\Http\Controllers\Controller;
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

    public function getStats(Request $request)
    {
        $month = $request->query('month');
        $year = $request->query('year') ?? now()->year;

        $isYearly = $month == 0 || $month === 'all';

        if ($isYearly) {
            $currentRevenue = $this->getTotal(Invoice::class, 'paid_date', $year);
            $currentExpense = $this->getTotal(Finance::class, 'due_date', $year);
            $previousRevenue = $this->getTotal(Invoice::class, 'paid_date', $year - 1);
            $previousExpense = $this->getTotal(Finance::class, 'due_date', $year - 1);
        } else {
            $previousDate = Carbon::create($year, $month)->subMonth();
            $previousRevenue = $this->getTotal(Invoice::class, 'paid_date', $previousDate->year, $previousDate->month);
            $previousExpense = $this->getTotal(Finance::class, 'due_date', $previousDate->year, $previousDate->month);
            $currentRevenue = $this->getTotal(Invoice::class, 'paid_date', $year, $month);
            $currentExpense = $this->getTotal(Finance::class, 'due_date', $year, $month);

            $totalChairs = Chair::count('id');
            $bookedChairs = Chair::whereIn('time_slot', ['day', 'night', 'full_day'])->count('id');
            $availableChairs = Chair::whereIn('time_slot', ['available', 'day', 'night'])->count('id');
            $totlaMembers = User::whereIn('type', ['user', 'company'])->whereNull('company_id')->count('id');
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
            'total_chairs' => $totalChairs,
            'booked_chairs' => $bookedChairs,
            'available_chairs' => $availableChairs,
            'total_members' => $totlaMembers,
            'growth' => [
                'total_revenue' => number_format($growth($currentRevenue, $previousRevenue), 2),
                'total_expense' => number_format($growth($currentExpense, $previousExpense), 2),
                'total_pl' => number_format($growth($currentPL, $previousPL), 2),
            ],
        ]);
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
