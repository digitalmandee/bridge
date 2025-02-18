<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ContractController extends Controller
{
    public function index(Request $request)
    {
        $limit = $request->query('limit') ?? 10;
        $user = auth()->user();
        if ($user->type == 'admin') {
            $branchId = auth()->user()->branch->id;

            $contracts = Contract::where('branch_id', $branchId)->with('user:id,name,email,type', 'branch:id,name')->latest()->paginate($limit);
        } else {
            $contracts = Contract::where('user_id', $user->id)->with('user:id,name,email,type', 'branch:id,name')->latest()->paginate($limit);
        }

        return response()->json(['success' => true, 'contracts' => $contracts]);
    }
    public function create(Request $request)
    {
        $request->validate([
            'user_id' => 'required|numeric',
            'type' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'notice_period' => 'required|numeric',
            'duration' => 'required|in:week,month',
            'plan' => 'required|array',
            'plan_start_date' => 'required|date',
            'plan_end_date' => 'nullable|date|after:plan_start_date',
            'amount' => 'required|numeric',
            'contract' => 'required|string',
            'agreement' => 'required|boolean',
        ]);

        if (Contract::where('user_id', $request->user_id)->where('status', 'not signed')->exists()) {
            return response()->json(['success' => false, 'message' => 'A contract is already in progress for this user'], 400);
        }

        if (Contract::where('user_id', $request->user_id)->where('status', 'signed')->where(function ($query) use ($request) {
            $query->whereBetween('start_date', [$request->start_date, $request->end_date])
                ->orWhereBetween('end_date', [$request->start_date, $request->end_date])
                ->orWhere(function ($q) use ($request) {
                    $q->where('start_date', '<=', $request->start_date)
                        ->where('end_date', '>=', $request->end_date);
                });
        })->exists()) {
            return response()->json(['success' => false, 'message' => 'A signed contract already exists within this period'], 400);
        }



        $branchId = auth()->user()->branch->id;

        $contract = Contract::create([
            'branch_id' => $branchId,
            'user_id' => $request->user_id,
            'plan_id' => $request->plan['id'],
            'type' => $request->type,
            'company_number' => $request->company_number,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'notice_period' => $request->notice_period,
            'duration' => $request->duration,
            'plan' => $request->plan,
            'plan_start_date' => $request->plan_start_date,
            'plan_end_date' => $request->plan_end_date,
            'amount' => $request->amount,
            'contract' => $request->contract,
            'agreement' => $request->agreement
        ]);

        return response()->json(['success' => true, 'contract' => $contract]);
    }
    public function update(Request $request)
    {
        $request->validate([
            'contractId' => 'required|numeric',
            'type' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'notice_period' => 'required|numeric',
            'duration' => 'required|in:week,month',
            'plan' => 'required|array',
            'plan_start_date' => 'required|date',
            'plan_end_date' => 'nullable|date|after:plan_start_date',
            'amount' => 'required|numeric',
            'contract' => 'required|string',
            'agreement' => 'required|boolean',
        ]);

        $contract = Contract::find($request->contractId);

        if ($contract) {
            $updateData = [
                'plan_id' => $request->plan['id'],
                'type' => $request->type,
                'company_number' => $request->company_number,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'notice_period' => $request->notice_period,
                'duration' => $request->duration,
                'plan' => $request->plan,
                'plan_start_date' => $request->plan_start_date,
                'plan_end_date' => $request->plan_end_date,
                'amount' => $request->amount,
                'contract' => $request->contract,
                'agreement' => $request->agreement,
            ];

            if ($request->has('status') && !empty($request->status)) {
                $updateData['status'] = $request->status;
            }

            $contract->update($updateData);
        }

        return response()->json(['success' => true, 'contract' => $contract]);
    }

    public function UserUpdate(Request $request)
    {

        $contract = Contract::find($request->contractId);

        if ($contract) {
            $updateData = [
                'signature' => $request->signature
            ];

            if ($request->has('signature')) {
                $updateData['status'] = 'signed';
            }

            $contract->update($updateData);
        }

        return response()->json(['success' => true, 'contract' => $contract]);
    }
}