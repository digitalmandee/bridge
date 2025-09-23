<?php

namespace App\Http\Controllers\Api;

use App\Helpers\FileHelper;
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
            $contracts = Contract::with('user:id,name,email,type')->latest()->paginate($limit);
        } else {
            $contracts = Contract::where('user_id', $user->id)->with('user:id,name,email,type')->latest()->paginate($limit);
        }

        return response()->json(['success' => true, 'contracts' => $contracts]);
    }

    public function create(Request $request)
    {
        $request->validate([
            'user_id' => 'required|numeric',
            'type' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'notice_period' => 'required|numeric',
            'duration' => 'required|in:week,month',
            'plan' => 'required',
            'amount' => 'required|numeric',
            'contract' => 'required|string',
            'agreement' => 'required|boolean',
            'documents.*' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',  // each file optional
        ]);

        if (Contract::where('user_id', $request->user_id)->where('status', 'not signed')->exists()) {
            return response()->json(['success' => false, 'message' => 'A contract is already in progress for this user'], 400);
        }

        $signedContractsQuery = Contract::where('user_id', $request->user_id)
            ->where('status', 'signed')
            ->where(function ($query) use ($request) {
                $query->where(function ($q) use ($request) {
                    $q
                        ->whereBetween('start_date', [$request->start_date, $request->end_date ?? $request->start_date])
                        ->orWhereBetween('end_date', [$request->start_date, $request->end_date ?? $request->start_date]);
                })->orWhere(function ($q) use ($request) {
                    $q
                        ->where('start_date', '<=', $request->start_date)
                        ->where('end_date', '>=', $request->end_date ?? $request->start_date);
                });
            });

        if ($signedContractsQuery->exists()) {
            return response()->json(['success' => false, 'message' => 'A signed contract already exists within this period'], 400);
        }

        $contract = Contract::create([
            'user_id' => $request->user_id,
            'plan_id' => $request->plan['id'],
            'type' => $request->type,
            'company_number' => $request->company_number,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'notice_period' => $request->notice_period,
            'duration' => $request->duration,
            'plan' => $request->plan,
            'amount' => $request->amount,
            'contract' => $request->contract,
            'agreement' => $request->agreement
        ]);

        if ($request->hasFile('documents')) {
            $paths = [];
            foreach ($request->file('documents') as $file) {
                $paths[] = FileHelper::saveImage($file, 'contracts');
            }

            $contract->update([
                'documents' => $paths,
            ]);
        }

        return response()->json(['success' => true, 'contract' => $contract]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'contractId' => 'required|numeric',
            'type' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'notice_period' => 'required|numeric',
            'duration' => 'required|in:week,month',
            'plan' => 'required',
            'amount' => 'required|numeric',
            'contract' => 'required|string',
            'agreement' => 'required|boolean',
        ]);

        $contract = Contract::find($request->contractId);

        if ($contract) {
            $oldDocs = $contract->documents ?? [];
            $documentPaths = [];

            // ✅ Always cast request documents to array
            $requestDocs = (array) ($request->documents ?? []);

            foreach ($requestDocs as $doc) {
                if ($doc instanceof \Illuminate\Http\UploadedFile) {
                    $documentPaths[] = FileHelper::saveImage($doc, 'contracts');
                } elseif (!empty($doc)) {
                    $documentPaths[] = $doc;  // keep old path
                }
            }

            // Find & delete removed docs
            $deleted = array_diff($oldDocs, $documentPaths);
            foreach ($deleted as $docPath) {
                $absolutePath = public_path(ltrim($docPath, '/'));
                if (file_exists($absolutePath)) {
                    @unlink($absolutePath);
                }
            }

            $updateData = [
                'plan_id' => $request->plan['id'],
                'type' => $request->type,
                'company_number' => $request->company_number,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'notice_period' => $request->notice_period,
                'duration' => $request->duration,
                'plan' => $request->plan,
                'amount' => $request->amount,
                'contract' => $request->contract,
                'agreement' => $request->agreement,
                'documents' => $documentPaths
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
