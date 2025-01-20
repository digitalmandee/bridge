<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\BookingPlan;
use Illuminate\Http\Request;

class BookingPlanController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $bookingPlans = BookingPlan::all();

            return response()->json([
                'success' => true,
                'message' => 'Booking Plans retrieved successfully',
                'data' => $bookingPlans,
            ], 200);
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
        $validated = $request->validate([
            'plan_name' => 'required|string',
            'plan_price' => 'required|numeric',
        ]);
        try {
            // Create a new booking plan
            BookingPlan::firstOrCreate($validated);

            return response()->json(['success' => true, 'message' => 'Booking Plan created successfully'], 201);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'message' => $th->getMessage()], 500);
        }
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
        $validated = $request->validate([
            'plan_name' => 'required|string',
            'plan_price' => 'required|numeric',
        ]);

        try {
            $bookingPlan = BookingPlan::findOrFail($id);
            $bookingPlan->update($validated);

            return response()->json(['success' => true, 'message' => 'Booking Plan updated successfully'], 200);
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
            $bookingPlan = BookingPlan::find($id);
            if (!$bookingPlan) {
                return response()->json(['success' => false, 'message' => 'Booking Plan not found'], 500);
            }
            $bookingPlan->delete();

            return response()->json(['success' => true, 'message' => 'Booking Plan deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}