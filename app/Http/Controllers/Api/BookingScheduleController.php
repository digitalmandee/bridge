<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BookingSchedule;
use App\Models\ScheduleFloor;
use App\Models\ScheduleRoom;
use App\Models\User;
use App\Models\UserAddon;
use App\Notifications\GeneralNotification;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class BookingScheduleController extends Controller
{
    public function index()
    {
        // Retrieve all booking schedules
        $bookingSchedules = BookingSchedule::all();
        return response()->json(['success' => true, 'schedules' => $bookingSchedules], 200);
    }

    public function create(Request $request)
    {
        $request->validate([
            'location_id' => 'required|integer',
            'room_id' => 'required|integer',
            'title' => 'required|string',
            'startTime' => 'required|date',
            'endTime' => 'required|date|after:startTime',
            'date' => 'required|date',
            'persons' => 'required|integer',
        ]);

        $LoggedInUser = auth()->user();

        if ($LoggedInUser->type === 'admin') {
            $request->validate([
                'user_id' => 'required|integer',
            ]);
        } else {
            $request->merge(['user_id' => $LoggedInUser->id]);
        }

        try {
            $startTime = Carbon::parse($request->startTime)->setTimezone('Asia/Karachi');
            $endTime = Carbon::parse($request->endTime)->setTimezone('Asia/Karachi');
            $date = Carbon::parse($request->date)->setTimezone('Asia/Karachi');

            // Check room overlap
            $overlap = $this->checkBookingAvailability($request->room_id, $startTime, $endTime);
            if ($overlap) {
                return response()->json([
                    'success' => false,
                    'already_exist' => 'The room is already booked during the selected time range.'
                ], 409);
            }

            DB::beginTransaction();

            $user = User::findOrFail($request->user_id);
            $quotaDecrement = $this->checkBookingHours($startTime, $endTime);

            $today = now()->startOfDay();

            // 1️⃣ Collect active + valid package addons
            $packageAddons = UserAddon::whereIn(
                'user_package_id',
                $user
                    ->packages()
                    ->where('status', 'active')
                    ->where('valid_from', '<=', $today)
                    ->where('valid_to', '>=', $today)
                    ->pluck('id')
            )
                ->where('addon_type', 'booking_hours')
                ->where('remaining', '>', 0)
                ->lockForUpdate()
                ->get();

            // 2️⃣ Collect standalone addons
            $standaloneAddons = $user
                ->addons()
                ->whereNull('user_package_id')
                ->where('addon_type', 'booking_hours')
                ->where('remaining', '>', 0)
                ->lockForUpdate()
                ->get();

            // 3️⃣ Merge
            $addons = $packageAddons->concat($standaloneAddons);

            if ($addons->isEmpty()) {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'user_limit_error' => 'User has no booking hours remaining.'
                ], 403);
            }

            // 4️⃣ Check unlimited
            if (!$addons->contains(fn($addon) => $addon->total == -1)) {
                $totalRemaining = $addons->sum('remaining');
                if ($totalRemaining < $quotaDecrement) {
                    DB::rollBack();
                    return response()->json([
                        'success' => false,
                        'user_limit_error' => 'User has insufficient booking hours remaining.'
                    ], 403);
                }

                // 5️⃣ Deduct
                $hoursToDeduct = $quotaDecrement;
                foreach ($addons as $addon) {
                    if ($hoursToDeduct <= 0)
                        break;

                    $deduct = min($addon->remaining, $hoursToDeduct);
                    if ($deduct > 0) {
                        $addon->decrement('remaining', $deduct);
                        $hoursToDeduct -= $deduct;
                    }
                }
            }

            // ---- Create the booking ----
            $booking = BookingSchedule::create([
                'user_id' => $user->id,
                'company_id' => $user->company_id ?? null,
                'schedule_floor_id' => $request->location_id,
                'schedule_room_id' => $request->room_id,
                'title' => $request->title,
                'startTime' => $startTime,
                'endTime' => $endTime,
                'date' => $date,
                'persons' => $request->persons,
            ]);

            $room = ScheduleRoom::find($request->room_id);
            $roomName = $room ? $room->name : 'Unknown Room';

            $admin = User::find(1);

            if ($LoggedInUser->type === 'admin') {
                $user->notify(new GeneralNotification([
                    'title' => 'Booking Created - ' . tenant('name'),
                    'message' => "Booking #{$booking->event_id} for Meeting Room {$roomName} has been created.",
                    'type' => 'booking_schedule',
                    'booking_id' => $booking->event_id,
                ]));

                $admin->notify(new GeneralNotification([
                    'title' => "New Booking - User: {$user->name}",
                    'message' => "Booking #{$booking->event_id} for Meeting Room {$roomName} created by {$LoggedInUser->name}.",
                    'type' => 'booking_schedule',
                    'booking_id' => $booking->event_id,
                    'created_by' => $LoggedInUser->name,
                ]));
            } else {
                $admin->notify(new GeneralNotification([
                    'title' => "New Booking - User: {$LoggedInUser->name}",
                    'message' => "Booking #{$booking->event_id} for Meeting Room {$roomName} created by {$LoggedInUser->name}.",
                    'type' => 'booking_schedule',
                    'booking_id' => $booking->event_id,
                    'created_by' => $LoggedInUser->name,
                ]));
            }

            DB::commit();

            return response()->json(['success' => true, 'message' => 'Booking created successfully'], 201);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $th->getMessage()], 500);
        }
    }

    private function checkBookingAvailability($roomId, $startTime, $endTime)
    {
        return BookingSchedule::where('schedule_room_id', $roomId)
            ->where('status', 'approved')
            ->where(function ($query) use ($startTime, $endTime) {
                $query->where(function ($query) use ($startTime, $endTime) {
                    // Check for overlapping schedules
                    $query
                        ->where('startTime', '<', $endTime)
                        ->where('endTime', '>', $startTime);
                });
            })
            ->exists();
    }

    public function filter(Request $request)
    {
        $locationId = $request->get('location_id');
        $roomId = $request->get('room_id');
        $timestamp = $request->get('date');  // Get the timestamp from the request
        $view = $request->get('view', 'day');  // View type (day, week, month)

        $user = auth()->user();

        // Parse the timestamp to a Carbon instance if provided
        $date = $timestamp ? Carbon::parse($timestamp)->setTimezone('Asia/Karachi') : null;

        // Fetch all branches if no branch and room ID are provided
        if (empty($locationId) && empty($roomId)) {
            $locations = ScheduleFloor::select('id', 'name')->get();
            return response()->json(['success' => true, 'locations' => $locations], 200);
        }

        // Fetch branch with floors and rooms if only branch ID is provided
        if (!empty($locationId) && empty($roomId)) {
            $floors = ScheduleRoom::where('schedule_floor_id', $locationId)->select('id', 'name')->get();
            return response()->json(['success' => true, 'location_id' => $locationId, 'rooms' => $floors], 200);
        }

        // Fetch booking schedules based on branch ID, room ID, and apply filters based on view
        if (!empty($locationId) && !empty($roomId)) {
            $query = BookingSchedule::where('schedule_room_id', $roomId)->where('status', 'approved');

            // Apply date filter based on view
            if (!empty($date)) {
                if ($view === 'day') {
                    $query->whereDate('date', '=', $date->toDateString());
                } elseif ($view === 'week') {
                    // Set the week to start on Sunday and end on Saturday
                    $startOfWeek = $date->copy()->startOfWeek(Carbon::SUNDAY);
                    $endOfWeek = $date->copy()->endOfWeek(Carbon::SATURDAY);
                    $query->whereBetween('date', [$startOfWeek, $endOfWeek]);
                } elseif ($view === 'month') {
                    $startOfMonth = $date->copy()->startOfMonth();  // First day of the month
                    $endOfMonth = $date->copy()->endOfMonth();  // Last day of the month
                    $query->whereBetween('date', [$startOfMonth, $endOfMonth]);
                }
            }

            if ($user->type === 'admin') {
                // Admins get full booking schedule details
                $bookingSchedules = $query->with(['room:id,name', 'floor:id,name', 'user:id,name,email'])->get()->makeHidden(['created_at', 'updated_at']);
            } else {
                $bookingSchedules = $query->with(['room:id,name', 'floor:id,name', 'user:id,name,email'])->get()->makeHidden(['created_at', 'updated_at'])->map(function ($schedule) use ($user) {
                    // Hide timestamps for relationships
                    if ($schedule->user_id === $user->id) {
                        return $schedule;  // Full details for own bookings
                    }

                    // Limited details for other users
                    return [
                        'event_id' => $schedule->event_id,
                        'startTime' => $schedule->startTime,
                        'endTime' => $schedule->endTime,
                        'date' => $schedule->date,
                    ];
                });
            }

            return response()->json(['success' => true, 'location_id' => $locationId, 'room_id' => $roomId, 'schedules' => $bookingSchedules], 200);
        }

        return response()->json(['success' => false, 'message' => 'Invalid parameters'], 400);
    }

    public function search(Request $request)
    {
        $query = $request->query('query');
        if (empty($query)) {
            return response()->json(['success' => false, 'message' => 'Query parameter is required'], 400);
        }
        $user = auth()->user();

        if ($user->type === 'user') {
            $employees = BookingSchedule::where('user_id', $user->id)->where('title', 'like', "%$query%")->orderBy('created_at', 'desc')->with(['room:id,name', 'floor:id,name', 'user:id,name,email'])->get();
            return response()->json(['success' => true, 'results' => $employees], 200);
        } else {
            return response()->json(['success' => false, 'message' => 'Invalid user'], 400);
        }
    }

    public function getAvailabilityRooms()
    {
        // Fetch floors with rooms, selecting only 'id' and 'name' for rooms
        $floors = ScheduleFloor::select('id', 'name')  // Select only id and name for floors
            ->with(['rooms' => function ($query) {
                $query->select('id', 'name', 'schedule_floor_id');
            }])
            ->get();

        return response()->json(['success' => true, 'floors' => $floors], 200);
    }

    public function getRequests()
    {
        $user = auth()->user();
        if ($user->type === 'user') {
            $bookingSchedules = BookingSchedule::where('user_id', $user->id)->orderBy('created_at', 'desc')->with(['room:id,name', 'floor:id,name', 'user:id,name,email'])->get();
        } else if ($user->type === 'admin') {
            {
                $bookingSchedules = BookingSchedule::orderBy('created_at', 'desc')->with(['room:id,name', 'floor:id,name', 'user:id,name,email'])->get();
            }
        } else if ($user->type === 'company') {
            $bookingSchedules = BookingSchedule::where('company_id', $user->id)->orderBy('created_at', 'desc')->with(['room:id,name', 'floor:id,name', 'user:id,name,email'])->get();
        }

        return response()->json(['success' => true, 'schedules' => $bookingSchedules], 200);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'booking_id' => 'required|integer',
            'status' => 'required|string',
        ]);

        try {
            DB::beginTransaction();

            $booking = BookingSchedule::findOrFail($validated['booking_id']);
            $oldStatus = $booking->status;
            $user = User::findOrFail($booking->user_id);
            $today = now()->startOfDay();

            // --- Deduct hours if booking moves from rejected → pending or rejected → approved ---
            if ($oldStatus === 'rejected' && in_array($validated['status'], ['pending', 'approved'])) {
                $quotaDecrement = $this->checkBookingHours($booking->startTime, $booking->endTime);

                // 1️⃣ Collect active + valid package addons
                $packageAddons = UserAddon::whereIn(
                    'user_package_id',
                    $user
                        ->packages()
                        ->where('status', 'active')
                        ->where('valid_from', '<=', $today)
                        ->where('valid_to', '>=', $today)
                        ->pluck('id')
                )
                    ->where('addon_type', 'booking_hours')
                    ->where('remaining', '>', 0)
                    ->lockForUpdate()
                    ->get();

                // 2️⃣ Collect standalone addons
                $standaloneAddons = $user
                    ->addons()
                    ->whereNull('user_package_id')
                    ->where('addon_type', 'booking_hours')
                    ->where('remaining', '>', 0)
                    ->lockForUpdate()
                    ->get();

                // 3️⃣ Merge
                $addons = $packageAddons->concat($standaloneAddons);

                if ($addons->isEmpty()) {
                    DB::rollBack();
                    return response()->json([
                        'success' => false,
                        'user_limit_error' => 'User has no booking hours remaining.'
                    ], 403);
                }

                // 4️⃣ Check unlimited
                if (!$addons->contains(fn($addon) => $addon->total == -1)) {
                    $totalRemaining = $addons->sum('remaining');
                    if ($totalRemaining < $quotaDecrement) {
                        DB::rollBack();
                        return response()->json([
                            'success' => false,
                            'user_limit_error' => 'User has insufficient booking hours remaining.'
                        ], 403);
                    }

                    // 5️⃣ Deduct
                    $hoursToDeduct = $quotaDecrement;
                    foreach ($addons as $addon) {
                        if ($hoursToDeduct <= 0)
                            break;

                        $deduct = min($addon->remaining, $hoursToDeduct);
                        if ($deduct > 0) {
                            $addon->decrement('remaining', $deduct);
                            $hoursToDeduct -= $deduct;
                        }
                    }
                }
            }

            // Check room overlap before approving/pending
            if ($validated['status'] === 'approved') {
                $overlap = $this->checkBookingAvailability(
                    $booking->schedule_room_id,
                    $booking->startTime,
                    $booking->endTime,
                );

                if ($overlap) {
                    DB::rollBack();
                    return response()->json([
                        'success' => false,
                        'already_exist' => 'The room is already booked during the selected time range.'
                    ], 409);
                }
            }

            // --- Refund hours if booking was pending/approved → rejected/canceled ---
            if (in_array($oldStatus, ['pending', 'approved']) && in_array($validated['status'], ['rejected', 'canceled'])) {
                $quotaRefund = $this->checkBookingHours($booking->startTime, $booking->endTime);

                $packageAddons = UserAddon::whereIn(
                    'user_package_id',
                    $user
                        ->packages()
                        ->where('status', 'active')
                        ->where('valid_from', '<=', $today)
                        ->where('valid_to', '>=', $today)
                        ->pluck('id')
                )
                    ->where('addon_type', 'booking_hours')
                    ->lockForUpdate()
                    ->get();

                $standaloneAddons = $user
                    ->addons()
                    ->whereNull('user_package_id')
                    ->where('addon_type', 'booking_hours')
                    ->lockForUpdate()
                    ->get();

                $addons = $packageAddons->concat($standaloneAddons);

                $hoursToRefund = $quotaRefund;
                foreach ($addons as $addon) {
                    if ($hoursToRefund <= 0)
                        break;

                    $maxRefundable = $addon->total == -1 ? 0 : $addon->total - $addon->remaining;
                    if ($maxRefundable <= 0)
                        continue;

                    $refund = min($hoursToRefund, $maxRefundable);
                    $addon->increment('remaining', $refund);
                    $hoursToRefund -= $refund;
                }
            }

            // --- Update booking status ---
            $booking->update(['status' => $validated['status']]);

            // --- Notifications ---
            if ($validated['status'] !== $oldStatus) {
                $room = ScheduleRoom::find($booking->schedule_room_id);
                $roomName = $room ? $room->name : 'Unknown Room';
                $admin = auth()->user();

                $user->notify(new GeneralNotification([
                    'title' => "Booking Status Updated - {$roomName}",
                    'message' => "Your booking #{$booking->event_id} for Meeting Room {$roomName} is now {$validated['status']}.",
                    'type' => 'booking_status_updated',
                    'booking_id' => $booking->event_id,
                    'status' => $validated['status'],
                ]));

                $admin->notify(new GeneralNotification([
                    'title' => "Booking Status Updated - User: {$user->name}",
                    'message' => "Booking #{$booking->event_id} for Meeting Room {$roomName} updated to {$validated['status']} by {$admin->name}.",
                    'type' => 'booking_status_updated',
                    'booking_id' => $booking->event_id,
                    'status' => $validated['status'],
                    'updated_by' => $admin->name,
                ]));
            }

            DB::commit();
            return response()->json(['success' => true, 'message' => 'Booking Schedule updated successfully'], 200);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $th->getMessage()], 500);
        }
    }

    // Destroy Booking
    public function destroy($id)
    {
        try {
            $userId = auth()->user()->id;

            $bookingSchedule = BookingSchedule::where('user_id', $userId)->where('status', 'pending')->find($id);
            if (!$bookingSchedule) {
                return response()->json(['success' => false, 'message' => 'Booking Schedule not found'], 404);
            }

            $bookingSchedule->delete();
            return response()->json(['success' => true, 'message' => 'Booking Schedule deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // c
    private function checkBookingHours($bookingStartTime, $bookingEndTime)
    {
        // Calculate booking duration in hours
        $startTime = new Carbon($bookingStartTime);
        $endTime = new Carbon($bookingEndTime);
        $durationInHours = $startTime->diffInMinutes($endTime) / 60;

        // Round to 2 decimal places for duration
        $quotaDecrement = round($durationInHours, 2);

        return $quotaDecrement;
    }
}
