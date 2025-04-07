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
        $year = $request->query('year') ?? Carbon::now()->year;  // Default to current year

        // If "All months" is selected (i.e., month == 0 or 'all')
        if ($month == 0) {
            // Total Revenue (for the entire year)
            $totalInvoice = Invoice::where('status', 'paid')->whereYear('paid_date', $year)->sum('amount');
            $totalFinance = Finance::where('status', 'paid')->whereYear('due_date', $year)->sum('amount');
            $totalRevenue = $totalInvoice + $totalFinance;

            // Total Expense (same as Total Finance)
            $totalExpense = $totalFinance;

            // Total Profit & Loss (P&L)
            $totalPL = $totalExpense;

            // Growth Calculations - Compare with last year's data
            $prevInvoice = Invoice::where('status', 'paid')->whereYear('paid_date', $year - 1)->sum('amount');
            $prevFinance = Finance::where('status', 'paid')->whereYear('due_date', $year - 1)->sum('amount');
            $prevRevenue = $prevInvoice + $prevFinance;
            $prevExpense = $prevFinance;  // Since Expense = Finance
            $prevPL = $prevRevenue;
        } else {
            // For a specific month
            $previousMonth = Carbon::createFromFormat('Y-m', "$year-$month")->subMonth()->format('m');
            $previousYear = Carbon::createFromFormat('Y-m', "$year-$month")->subMonth()->year;

            // Total Revenue (for the selected month and year)
            $totalInvoice = Invoice::where('status', 'paid')->whereMonth('paid_date', $month)->whereYear('paid_date', $year)->sum('amount');
            $totalFinance = Finance::where('status', 'paid')->whereMonth('due_date', $month)->whereYear('due_date', $year)->sum('amount');
            $totalRevenue = $totalInvoice + $totalFinance;

            // Total Expense (same as Total Finance)
            $totalExpense = $totalFinance;

            // Total Profit & Loss (P&L)
            $totalPL = $totalExpense;

            // Previous Month's Data for Growth Calculation
            $prevInvoice = Invoice::where('status', 'paid')->whereMonth('paid_date', $previousMonth)->whereYear('paid_date', $previousYear)->sum('amount');
            $prevFinance = Finance::where('status', 'paid')->whereMonth('due_date', $previousMonth)->whereYear('due_date', $previousYear)->sum('amount');
            $prevRevenue = $prevInvoice + $prevFinance;
            $prevExpense = $prevFinance;  // Since Expense = Finance
            $prevPL = $prevRevenue;
        }

        // Growth Calculations
        $revenueGrowth = $prevRevenue > 0 ? (($totalRevenue - $prevRevenue) / $prevRevenue) * 100 : 0;
        $expenseGrowth = $prevExpense > 0 ? (($totalExpense - $prevExpense) / $prevExpense) * 100 : 0;
        $plGrowth = $prevPL > 0 ? (($totalPL - $prevPL) / $prevPL) * 100 : 0;

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
