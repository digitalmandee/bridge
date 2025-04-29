<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InvoiceType;
use Illuminate\Http\Request;

class InvoiceTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        try {
            $type = $request->query('type', 'list');
            $query = $request->query('query');

            if ($type == 'search') {
                $invoiceTypes = InvoiceType::select('id', 'name')->get();

                return response()->json(['success' => true, 'results' => $invoiceTypes], 200);
            } else {
                $limit = $request->query('limit') ?? 10;

                $invoiceTypes = InvoiceType::select('id', 'name')->paginate($limit);
                return response()->json(['success' => true, 'message' => 'Invoice Types retrieved successfully', 'invoice_types' => $invoiceTypes], 200);
            }
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'message' => $th->getMessage()], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:invoice_types',
        ]);

        try {
            $invoiceType = InvoiceType::create([
                'name' => $request->name,
            ]);

            return response()->json(['success' => true, 'message' => 'Invoice Type created successfully', 'invoice_type' => $invoiceType], 200);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'message' => $th->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $invoiceType = InvoiceType::find($id);

        return response()->json(['success' => true, 'message' => 'Invoice Type retrieved successfully', 'invoice_type' => $invoiceType], 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string',
        ]);

        try {
            $invoiceType = InvoiceType::find($id);
            $invoiceType->update([
                'name' => $request->name,
            ]);

            return response()->json(['success' => true, 'message' => 'Invoice Type updated successfully', 'invoice_type' => $invoiceType], 200);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'message' => $th->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            $invoiceType = InvoiceType::find($id);
            $invoiceType->delete();

            return response()->json(['success' => true, 'message' => 'Invoice Type deleted successfully'], 200);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'message' => $th->getMessage()], 500);
        }
    }
}
