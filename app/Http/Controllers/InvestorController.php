<?php

namespace App\Http\Controllers;

use App\Helpers\FileHelper;
use App\Models\Investment;
use App\Models\InvestmentType;
use App\Models\Investor;
use App\Models\ScheduleFloor;
use App\Models\User;
use Illuminate\Http\Request;

class InvestorController extends Controller
{
    // 🔍 Search existing investors
    public function search(Request $request)
    {
        $q = $request->get('q');

        $users = User::query()
            ->where('is_investor', true)
            ->where(function ($query) use ($q) {
                $query
                    ->where('name', 'like', "%{$q}%")
                    ->orWhere('email', 'like', "%{$q}%");
            })
            ->select('id', 'name', 'email')
            ->limit(10)
            ->get();

        return response()->json($users);
    }

    // ➕ Create new investment (and user/investor if needed)
    public function createInvestment(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'type' => 'required|exists:investment_types,id',
            'location' => 'nullable',
            'amount' => 'required|numeric|min:1',
            'profit_percent' => 'nullable|numeric|min:0|max:100',
            'share_percent' => 'nullable|numeric|min:0|max:100',
            'share_type' => 'nullable|in:equity,fixed,other',
            'date' => 'required|date',
            'notes' => 'nullable|string',
            'invoice' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ]);

        // 1️⃣ Find or create user
        $user = User::firstOrCreate(
            ['email' => $validated['email']],
            ['name' => $validated['name'], 'type' => 'user', 'is_investor' => true]
        );
        $user->assignRole('user');

        if (!$user->is_investor) {
            $user->update(['is_investor' => true]);
        }

        // 2️⃣ Ensure investor profile exists
        $investor = Investor::firstOrCreate(
            ['user_id' => $user->id],
            ['name' => $user->name]
        );

        // 3️⃣ Handle invoice upload
        $invoicePath = null;
        if ($request->hasFile('invoice')) {
            $invoicePath = FileHelper::saveImage($request->file('invoice'), 'investment_invoices');
        }

        // 4️⃣ Create investment
        $investment = Investment::create([
            'user_id' => $user->id,
            'investor_id' => $investor->id,
            'investment_type_id' => $validated['type'],
            'location' => $validated['location'],
            'amount' => $validated['amount'],
            'profit_percent' => $validated['profit_percent'] ?? null,
            'share_percent' => $validated['share_percent'] ?? null,
            'share_type' => $validated['share_type'] ?? null,
            'date' => $validated['date'],
            'notes' => $validated['notes'] ?? null,
            'invoice_path' => $invoicePath,
        ]);

        return response()->json([
            'message' => 'Investment created successfully',
            'investment' => $investment,
            'user' => $user,
        ]);
    }

    public function becomeInvestor(Request $request)
    {
        $user = $request->user();
        $user->update(['is_investor' => true]);

        Investor::firstOrCreate(
            ['user_id' => $user->id],
            ['name' => $user->name]
        );

        return response()->json(['message' => 'You are now an investor']);
    }

    public function dashboard(Request $request)
    {
        $user = $request->user();

        // 🔎 If Admin → all investments, If Investor → only their investments
        if ($user->hasRole('admin')) {
            $investments = Investment::latest()->get();
        } elseif ($user->hasRole('user') && $user->is_investor) {
            $investments = $user->investments()->latest()->get();
        } else {
            return response()->json(['message' => 'Not an investor']);
        }

        if ($investments->isEmpty()) {
            return response()->json([
                'totalInvestment' => 0,
                'totalProfit' => 0,
                'branchIncome' => 0,
                'totalShares' => 0,
                'equityShare' => 0,
                'months' => [],
                'investment' => [],
                'expenses' => [],
                'profit' => [],
            ]);
        }

        // 💰 Total investment
        $totalInvestment = $investments->sum('amount');

        // 📈 Total profit = (amount * profit_percent/100)
        $totalProfit = $investments->sum(function ($inv) {
            $percent = $inv->profit_percent ?? 0;
            return $inv->amount * ($percent / 100);
        });

        // 🏢 Branch income (currently same as investment total, can change formula later)
        $branchIncome = $totalInvestment;

        // 📌 Shares
        $totalShares = $investments->sum(fn($inv) => $inv->share_percent ?? 0);
        $equityShare = $investments->where('share_type', 'equity')->sum('share_percent');

        // 📊 Group investments by month (for charts)
        $monthly = $investments->groupBy(fn($i) => date('M', strtotime($i->date)));

        $months = $monthly->keys();
        $investmentArr = $monthly->map(fn($inv) => $inv->sum('amount'))->values();
        $profitArr = $monthly->map(fn($inv) => $inv->sum(function ($i) {
            $percent = $i->profit_percent ?? 0;
            return $i->amount * ($percent / 100);
        }))->values();

        // You don’t have "expenses" column yet → temporary 10% of amount
        $expensesArr = $monthly->map(fn($inv) => $inv->sum('amount') * 0.1)->values();

        return response()->json([
            'totalInvestment' => $totalInvestment,
            'totalProfit' => $totalProfit,
            'branchIncome' => $branchIncome,
            'totalShares' => $totalShares,
            'equityShare' => $equityShare,
            'months' => $months,
            'investment' => $investmentArr,
            'expenses' => $expensesArr,
            'profit' => $profitArr,
        ]);
    }

    // ✅ Get all investment types
    public function getTypes()
    {
        return response()->json(
            InvestmentType::select('id', 'name')->orderBy('name')->get()
        );
    }

    // ✅ Get all locations
    public function getLocations()
    {
        return response()->json(
            ScheduleFloor::select('id', 'name')->orderBy('name')->get()
        );
    }
}