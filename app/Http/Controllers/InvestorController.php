<?php

namespace App\Http\Controllers;

use App\Helpers\FileHelper;
use App\Models\Investment;
use App\Models\InvestmentType;
use App\Models\Investor;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InvestorController extends Controller
{
    public function investments(Request $request)
    {
        $user = $request->user();

        $query = Investment::query()
            ->with(['location:id,name', 'investor', 'user']);

        if ($user->hasRole('superadmin')) {
            $investments = $query->get();
        } elseif ($user->hasRole('investor')) {
            $investments = $query->where('user_id', $user->id)->get();
        } else {
            return response()->json(['message' => 'Not an investor'], 400);
        }

        return response()->json($investments);
    }

    public function search(Request $request)
    {
        $q = $request->get('q');

        $query = User::query()
            ->role('investor')  // ✅ Correct for query scope
            ->select('id', 'name', 'email');

        if (!empty($q)) {
            $query->where(function ($sub) use ($q) {
                $sub
                    ->where('name', 'like', "%{$q}%")
                    ->orWhere('email', 'like', "%{$q}%");
            });
        }

        $users = $query->limit(10)->get();

        return response()->json($users);
    }

    // ➕ Create new investment (and user/investor if needed)

    public function createInvestment(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'type' => 'required|exists:investment_types,id',
            'amount' => 'required|numeric|min:1',
            'profit_percent' => 'nullable|numeric|min:0|max:100',
            'share_percent' => 'nullable|numeric|min:0|max:100',
            'share_type' => 'nullable|in:equity,fixed,other',
            'date' => 'required|date',
            'notes' => 'nullable|string',
            'invoice' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
            'location' => 'nullable|exists:tenants,id',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            // 1️⃣ Check if user exists
            $user = User::where('email', $validated['email'])->first();

            if ($user) {
                // If user exists but is NOT investor → ❌ stop
                if (!$user->hasRole('investor')) {
                    return response()->json(['message' => 'User is not an investor'], 400);
                }
            } else {
                // Create a new user and assign investor role
                $user = User::create([
                    'name' => $validated['name'],
                    'type' => 'investor',
                    'email' => $validated['email'],
                ]);
                $user->assignRole('investor');
            }

            // 2️⃣ Ensure investor profile exists
            $investor = Investor::firstOrCreate(
                ['user_id' => $user->id],
                ['name' => $user->name]
            );

            // 3️⃣ Handle invoice upload
            $invoicePath = null;
            if ($request->hasFile('invoice')) {
                $invoicePath = $request->file('invoice')->store('investment_invoices', 'public');
            }

            // 4️⃣ Create investment
            $investment = Investment::create([
                'user_id' => $user->id,
                'investor_id' => $investor->id,
                'investment_type_id' => $validated['type'],
                'tenant_id' => $validated['location'] ?? null,
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
        });
    }

    public function dashboard(Request $request)
    {
        $user = $request->user();

        // 🔎 If Admin → all investments, If Investor → only their investments
        if ($user->hasRole('superadmin')) {
            $investments = Investment::latest()->get();
        } elseif ($user->hasRole('investor')) {
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
            Tenant::select('id', 'name')->orderBy('name')->get()
        );
    }
}