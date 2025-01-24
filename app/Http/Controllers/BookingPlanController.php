<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\BookingPlan;
use App\Models\Room;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class BookingPlanController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function createBooking(Request $request)
    {
        try {
            $validated = $request->validate([
                'branch_id' => 'required|integer',
                'floor_id' => 'required|integer',
                'selectedChairs' => 'required|array',
                'name' => 'required|string',
                'email' => 'required|email',
                'phone_no' => 'required|string',
                'type' => 'required|string',
                'duration' => 'required|string',
                'start_date' => 'required|string',
                'start_time' => 'required|string',
                'total_price' => 'required',
                'selectedPlan' => 'required|array',
            ]);

            $type = $validated['type'] == 'individual' ? 'user' : 'company';
            $user = User::where('email', $validated['email'])->first();

            if (!$user) {
                $user = User::create([
                    'name' => $validated['name'],
                    'email' => $validated['email'],
                    'type' => $type,
                    'role' => $type == 'user' ? 1 : 1,
                    'password' => Hash::make('bridge@123'),
                ]);
            }

            $userId = $user->id;

            $filePath = null;
            if ($request->hasFile('receipt')) {
                $filePath = $request->file('receipt')->store('receipts', 'public');
            }

            Booking::create([
                "user_id" => $userId,
                "branch_id" => $validated['branch_id'],
                "floor_id" => $validated['floor_id'],
                "plan_id" => $validated['selectedPlan']['id'],
                "chairs" => $validated['selectedChairs'],
                "name" => $validated['name'],
                "phone_no" => $validated['phone_no'],
                "type" => $validated['type'],
                "duration" => $validated['duration'],
                "start_date" => $validated['start_date'],
                "start_time" => $validated['start_time'],
                "total_price" => $validated['total_price'],
                "plan" => $validated['selectedPlan'],
                "receipt" => $filePath,
            ]);

            return response()->json(['success' => true, 'message' => 'Booking created successfully'], 202);
        } catch (\Throwable $th) {
            // Log::info($th->getMessage());
            return response()->json(['success' => false, 'message' => $th->getMessage()], 500);
            //throw $th;
        }
    }
    public function index(Request $request)
    {
        try {
            $branchId = $request->branch_id;

            if (!$branchId) return response()->json(['message' => 'Branch ID parameter is required'], 400);

            $bookingPlans = BookingPlan::where('branch_id', $branchId)->get();

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
            'branch_id' => 'required|integer',
            'name' => 'required|string',
            'type' => 'required|string',
            'price' => 'required|numeric',
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
            'name' => 'required|string',
            'type' => 'required|string',
            'price' => 'required|numeric',
            'location' => 'required|string',
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