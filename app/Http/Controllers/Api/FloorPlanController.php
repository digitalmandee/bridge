<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Chair;
use App\Models\Floor;
use App\Models\Room;
use App\Models\Table;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Carbon;

class FloorPlanController extends Controller
{
    public function getSeatAllocations(Request $request)
    {
        try {
            // ✅ Fetch all confirmed bookings with relationships
            $bookings = Booking::where('status', 'confirmed')
                ->with([
                    'floor:id,name',
                    'user:id,name,profile_image',
                    'bookingChairs.chair.table',
                    'bookingChairs.chair.room'
                ])
                ->get();

            // ✅ Format response
            $response = $bookings->map(function ($booking) {
                $flattenedChairs = $booking->bookingChairs->map(function ($bc) {
                    $chair = $bc->chair;
                    return [
                        'id' => $chair->id,
                        'chair_id' => $chair->chair_id,
                        'table_id' => $chair->table->id ?? null,
                        'table_name' => $chair->table->name ?? 'N/A',
                        'room_id' => $chair->room->id ?? null,
                        'room_name' => $chair->room->name ?? 'N/A',
                    ];
                });

                return [
                    'booking_id' => $booking->id,
                    'name' => $booking->name,
                    'plan' => $booking->plan,
                    'branch' => ['name' => tenant('name')],
                    'floor' => $booking->floor,
                    'user' => $booking->user,
                    'chairs' => $flattenedChairs,
                ];
            });

            return response()->json([
                'success' => true,
                'seats' => $response
            ]);
        } catch (\Throwable $th) {
            Log::error('Seat allocation error: ' . $th->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'An error occurred while retrieving the seat allocations'
            ], 500);
        }
    }

    public function getFloorPlan(Request $request)
    {
        try {
            $floorId = $request->floor_id;
            $fromDate = $request->from_date ? Carbon::parse($request->from_date)->startOfDay() : Carbon::today()->startOfDay();
            $toDate = $request->to_date ? Carbon::parse($request->to_date)->endOfDay() : Carbon::today()->endOfDay();

            if (!$floorId) {
                return response()->json(['message' => 'Floor ID parameter is required'], 400);
            }

            // Fetch floor with relations
            $floor = Floor::with(['rooms.tables.chairs'])->where('id', $floorId)->first();

            if (!$floor) {
                return response()->json(['message' => 'Floor not found'], 404);
            }

            // ✅ Get confirmed bookings within date range
            $bookings = Booking::where('floor_id', $floorId)
                ->where('status', 'confirmed')
                ->where(function ($q) use ($fromDate, $toDate) {
                    $q->where(function ($q2) use ($fromDate, $toDate) {
                        $q2
                            ->whereBetween('start_date', [$fromDate, $toDate])
                            ->orWhereBetween('end_date', [$fromDate, $toDate])
                            ->orWhere(function ($q3) use ($fromDate, $toDate) {
                                $q3
                                    ->where('start_date', '<=', $fromDate)
                                    ->where(function ($q4) use ($toDate) {
                                        // If end_date is null, treat it as today
                                        $q4
                                            ->where('end_date', '>=', $toDate)
                                            ->orWhereNull('end_date');
                                    });
                            });
                    });
                })
                ->with('bookingChairs')
                ->get();

            $chairBookings = [];

            foreach ($bookings as $booking) {
                foreach ($booking->bookingChairs as $bookingChair) {
                    $chairId = $bookingChair->chair_id;
                    if (!isset($chairBookings[$chairId])) {
                        $chairBookings[$chairId] = [];
                    }
                    $chairBookings[$chairId][] = $booking->time_slot;
                }
            }

            $totalAvailableChairs = 0;
            $totalOccupiedChairs = 0;

            $tables = $floor->rooms->flatMap(function ($room) use (&$totalAvailableChairs, &$totalOccupiedChairs, $chairBookings) {
                return $room->tables->map(function ($table) use (&$totalAvailableChairs, &$totalOccupiedChairs, $chairBookings) {
                    $chairs = $table->chairs->map(function ($chair) use (&$totalAvailableChairs, &$totalOccupiedChairs, $chairBookings) {
                        $color = 'gray';
                        $timeSlot = 'available';

                        if (isset($chairBookings[$chair->id])) {
                            $slots = $chairBookings[$chair->id];

                            if (in_array('full_day', $slots) || (in_array('day', $slots) && in_array('night', $slots))) {
                                $timeSlot = 'full_day';
                                $color = 'green';
                            } elseif (in_array('day', $slots)) {
                                $timeSlot = 'day';
                                $color = '#F59E0B';  // Orange
                            } elseif (in_array('night', $slots)) {
                                $timeSlot = 'night';
                                $color = '#6366F1';  // Blue
                            }

                            $totalOccupiedChairs++;
                        } else {
                            if ($chair->status !== 'inactive') {
                                $totalAvailableChairs++;
                            }
                        }

                        return [
                            'floor_id' => $chair->floor_id,
                            'room_id' => $chair->room_id,
                            'table_id' => $chair->table_id,
                            'chair_id' => $chair->id,
                            'id' => $chair->chair_id,
                            'position' => [
                                'x' => $chair->positionx,
                                'y' => $chair->positiony,
                            ],
                            'rotation' => $chair->rotation,
                            'time_slot' => $timeSlot,
                            'status' => $chair->status,
                            'color' => $color,
                        ];
                    });

                    return [
                        'id' => $table->table_id,
                        'name' => $table->name,
                        'chairs' => $chairs,
                    ];
                });
            });

            return response()->json([
                'floor_id' => $floor->id,
                'branch_id' => $floor->branch_id,
                'tables' => $tables->values(),
                'totalAvailableChairs' => $totalAvailableChairs,
                'totalOccupiedChairs' => $totalOccupiedChairs,
            ]);
        } catch (\Throwable $th) {
            Log::error($th->getMessage());
            return response()->json(['error' => 'An error occurred while retrieving the floor plan'], 500);
        }
    }

    public function checkAvailability(Request $request)
    {
        try {
            $request->validate([
                'chairs' => 'required|array',
                'member' => 'required|array',
                'time_slot' => 'nullable|in:day,night,full_day',
            ]);

            $chairIds = collect($request->chairs)->pluck('chair_id')->toArray();
            $startDate = Carbon::parse($request->start_date ?? Carbon::today())->startOfDay();
            $requestedSlot = $request->time_slot ?? null;

            // helper to get bookings that affect these chairs on a particular date
            $getBookingsForDate = function (Carbon $date) use ($chairIds) {
                return Booking::whereIn('status', ['confirmed'])
                    ->whereHas('bookingChairs', function ($q) use ($chairIds) {
                        $q->whereIn('chair_id', $chairIds);
                    })
                    ->where(function ($q) use ($date) {
                        $q->where(function ($qq) use ($date) {
                            // ongoing booking with no end_date (not vacated)
                            $qq->whereNull('end_date')->whereDate('start_date', '<=', $date);
                        })->orWhere(function ($qq) use ($date) {
                            // booking covering the date range
                            $qq->whereDate('start_date', '<=', $date)->whereDate('end_date', '>=', $date);
                        });
                    })
                    ->get();
            };

            // helper: from bookings on a date compute unavailable slots
            $computeUnavailableSlots = function ($bookings) {
                $unavailable = [];
                foreach ($bookings as $b) {
                    if ($b->time_slot === 'full_day') {
                        // if any booking is full_day, everything unavailable
                        return ['day', 'night', 'full_day'];
                    }
                    $unavailable[] = $b->time_slot;
                }

                // If both day and night exist, treat as full_day too
                if (in_array('day', $unavailable) && in_array('night', $unavailable)) {
                    return ['day', 'night', 'full_day'];
                }

                // normalize unique
                return array_values(array_unique($unavailable));
            };

            $allSlots = ['day', 'night', 'full_day'];

            // We'll iterate day-by-day until a block is found or we reach max lookahead
            $maxLookaheadDays = 365;  // tweak as needed
            $availableDays = 0;
            $firstDayAvailableSlots = null;
            $current = $startDate->copy();

            for ($i = 0; $i < $maxLookaheadDays; $i++, $current->addDay()) {
                $bookings = $getBookingsForDate($current);
                $unavailable = $computeUnavailableSlots($bookings);

                // derive available slots for this day
                $availableSlots = array_diff($allSlots, $unavailable);

                // If any of day/night is taken → full_day must be removed
                if (in_array('day', $unavailable) || in_array('night', $unavailable)) {
                    $availableSlots = array_diff($availableSlots, ['full_day']);
                }

                // if requestedSlot is provided:
                if ($requestedSlot) {
                    // For full_day request we need both day & night free (i.e. 'full_day' present)
                    if ($requestedSlot === 'full_day') {
                        $isAvailable = in_array('full_day', $availableSlots);
                    } else {
                        $isAvailable = in_array($requestedSlot, $availableSlots);
                    }

                    if (!$isAvailable) {
                        // blocked at this date → stop scanning
                        break;
                    }
                } else {
                    // no requested slot: if no available slots at all, stop
                    if (empty($availableSlots)) {
                        break;
                    }
                }

                // day is available for requested slot (or has some available slot if no requested)
                $availableDays++;

                // store available slots for the first day only (client can decide to use it)
                if ($availableDays === 1) {
                    $firstDayAvailableSlots = array_values($availableSlots);
                }

                // continue to next day
            }

            // Build available_from / available_until
            $availableFrom = $startDate;
            $availableUntil = $availableDays > 0
                ? $startDate->copy()->addDays($availableDays - 1)->endOfDay()
                : null;

            // If start day already blocked, return detail about next available window (if any)
            if ($availableDays === 0) {
                // find next date where seats become available (scan forward up to lookahead)
                $nextAvailableDate = null;
                $scan = $startDate->copy()->addDay();
                for ($j = 0; $j < $maxLookaheadDays; $j++, $scan->addDay()) {
                    $bookings = $getBookingsForDate($scan);
                    $unavailable = $computeUnavailableSlots($bookings);
                    $availableSlots = array_diff($allSlots, $unavailable);
                    if (in_array('day', $unavailable) || in_array('night', $unavailable)) {
                        $availableSlots = array_diff($availableSlots, ['full_day']);
                    }

                    if ($requestedSlot) {
                        $isAvailable = $requestedSlot === 'full_day'
                            ? in_array('full_day', $availableSlots)
                            : in_array($requestedSlot, $availableSlots);
                    } else {
                        $isAvailable = !empty($availableSlots);
                    }

                    if ($isAvailable) {
                        $nextAvailableDate = $scan->copy()->startOfDay();
                        break;
                    }
                }

                return response()->json([
                    'success' => true,
                    'data' => [
                        'available' => false,
                        'available_time' => null,
                        'available_from' => null,
                        'next_available_from' => $nextAvailableDate ? $nextAvailableDate->format('Y-m-d') : null,
                        'message' => 'Selected chairs are not available on requested start date.',
                    ]
                ]);
            }

            // Build response
            return response()->json([
                'success' => true,
                'data' => [
                    'available' => true,
                    'available_time' => $availableFrom->format('Y-m-d H:i:s'),
                    'available_from' => $availableFrom->format('Y-m-d'),
                    'available_until' => $availableUntil ? $availableUntil->format('Y-m-d') : null,
                    'available_days' => $availableDays,
                    'available_durations' => $firstDayAvailableSlots,
                ]
            ]);
        } catch (\Throwable $th) {
            Log::error($th->getMessage());
            return response()->json([
                'success' => false,
                'error' => $th->getMessage()
            ], 500);
        }
    }

    public function getFloors()
    {
        $floors = Floor::select('id', 'name')->get();
        return response()->json(['success' => true, 'floors' => $floors], 200);
    }

    public function getRooms(Request $request, $floor_id)
    {
        $floorId = $floor_id;

        if (empty($floorId)) {
            // Optionally return all floors only
            $floors = Floor::select('id', 'name')->get();
            return response()->json(['success' => true, 'floors' => $floors], 200);
        }

        // Eager load rooms and their tables for the given floor
        $floor = Floor::with(['rooms.tables:id,room_id,table_id,name,id'])->select('id', 'name')->find($floorId);

        if (!$floor) {
            return response()->json(['success' => false, 'message' => 'Floor not found'], 404);
        }

        return response()->json(['success' => true, 'floor' => $floor], 200);
    }

    public function createChair(Request $request)
    {
        $request->validate([
            'floor_id' => 'required|integer',
            'room_id' => 'required|integer',
            'table_id' => 'required|integer',
        ]);

        // Count all chairs associated with the table
        $chairsCount = Chair::where('table_id', $request->table_id)->count();

        // Increment the chair count to set the new chair_id
        $newChairId = $chairsCount + 1;

        Chair::create([
            'floor_id' => $request->floor_id,
            'room_id' => $request->room_id,
            'table_id' => $request->table_id,
            'chair_id' => $newChairId,
        ]);

        return response()->json(['success' => true, 'message' => 'Chair created successfully'], 200);
    }

    //  fetch chairs

    public function getChairs(Request $request)
    {
        $floorId = $request->query('floor_id');
        try {
            $today = Carbon::today();

            // Get all chairs for this floor
            $chairs = Chair::where('floor_id', $floorId)
                ->with('floor:id,name', 'table:id,table_id')
                ->get();

            // Get today's confirmed bookings with chairs
            $bookings = Booking::where('floor_id', $floorId)
                ->where('status', 'confirmed')
                ->whereDate('start_date', '<=', $today)
                ->whereDate('end_date', '>=', $today)  // If booking spans multiple days
                ->with('bookingChairs')
                ->get();

            // Map chair bookings by chair_id
            $chairBookings = [];
            foreach ($bookings as $booking) {
                foreach ($booking->bookingChairs as $bookingChair) {
                    $chairId = $bookingChair->chair_id;
                    if (!isset($chairBookings[$chairId]))
                        $chairBookings[$chairId] = [];
                    $chairBookings[$chairId][] = $booking->time_slot;
                }
            }

            // Merge chair status
            $chairs = $chairs->map(function ($chair) use ($chairBookings) {
                $status = 'available';
                $color = 'green';

                if (isset($chairBookings[$chair->id])) {
                    $slots = $chairBookings[$chair->id];

                    if (in_array('full_day', $slots) || (in_array('day', $slots) && in_array('night', $slots))) {
                        $status = 'full_day';
                        $color = '#34A853';
                    } elseif (in_array('day', $slots)) {
                        $status = 'day';
                        $color = '#F59E0B';
                    } elseif (in_array('night', $slots)) {
                        $status = 'night';
                        $color = '#6366F1';
                    }
                }

                return [
                    'id' => $chair->id,
                    'chair_id' => $chair->chair_id,
                    'floor' => $chair->floor,
                    'table' => $chair->table,
                    'time_slot' => $status,
                    'status' => $chair->status,
                    'color' => $color,
                ];
            });

            return response()->json(['success' => true, 'chairs' => $chairs]);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'error' => $th->getMessage()], 500);
        }
    }

    public function deleteChair(Request $request, $chairId)
    {
        try {
            $chair = Chair::findOrFail($chairId);

            $today = Carbon::today();

            // Check confirmed bookings that are running or future
            $bookings = Booking::whereHas('bookingChairs', function ($q) use ($chairId) {
                $q->where('chair_id', $chairId);
            })
                ->whereIn('status', ['confirmed'])
                ->where(function ($q) use ($today) {
                    $q
                        ->whereNull('end_date')  // running without end date
                        ->orWhereDate('end_date', '>=', $today);  // future bookings
                })
                ->pluck('id');

            if ($bookings->count() > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'This chair is already booked in booking IDs: ' . $bookings->implode(', ')
                ], 400);
            }

            $chair->delete();

            return response()->json([
                'success' => true,
                'message' => 'Chair deleted successfully'
            ]);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'message' => $th->getMessage()], 500);
        }
    }

    public function updateChair(Request $request, $id)
    {
        try {
            $chair = Chair::findOrFail($id);
            $chair->update($request->only('status'));

            return response()->json([
                'success' => true,
                'message' => 'Chair updated successfully',
                'chair' => $chair
            ]);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'message' => $th->getMessage()], 500);
        }
    }

    //  fetch floors
    public function getFloorPlanList(Request $request)
    {
        try {
            $floors = Floor::select('id', 'name')->get();
            return response()->json(['success' => true, 'floors' => $floors]);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'error' => $th->getMessage()], 500);
        }
    }
}
