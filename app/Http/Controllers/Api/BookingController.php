<?php

namespace App\Http\Controllers\Api;

use App\Helpers\FileHelper;
use App\Helpers\MailHelper;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\BookingChair;
use App\Models\BookingPlan;
use App\Models\Chair;
use App\Models\CompanyProfile;
use App\Models\Invoice;
use App\Models\User;
use App\Models\UserAddon;
use App\Models\UserPackage;
use App\Models\UserProfile;
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
                'bookingdetails' => 'required|string',  // Will parse JSON
                'selectedPlan' => 'required|string',  // Will parse JSON
                'selectedChairs' => 'required|string',  // Will parse JSON
            ]);

            // Parse JSON fields
            $bookingDetails = json_decode($validated['bookingdetails'], true);
            $selectedPlan = json_decode($validated['selectedPlan'], true);
            $selectedChairs = json_decode($validated['selectedChairs'], true);

            DB::beginTransaction();
            $kybFilePath = null;

            $type = $bookingDetails['type'] === 'individual' ? 'user' : 'company';

            // Check if CNIC is already in use by another user
            $existingCnicUser = User::where('cnic_number', $bookingDetails['cnic'])->first();

            // Check if user exists by email
            $user = User::where('email', $bookingDetails['email'])->first();

            if (!$user) {
                // Check if CNIC is already used by another user
                if ($existingCnicUser) {
                    DB::rollBack();
                    return response()->json([
                        'success' => false,
                        'message' => 'CNIC number already in use. Please use a different CNIC number.',
                        'error_type' => 'cnic_duplicate'
                    ], 422);
                }

                // New user - create with validated CNIC
                $user = User::create([
                    'name' => $bookingDetails['name'],
                    'email' => $bookingDetails['email'],
                    'password' => Hash::make('password'),
                    'type' => $type,
                    'designation' => $bookingDetails['designation'],
                    'phone_no' => $bookingDetails['phone_no'],
                    'secondary_phone_no' => $bookingDetails['secondary_phone_no'],
                    'cnic_number' => $bookingDetails['cnic'],
                ]);
                $user->assignRole('user');
            } else {
                // User exists - check if trying to update CNIC to one that's already in use by another user
                if ($existingCnicUser && $existingCnicUser->id !== $user->id) {
                    DB::rollBack();
                    return response()->json([
                        'success' => false,
                        'message' => 'CNIC number already in use by another user. Please use a different CNIC number.',
                        'error_type' => 'cnic_duplicate'
                    ], 422);
                }
            }

            if ($request->hasFile('kyb_file')) {
                $kybFilePath = FileHelper::saveImage($request->file('kyb_file'), 'kyb_files');
            }

            // 🔹 Check profile depending on type
            if ($type === 'company') {
                $companyProfileExists = CompanyProfile::where('user_id', $user->id)->exists();

                if (!$companyProfileExists) {
                    // Update user details in case they were incomplete
                    $user->update([
                        'name' => $bookingDetails['name'],
                        'type' => $type,
                        'designation' => $bookingDetails['designation'],
                        'phone_no' => $bookingDetails['phone_no'],
                        'secondary_phone_no' => $bookingDetails['secondary_phone_no'],
                        'cnic_number' => $bookingDetails['cnic'],
                    ]);

                    CompanyProfile::create([
                        'user_id' => $user->id,
                        'name' => $bookingDetails['company_name'] ?? null,
                        'website' => $bookingDetails['company_website'] ?? null,
                        'industry' => $bookingDetails['industry'] ?? null,
                        'employees' => $bookingDetails['employees'] ?? null,
                        'address' => $bookingDetails['company_address'] ?? null,
                        'kyb_file' => $kybFilePath,
                    ]);
                } else if ($kybFilePath) {
                    // Update kyb_file if new file is uploaded
                    CompanyProfile::where('user_id', $user->id)->update(['kyb_file' => $kybFilePath]);
                }
            } else {
                $userProfileExists = UserProfile::where('user_id', $user->id)->exists();

                if (!$userProfileExists) {
                    // Update user details in case they were incomplete
                    $user->update([
                        'name' => $bookingDetails['name'],
                        'type' => $type,
                        'designation' => $bookingDetails['designation'],
                        'phone_no' => $bookingDetails['phone_no'],
                        'secondary_phone_no' => $bookingDetails['secondary_phone_no'],
                        'cnic_number' => $bookingDetails['cnic'],
                    ]);

                    UserProfile::create([
                        'user_id' => $user->id,
                        'linkedin' => $bookingDetails['linkedin'] ?? null,
                        'facebook' => $bookingDetails['facebook'] ?? null,
                        'freelance_site' => $bookingDetails['freelance_site'] ?? null,
                        'kyb_file' => $kybFilePath,
                    ]);
                } else if ($kybFilePath) {
                    // Update kyb_file if new file is uploaded
                    UserProfile::where('user_id', $user->id)->update(['kyb_file' => $kybFilePath]);
                }
            }

            // Handle profile_image upload
            if ($request->hasFile('profile_image')) {
                $profileImagePath = FileHelper::saveImage($request->file('profile_image'), 'profile_images');
                $user->update(['profile_image' => $profileImagePath]);
            }

            if ($request->hasFile('cnic_image')) {
                $profileImagePath = FileHelper::saveImage($request->file('cnic_image'), 'cnics');
                $user->update(['cnic_image' => $profileImagePath]);
            }

            $userId = $user->id;

            // Handle receipt upload
            $receiptPath = null;
            if ($request->hasFile('receipt')) {
                $receiptPath = FileHelper::saveImage($request->file('receipt'), 'invoices');
            }

            // =========================
            // Booking + Invoice Creation
            // =========================

            $startDate = Carbon::parse($bookingDetails['start_date']);  // Start Date
            $startTime = Carbon::parse($bookingDetails['start_time']);  // Start Time

            if ($bookingDetails['duration'] === 'full_day') {
                // Full day package: End time is 24 hours after start time
                $bookingEndTime = $startTime->copy()->addDay();
                $paidMonth = $startDate->format('F');
            } else {
                // Monthly package: Check if start date is within last 5 days of the month
                $monthDays = $startDate->daysInMonth;  // Total days in month
                $lastDayOfMonth = Carbon::create($startDate->year, $startDate->month, $monthDays);  // Last day of month

                if ($startDate->day >= ($monthDays - 5)) {
                    // If start date is within the last 5 days of the month, extend to the next month's end
                    $nextMonth = $startDate->copy()->addMonth();
                    $bookingEndTime = Carbon::create($nextMonth->year, $nextMonth->month, $nextMonth->daysInMonth);
                    $paidMonth = $nextMonth->format('F');
                } else {
                    // Otherwise, package ends at the end of the current month
                    $bookingEndTime = $lastDayOfMonth;
                    $paidMonth = $startDate->format('F');
                }
            }

            $bookingPlan = BookingPlan::select('id', 'name', 'price', 'discount', 'booking_hours', 'printing_papers')->find($selectedPlan['id']);

            // Create booking
            $booking = Booking::create([
                'user_id' => $userId,
                'floor_id' => $validated['floor_id'],
                'plan_id' => $selectedPlan['id'],
                'name' => $bookingDetails['name'],
                'phone_no' => $bookingDetails['phone_no'],
                'type' => $bookingDetails['type'],
                'start_date' => $bookingDetails['start_date'],
                'start_time' => $bookingDetails['start_time'],
                'package_end_time' => $bookingEndTime,
                'duration' => $bookingDetails['duration'],
                'time_slot' => $bookingDetails['time_slot'],
                'total_price' => $bookingDetails['total_price'],
                'package_detail' => $bookingDetails['package_detail'],
                'payment_method' => $bookingDetails['payment_method'],
                'plan' => $bookingPlan->toArray(),
                'receipt' => $receiptPath,
                'description' => $bookingDetails['description'],
            ]);

            // ✅ Save booking chairs in new table
            if (!empty($selectedChairs)) {
                foreach ($selectedChairs as $chairId) {
                    BookingChair::create([
                        'booking_id' => $booking->id,
                        'chair_id' => $chairId,
                        'name' => 'Chair ' . $chairId,  // optional, if you need name
                    ]);
                }
            }

            $invoice = Invoice::create([
                'booking_id' => $booking->id,
                'user_id' => $userId,
                'invoice_type' => $bookingDetails['duration'],
                'due_date' => Carbon::parse($booking->start_date)->addDay()->format('Y-m-d'),
                'discount' => $bookingPlan['discount'],
                'amount' => $booking->total_price,
                'payment_type' => $booking->payment_method,
                'paid_month' => [$paidMonth],
                'paid_year' => Carbon::now()->year,
                'plan' => ['id' => $selectedPlan['id'], 'name' => $selectedPlan['name'], 'price' => $selectedPlan['price']],
                'receipt' => $receiptPath,
            ]);

            // send seat booking email
            MailHelper::sendBookingMail($user->email, [
                'user_id' => $userId,
                'client' => $user,
            ]);

            $admin = User::find(1);  // Get the authenticated admin

            // User Notifications for Booking and Invoice
            $userBookingNotificationData = [
                'title' => 'Booking Created - ' . tenant('name'),
                'message' => "Booking #{$booking->id} has been created.",
                'type' => 'booking',
                'booking_id' => $booking->id,
                'created_by' => $admin->name,
            ];

            $userInvoiceNotificationData = [
                'title' => 'Invoice Created - ' . tenant('name'),
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
                'message' => "An invoice (#{$invoice->id}) has been created for User ID {$user->id} in " . tenant('name') . '.',
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

    public function getBookings(Request $request)
    {
        try {
            $perPage = $request->query('limit', 10);

            $query = Booking::with([
                'user:id,name,email',
                'floor:id,name',
                'bookingChairs.chair.table:id,table_id,name',
                'bookingChairs.chair.room:id,name',
            ]);

            // ✅ Search by booking ID or name
            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    if (is_numeric($search)) {
                        $q->where('id', $search);  // search by booking ID
                    }
                    $q->orWhere('name', 'like', '%' . $search . '%');  // search by name
                });
            }

            // ✅ Filter by start date and end date
            if ($request->filled('start_date') && $request->filled('end_date')) {
                $query->whereBetween('start_date', [$request->start_date, $request->end_date]);
            }

            // ✅ Filter by status
            if ($request->filled('status')) {
                $query->where('status', $request->status);
            }

            // ✅ Filter by floor
            if ($request->filled('floor')) {
                $query->where('floor_id', $request->floor);
            }

            // ✅ Order by latest
            $bookings = $query->orderBy('created_at', 'desc')->paginate($perPage);

            // 🔹 Format bookings response
            $formattedBookings = $bookings->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'name' => $booking->name,
                    'user' => $booking->user,
                    'floor' => $booking->floor,
                    'plan' => $booking->plan,
                    'chairs' => $booking->bookingChairs->map(function ($bc) {
                        $chair = $bc->chair;
                        return $chair ? [
                            'id' => $chair->id,
                            'chair_id' => $chair->chair_id,
                            'table_id' => $chair->table->table_id ?? null,
                            'table_name' => $chair->table->name ?? 'N/A',
                            'room_id' => $chair->room->id ?? null,
                            'room_name' => $chair->room->name ?? 'N/A',
                        ] : null;
                    })->filter()->values(),
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

            return response()->json([
                'success' => true,
                'message' => 'Bookings retrieved successfully',
                'bookings' => [
                    'data' => $formattedBookings,
                    'current_page' => $bookings->currentPage(),
                    'last_page' => $bookings->lastPage(),
                    'per_page' => $bookings->perPage(),
                    'total' => $bookings->total(),
                    'next_page_url' => $bookings->nextPageUrl(),
                    'prev_page_url' => $bookings->previousPageUrl(),
                ]
            ], 200);
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

            $admin = User::find(1);
            $booking = Booking::findOrFail($request->booking_id);
            $oldStatus = $booking->status;
            $newStatus = $request->status;

            DB::beginTransaction();

            $user = User::find($booking->user_id);

            // === Confirm Booking ===
            if ($newStatus === 'confirmed' && $oldStatus !== 'confirmed') {
                $totalChairs = $booking->bookingChairs()->count();

                if ($booking->duration == 'monthly') {
                    // Create UserPackage
                    $userPackage = UserPackage::create([
                        'user_id' => $user->id,
                        'booking_plan_id' => $booking->plan_id,
                        'valid_from' => Carbon::parse($booking->start_date),
                        'valid_to' => Carbon::parse($booking->package_end_time),
                        'status' => 'active',
                        'created_by' => $admin->id,
                    ]);

                    // Attach package to booking
                    $booking->user_package_id = $userPackage->id;
                    $booking->save();

                    // Create Addons (booking hours)
                    UserAddon::create([
                        'user_package_id' => $userPackage->id,
                        'user_id' => $user->id,
                        'addon_type' => 'booking_hours',
                        'total' => $totalChairs * $booking->plan['booking_hours'],
                        'remaining' => $totalChairs * $booking->plan['booking_hours'],
                        'price' => 0,
                        'purchased_at' => Carbon::now(),
                        'created_by' => $admin->id,
                    ]);

                    // Create Addons (printing papers)
                    UserAddon::create([
                        'user_package_id' => $userPackage->id,
                        'user_id' => $user->id,
                        'addon_type' => 'printing_papers',
                        'total' => $totalChairs * $booking->plan['printing_papers'],
                        'remaining' => $totalChairs * $booking->plan['printing_papers'],
                        'price' => 0,
                        'purchased_at' => Carbon::now(),
                        'created_by' => $admin->id,
                    ]);
                }

                // Notifications
                $user->notify(new GeneralNotification([
                    'title' => 'Booking Confirmation - ' . tenant('name'),
                    'message' => "Booking #{$booking->id} has been confirmed.",
                    'type' => 'booking',
                    'booking_id' => $booking->id,
                    'created_by' => $admin->name,
                ]));

                $admin->notify(new GeneralNotification([
                    'title' => "Booking Confirmed - User: {$user->name}",
                    'message' => "Booking #{$booking->id} has been confirmed.",
                    'type' => 'booking',
                    'booking_id' => $booking->id,
                    'created_by' => $admin->name,
                ]));
            }

            // === Update booking main fields ===
            $booking->update([
                'status' => $newStatus,
                'total_price' => $request->price,
                'start_date' => $request->start_date,
                'start_time' => $request->start_time,
                'end_date' => $request->end_date,
                'end_time' => $request->end_time,
            ]);

            // === Expire Package if Booking Cancelled/Vacated ===
            if (in_array($newStatus, ['vacated', 'rejected', 'cancelled'])) {
                if ($booking->user_package_id) {
                    $userPackage = UserPackage::find($booking->user_package_id);
                    if ($userPackage) {
                        $userPackage->status = 'expired';
                        $userPackage->save();
                    }
                }

                // Check if user still has any other active confirmed booking
                $activeBookings = Booking::where('user_id', $user->id)
                    ->where('status', 'confirmed')
                    ->exists();

                if (!$activeBookings) {
                    $user->status = 'inactive';
                    $user->save();
                } else {
                    $user->status = 'active';
                    $user->save();
                }
            }

            DB::commit();

            return response()->json(['success' => true, 'message' => 'Booking updated successfully'], 200);
        } catch (\Throwable $th) {
            DB::rollBack();
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
