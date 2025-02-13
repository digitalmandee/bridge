<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\BookingInvoice;
use App\Models\Chair;
use App\Models\Invoice;
use App\Models\Room;
use App\Models\User;
use App\Notifications\GeneralNotification;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class BookingController extends Controller
{

    public function createBooking(Request $request)
    {
        try {
            // Validate required fields
            $validated = $request->validate([
                'floor_id' => 'required|integer',
                'bookingdetails' => 'required|string', // Will parse JSON
                'selectedPlan' => 'required|string',   // Will parse JSON
                'selectedChairs' => 'required|string', // Will parse JSON
            ]);

            // Parse JSON fields
            $bookingDetails = json_decode($validated['bookingdetails'], true);
            $selectedPlan = json_decode($validated['selectedPlan'], true);
            $selectedChairs = json_decode($validated['selectedChairs'], true);

            $branchId = auth()->user()->branch->id;

            DB::beginTransaction();

            // Check if user exists or create a new user
            $user = User::where('email', $bookingDetails['email'])->first();
            if (!$user) {
                $type = $bookingDetails['type'] == 'individual' ? 'user' : 'company';
                $user = User::create([
                    'name' => $bookingDetails['name'],
                    'email' => $bookingDetails['email'],
                    'phone_no' => $bookingDetails['phone_no'],
                    'type' => $type,
                    'password' => Hash::make('password'),
                    'created_by_branch_id' => $branchId
                ]);
                $user->assignRole('user');
            }

            $userId = $user->id;

            // Handle profile_image upload
            if ($request->hasFile('profile_image')) {
                $profileImagePath = $request->file('profile_image')->store('profile_images', 'public');
                $user->update(['profile_image' => $profileImagePath]);
            }

            // Handle receipt upload
            $receiptPath = null;
            if ($request->hasFile('receipt')) {
                $receiptPath = $request->file('receipt')->store('invoices', 'public');
            }

            $startDate = Carbon::parse($bookingDetails['start_date']); // Start Date
            $startTime = Carbon::parse($bookingDetails['start_time']); // Start Time

            if ($bookingDetails['duration'] === 'full_day') {
                // Full day package: End time is 24 hours after start time
                $bookingEndTime = $startTime->copy()->addDay();
            } else {
                // Monthly package: Check if start date is within last 5 days of the month
                $monthDays = $startDate->daysInMonth;  // Total days in month
                $lastDayOfMonth = Carbon::create($startDate->year, $startDate->month, $monthDays); // Last day of month
                Log::info($lastDayOfMonth);

                if ($startDate->day >= ($monthDays - 5)) {
                    // If start date is within the last 5 days of the month, extend to the next month's end
                    $nextMonth = $startDate->copy()->addMonth();
                    $bookingEndTime = Carbon::create($nextMonth->year, $nextMonth->month, $nextMonth->daysInMonth);
                } else {
                    // Otherwise, package ends at the end of the current month
                    $bookingEndTime = $lastDayOfMonth;
                }
            }

            // Create booking
            $booking = Booking::create([
                "user_id" => $userId,
                "branch_id" => $branchId,
                "floor_id" => $validated['floor_id'],
                "plan_id" => $selectedPlan['id'],
                "chair_ids" => $selectedChairs,
                "name" => $bookingDetails['name'],
                "phone_no" => $bookingDetails['phone_no'],
                "type" => $bookingDetails['type'],
                "start_date" => $bookingDetails['start_date'],
                "start_time" => $bookingDetails['start_time'],
                "package_end_time" => $bookingEndTime,
                "duration" => $bookingDetails['duration'],
                "time_slot" => $bookingDetails['time_slot'],
                "total_price" => $bookingDetails['total_price'],
                "package_detail" => $bookingDetails['package_detail'],
                "payment_method" => $bookingDetails['payment_method'],
                "plan" => ["id" => $selectedPlan['id'], "name" => $selectedPlan['name'], "price" => $selectedPlan['price']],
                "receipt" => $receiptPath,
            ]);

            $invoice = Invoice::create([
                'branch_id' => $branchId,
                'booking_id' => $booking->id,
                'user_id' => $userId,
                'invoice_type' => $bookingDetails['duration'],
                'due_date' => Carbon::parse($booking->start_date)->addDay()->format('Y-m-d'),
                'amount' => $booking->total_price,
                'payment_type' => $booking->payment_method,
                'paid_month' => Carbon::now()->format('F'),
                'paid_year' => Carbon::now()->year,
                "plan" => ["id" => $selectedPlan['id'], "name" => $selectedPlan['name'], "price" => $selectedPlan['price']],
                'receipt' => $receiptPath,
            ]);

            $admin = auth()->user(); // Get the authenticated admin

            // User Notifications for Booking and Invoice
            $userBookingNotificationData = [
                'title' => "Booking Created - {$admin->branch->name}",
                'message' => "Booking #{$booking->id} has been created.",
                'type' => 'booking',
                'booking_id' => $booking->id,
                'created_by' => $admin->name,
            ];

            $userInvoiceNotificationData = [
                'title' => "Invoice Created - {$admin->branch->name}",
                'message' => "Your invoice #{$invoice->id} for {$invoice->invoice_type} has been created and is due on {$invoice->due_date}.",
                'type' => 'invoice',
                'invoice_id' => $invoice->id,
                'created_by' => $admin->name,
            ];

            // Notify user
            $user->notify(new GeneralNotification($userBookingNotificationData));
            $user->notify(new GeneralNotification($userInvoiceNotificationData));

            // Admin Notifications for Booking and Invoice
            $adminBookingNotificationData = [
                'title' => "New Booking - User: {$user->name}",
                'message' => "Booking #{$booking->id} created by {$admin->name}.",
                'type' => 'booking',
                'booking_id' => $booking->id,
                'created_by' => $admin->name,
            ];

            $adminInvoiceNotificationData = [
                'title' => "Invoice Created - User: {$user->name}",
                'message' => "An invoice (#{$invoice->id}) has been created for User ID {$user->id} in {$admin->branch->name}.",
                'type' => 'invoice',
                'invoice_id' => $invoice->id,
                'created_by' => $admin->name,
            ];

            // Notify admin
            $admin->notify(new GeneralNotification($adminBookingNotificationData));
            $admin->notify(new GeneralNotification($adminInvoiceNotificationData));

            DB::commit();

            return response()->json(['success' => true, 'message' => 'Booking created successfully'], 202);
        } catch (\Throwable $th) {
            Log::info($th->getMessage());
            return response()->json(['success' => false, 'message' => $th->getMessage()], 500);
        }
    }

    public function getBookings()
    {
        try {
            $branchId = auth()->user()->branch->id;

            // Fetch bookings with user and floor relationships
            $bookings = Booking::where('branch_id', $branchId)->with(['user:id,name,email', 'floor:id,name'])->orderBy('created_at', 'desc')->get();

            // Fetch all chairs that are associated with any booking
            $allChairIds = $bookings->pluck('chair_ids')->flatten()->unique()->toArray();
            $chairs = Chair::whereIn('id', $allChairIds)->with(['table:id,table_id,name', 'room:id,name'])->get()->keyBy('id');

            // Format bookings with related chair, table, and room details
            $formattedBookings = $bookings->map(function ($booking) use ($chairs) {
                $chairIds = $booking->chair_ids ?? [];

                return [
                    'id' => $booking->id,
                    'name' => $booking->name,
                    'user' => $booking->user,
                    'floor' => $booking->floor,
                    'plan' => $booking->plan,
                    'chairs' => collect($chairIds)->map(function ($chairId) use ($chairs) {
                        $chair = $chairs[$chairId] ?? null;
                        return $chair ? [
                            'id' => $chair->id,
                            'chair_id' => $chair->chair_id,
                            'table_id' => $chair->table->table_id ?? null,
                            'table_name' => $chair->table->name ?? 'N/A',
                            'room_id' => $chair->room->id ?? null,
                            'room_name' => $chair->room->name ?? 'N/A',
                        ] : null;
                    })->filter()->values(), // Remove null values
                    'start_date' => $booking->start_date,
                    'start_time' => $booking->start_time,
                    'end_date' => $booking->end_date,
                    'end_time' => $booking->end_time,
                    'duration' => $booking->duration,
                    'time_slot' => $booking->time_slot,
                    'package_end_time' => $booking->package_end_time,
                    'total_price' => $booking->total_price,
                    'package_detail' => $booking->package_detail,
                    'payment_method' => $booking->payment_method,
                    'status' => $booking->status,
                ];
            });

            return response()->json(['success' => true, 'message' => 'Bookings retrieved successfully', 'bookings' => $formattedBookings], 200);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'message' => $th->getMessage()], 500);
        }
    }


    public function updateBooking(Request $request)
    {
        try {
            $request->validate([
                'booking_id' => 'required|integer',
                'status' => 'required|string',
                'price' => 'required|numeric',
            ]);

            $admin = auth()->user();

            DB::beginTransaction();

            // Retrieve the booking from the database
            $booking = Booking::findOrFail($request->booking_id);

            // Get all chairs related to this booking

            foreach ($booking->chair_ids as $chairId) {
                $chair = Chair::find($chairId);

                if ($request->status === 'confirmed' && $booking->status !== 'confirmed') {
                    // Prevent duplicate time_slot assignment
                    if ($chair->time_slot === $booking->time_slot) {
                        return response()->json([
                            'success' => false,
                            'message' => "Floor {$booking->floor->name} Chair {$chair->table->name}{$chair->id} is already assigned to same time slot"
                        ], 400);
                    }

                    // Assign the chair's time slot
                    if ($chair->time_slot === 'available') {
                        $chair->time_slot = $booking->time_slot;
                    } elseif (
                        ($chair->time_slot === 'day' && $booking->time_slot === 'night') ||
                        ($chair->time_slot === 'night' && $booking->time_slot === 'day')
                    ) {
                        // If chair already booked for day, and now booked for night → Set to full_day
                        $chair->time_slot = 'full_day';
                    }

                    // Set color based on time_slot
                    $chair->color = $this->getColorBasedOnDuration($chair->time_slot);
                    $chair->save();
                } else if ($request->status === 'vacated' && $booking->status === 'confirmed') {
                    // Handle vacating a booking
                    if ($chair->time_slot === 'full_day') {
                        // If full_day is vacated, check which slot remains
                        if ($booking->time_slot === 'day') {
                            $chair->time_slot = 'night'; // Keep night booking
                            $chair->color = $this->getColorBasedOnDuration('night');
                        } elseif ($booking->time_slot === 'night') {
                            $chair->time_slot = 'day'; // Keep day booking
                            $chair->color = $this->getColorBasedOnDuration('day');
                        } else {
                            $chair->time_slot = 'available'; // Otherwise, chair is fully vacated
                            $chair->color = null;
                        }
                    } else {
                        // If it was only booked for a single slot, free the chair
                        $chair->time_slot = 'available';
                        $chair->color = null;
                    }

                    $chair->save();
                }
            }

            if ($request->status === 'confirmed' && $booking->status !== 'confirmed') {
                $totalChairs = count($booking->chair_ids);
                $user = User::find($booking->user_id);

                $user->update([
                    'booking_quota' => $totalChairs * 20,
                    'total_booking_quota' => $totalChairs * 20,
                    'printing_quota' => $totalChairs * 100,
                    'total_printing_quota' => $totalChairs * 100,
                ]);

                $user->notify(new GeneralNotification([
                    'title' => "Booking Confirmation - {$admin->branch->name}",
                    'message' => "Booking #{$booking->id} has been confirmed.",
                    'type' => 'booking',
                    'booking_id' => $booking->id,
                    'created_by' => auth()->user()->name,
                ]));

                $admin->notify(new GeneralNotification([
                    'title' => "Booking Confirmed - User: {$user->name}",
                    'message' => "Booking #{$booking->id} has been confirmed.",
                    'type' => 'booking',
                    'booking_id' => $booking->id,
                    'created_by' => auth()->user()->name,
                ]));
            }

            // Update booking details
            $booking->update([
                'status' => $request->status,
                'total_price' => $request->price,
                'start_date' => $request->start_date,
                'start_time' => $request->start_time,
                'end_date' => $request->end_date,
                'end_time' => $request->end_time,
            ]);

            DB::commit();

            return response()->json(['success' => true, 'message' => 'Booking and chairs updated successfully'], 200);
        } catch (\Throwable $th) {
            Log::info($th->getMessage());
            return response()->json(['success' => false, 'message' => $th->getMessage()], 500);
        }
    }


    private function getColorBasedOnDuration($duration)
    {
        // Set color based on duration
        switch ($duration) {
            case 'day':
                return '#F59E0B';
            case 'night':
                return '#6366F1';
            case 'full_day':
                return 'green';
            default:
                return 'gray';
        }
    }
}