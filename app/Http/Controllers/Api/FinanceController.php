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

        $finances = Finance::with(['category:id,name'])->paginate($limit);
        return response()->json(['success' => true, 'finances' => $finances], 200);
    }

    public function getStats(Request $request)
    {
        $currentMonth = Carbon::now()->format('m');
        $currentYear = Carbon::now()->year;

        $previousMonth = Carbon::now()->subMonth()->format('m');
        $previousYear = Carbon::now()->subMonth()->year;

        // Total Revenue (Current Month)
        $totalInvoice = Invoice::where('status', 'paid')->whereMonth('paid_date', $currentMonth)->whereYear('paid_date', $currentYear)->sum('amount');

        $totalFinance = Finance::where('status', 'paid')->whereMonth('due_date', $currentMonth)->whereYear('due_date', $currentYear)->sum('amount');

        $totalRevenue = $totalInvoice + $totalFinance;

        // Total Expense is the same as Total Finance
        $totalExpense = $totalFinance;

        // Total Profit & Loss (P&L)
        $totalPL = $totalRevenue - $totalExpense;

        // Previous Month's Data for Growth Calculation
        $prevInvoice = Invoice::where('status', 'paid')->whereMonth('paid_date', $previousMonth)->whereYear('paid_date', $previousYear)->sum('amount');

        $prevFinance = Finance::where('status', 'paid')->whereMonth('due_date', $previousMonth)->whereYear('due_date', $previousYear)->sum('amount');

        $prevRevenue = $prevInvoice + $prevFinance;
        $prevExpense = $prevFinance;  // Since Expense = Finance
        $prevPL = $prevRevenue - $prevExpense;

        // Growth Calculations
        $revenueGrowth = $prevRevenue > 0 ? (($totalRevenue - $prevRevenue) / $prevRevenue) * 100 : 0;
        $expenseGrowth = $prevExpense > 0 ? (($totalExpense - $prevExpense) / $prevExpense) * 100 : 0;
        $plGrowth = $prevPL > 0 ? (($totalPL - $prevPL) / $prevPL) * 100 : 0;

        return response()->json([
            'totalRevenue' => number_format($totalRevenue, 2) . 'kr',
            'totalExpense' => number_format($totalExpense, 2) . 'kr',
            'totalPL' => number_format($totalPL, 2) . 'kr',
            'growth' => [
                'totalRevenue' => number_format($revenueGrowth, 2) . '%',
                'totalExpense' => number_format($expenseGrowth, 2) . '%',
                'totalPL' => number_format($plGrowth, 2) . '%',
            ],
        ]);
    }

    // get finance by category
    public function getFinanceByCategory(Request $request, $categoryId)
    {
        $limit = $request->query('limit', 10);  // Default limit to 10
        $finances = Finance::where('category_id', $categoryId)->paginate($limit);

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
