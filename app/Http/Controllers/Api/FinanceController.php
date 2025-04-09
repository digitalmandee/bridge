<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Finance;
use App\Models\FinanceCategory;
use App\Models\Invoice;
use Carbon\Carbon;
use Illuminate\Http\Request;

class FinanceController extends Controller
{
    // Fetch all finance entries
    public function index(Request $request)
    {
        $limit = $request->query('limit') ?? 10;
        $month = $request->query('month');
        $year = $request->query('year');

        // Build the query
        $query = Finance::with(['category:id,name']);

        if ($month) {
            $query->whereMonth('due_date', $month);  // Filter by month
        }

        if ($year) {
            $query->whereYear('due_date', $year);  // Filter by year
        }

        // Paginate the results
        $finances = $query->orderBy('created_at', 'desc')->paginate($limit);

        return response()->json(['success' => true, 'finances' => $finances], 200);
    }

    public function getStats(Request $request)
    {
        $month = $request->query('month');
        $year = $request->query('year') ?? Carbon::now()->year;

        if ($month == 0 || $month === 'all') {
            // Yearly totals
            $totalRevenue = Invoice::where('status', 'paid')->whereYear('paid_date', $year)->sum('amount');

            $totalExpense = Finance::where('status', 'paid')->whereYear('due_date', $year)->sum('amount');

            $totalPL = $totalRevenue - $totalExpense;

            // Previous year
            $prevRevenue = Invoice::where('status', 'paid')->whereYear('paid_date', $year - 1)->sum('amount');

            $prevExpense = Finance::where('status', 'paid')->whereYear('due_date', $year - 1)->sum('amount');

            $prevPL = $prevRevenue - $prevExpense;
        } else {
            // Monthly totals
            $previousDate = Carbon::createFromDate($year, $month, 1)->subMonth();
            $prevMonth = $previousDate->month;
            $prevYear = $previousDate->year;

            $totalRevenue = Invoice::where('status', 'paid')->whereMonth('paid_date', $month)->whereYear('paid_date', $year)->sum('amount');

            $totalExpense = Finance::where('status', 'paid')->whereMonth('due_date', $month)->whereYear('due_date', $year)->sum('amount');

            $totalPL = $totalRevenue - $totalExpense;

            // Previous month
            $prevRevenue = Invoice::where('status', 'paid')->whereMonth('paid_date', $prevMonth)->whereYear('paid_date', $prevYear)->sum('amount');

            $prevExpense = Finance::where('status', 'paid')->whereMonth('due_date', $prevMonth)->whereYear('due_date', $prevYear)->sum('amount');

            $prevPL = $prevRevenue - $prevExpense;
        }

        // Growth calculations
        $revenueGrowth = $prevRevenue > 0 ? (($totalRevenue - $prevRevenue) / $prevRevenue) * 100 : 0;
        $expenseGrowth = $prevExpense > 0 ? (($totalExpense - $prevExpense) / $prevExpense) * 100 : 0;
        $plGrowth = $prevPL != 0 ? (($totalPL - $prevPL) / abs($prevPL)) * 100 : 0;

        return response()->json([
            'success' => true,
            'total_revenue' => number_format($totalRevenue, 2),
            'total_expense' => number_format($totalExpense, 2),
            'total_pl' => number_format($totalPL, 2),
            'growth' => [
                'total_revenue' => number_format($revenueGrowth, 2),
                'total_expense' => number_format($expenseGrowth, 2),
                'total_pl' => number_format($plGrowth, 2),
            ],
        ]);
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
        ]);

        $finance = Finance::create($request->all());

        return response()->json(['success' => true, 'message' => 'Finance entry created successfully!', 'finance' => $finance]);
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
            // 'issue_date' => 'required|date',
            // 'due_date' => 'required|date|after_or_equal:issue_date',
        ]);

        $finance = Finance::find($id);

        if (!$finance) {
            return response()->json(['success' => false, 'message' => 'Finance entry not found'], 404);
        }

        $finance->update($request->all());

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
}
