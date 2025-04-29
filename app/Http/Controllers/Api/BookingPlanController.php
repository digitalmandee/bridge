<?php

namespace App\Http\Controllers\Api;

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
    public function index(Request $request)
    {
        try {
            $bookingPlans = BookingPlan::select('id', 'name', 'type', 'price', 'discount', 'booking_hours', 'printing_papers')->get();

            return response()->json(['success' => true, 'message' => 'Booking Plans retrieved successfully', 'data' => $bookingPlans], 200);
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
            'name' => 'required|string',
            'type' => 'required|string',
            'price' => 'required|numeric',
            'discount' => 'nullable|numeric',
            'booking_hours' => 'required_if:type,monthly|numeric',
            'printing_papers' => 'required_if:type,monthly|numeric',
        ]);
        // Set booking_hours and printing_papers to 0 if type is 'full_day'
        if ($validated['type'] === 'full_day') {
            $validated['booking_hours'] = 0;
            $validated['printing_papers'] = 0;
        }

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
            'name' => 'required|string',
            'type' => 'required|string',
            'price' => 'required|numeric',
            'booking_hours' => 'required_if:type,monthly|numeric',
            'printing_papers' => 'required_if:type,monthly|numeric',
        ]);

        // Set booking_hours and printing_papers to 0 if type is 'full_day'
        if ($validated['type'] === 'full_day') {
            $validated['booking_hours'] = 0;
            $validated['printing_papers'] = 0;
        }

        try {
            $bookingPlan = BookingPlan::findOrFail($id);
            $bookingPlan->update($validated);

            return response()->json(['success' => true, 'message' => 'Booking Plan updated successfully', 'data' => $bookingPlan], 200);
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
