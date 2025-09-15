<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InvestmentType;
use Illuminate\Http\Request;

class InvestmentTypeController extends Controller
{
    public function index(Request $request)
    {
        $per_page = $request->query('limit', 10);
        $investmentTypes = InvestmentType::paginate($per_page);

        return response()->json([
            'success' => true,
            'message' => 'Investment types retrieved successfully',
            'investmentTypes' => $investmentTypes
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string'
        ]);

        $investmentType = InvestmentType::create($validatedData);

        return response()->json([
            'success' => true,
            'message' => 'Investment type created successfully',
            'data' => $investmentType
        ]);
    }

    public function edit(string $id)
    {
        $investmentType = InvestmentType::findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Investment type retrieved successfully',
            'data' => $investmentType
        ]);
    }

    public function update(Request $request, string $id)
    {
        $validatedData = $request->validate([
            'name' => 'required|string'
        ]);

        $investmentType = InvestmentType::findOrFail($id);
        $investmentType->update($validatedData);

        return response()->json([
            'success' => true,
            'message' => 'Investment type updated successfully',
            'data' => $investmentType
        ]);
    }

    public function destroy(string $id)
    {
        $investmentType = InvestmentType::findOrFail($id);
        $investmentType->delete();

        return response()->json([
            'success' => true,
            'message' => 'Investment type deleted successfully'
        ]);
    }
}