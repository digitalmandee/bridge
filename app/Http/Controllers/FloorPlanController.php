<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Chair;
use App\Models\Floor;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

class FloorPlanController extends Controller
{

    public function getSeatAllocations(Request $request)
    {
        try {
            $branchId = auth()->user()->branch->id;

            if (!$branchId) {
                return response()->json(['message' => 'Branch ID parameter is required'], 400);
            }

            // Fetch bookings with related data
            $bookings = Booking::where('branch_id', $branchId)->where('status', 'confirmed')->with(['branch:id,name', 'floor:id,name', 'user:id,name,profile_image'])->get();

            // Extract all chair IDs from bookings
            // Fetch all chairs that are associated with any booking
            $allChairIds = $bookings->pluck('chair_ids')->flatten()->unique()->toArray();
            $chairs = Chair::whereIn('id', $allChairIds)->with(['table', 'room'])->get()->keyBy('id');

            // Format response
            $response = $bookings->map(function ($booking) use ($chairs) {
                $chairIds = $booking->chair_ids ?? [];

                $flattenedChairs = collect($chairIds)->map(function ($chairId) use ($chairs) {
                    $chair = $chairs[$chairId] ?? null;
                    return $chair ? [
                        'id' => $chair->id,
                        'chair_id' => $chair->chair_id,
                        'table_id' => $chair->table->table_id ?? null,
                        'table_name' => $chair->table->name ?? 'N/A',
                        'room_id' => $chair->room->id ?? null,
                        'room_name' => $chair->room->name ?? 'N/A',
                    ] : null;
                })->filter()->values(); // Remove null values

                return [
                    'booking_id' => $booking->id,
                    'name' => $booking->name,
                    'plan' => $booking->plan,
                    'branch' => $booking->branch,
                    'floor' => $booking->floor,
                    'user' => $booking->user,
                    'chairs' => $flattenedChairs,
                ];
            });

            return response()->json(['success' => true, 'seats' => $response]);
        } catch (\Throwable $th) {
            Log::error("Seat allocation error: " . $th->getMessage());
            return response()->json(['success' => false, 'error' => 'An error occurred while retrieving the seat allocations'], 500);
        }
    }

    public function getFloorPlan(Request $request)
    {
        try {
            $floorId = $request->floor_id;

            if (!$floorId) {
                return response()->json(['message' => 'Floor ID parameter is required'], 400);
            }

            $branchId = auth()->user()->branch->id;

            // Fetch the floor with its related rooms, tables, and chairs
            $floor = Floor::with(['rooms.tables.chairs'])
                ->where('id', $floorId)
                ->where('branch_id', $branchId)
                ->first();

            if (!$floor) {
                return response()->json(['message' => 'Floor not found'], 404);
            }

            // Process tables and chairs
            $totalAvailableChairs = 0;
            $totalOccupiedChairs = 0;

            $tables = $floor->rooms->flatMap(function ($room) use (&$totalAvailableChairs, &$totalOccupiedChairs) {
                return $room->tables->map(function ($table) use (&$totalAvailableChairs, &$totalOccupiedChairs) {
                    $chairs = $table->chairs->map(function ($chair) use (&$totalAvailableChairs, &$totalOccupiedChairs) {
                        $isOccupied = $chair->time_slot !== 'available';
                        $isFullDay = $chair->time_slot === 'full_day';

                        if ($isOccupied) {
                            $totalOccupiedChairs++;
                            if (!$isFullDay) {
                                $totalAvailableChairs++;
                            }
                        } else {
                            $totalAvailableChairs++;
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
                            'color' => $chair->color,
                            'time_slot' => $chair->time_slot,
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
            return response()->json(['error' => 'An error occurred while retrieving the floor plan'], 500);
        }
    }

    public function checkChairAvailability(Request $request)
    {
        try {
            // Validate the incoming request
            $request->validate([
                'data' => 'required|array',
            ]);

            $chairIds = collect($request->data)->pluck('chair_id'); // Extract chair IDs

            // Fetch chairs with their booking details
            $chairs = Chair::whereIn('id', $chairIds)->get();

            // Initialize variables to track availability and the earliest available time
            $hasDay = false;
            $hasNight = false;
            $hasNull = false;
            $earliestAvailableTime = now(); // Default to now (if all chairs are available immediately)

            // Loop through the chairs and determine availability
            foreach ($chairs as $chair) {
                if ($chair->time_slot === 'available') {
                    $hasNull = true; // Unbooked chairs (null time_slot)
                    continue; // Unbooked chair is available immediately
                } elseif ($chair->time_slot === 'day') {
                    $hasDay = true;
                    $bookingStart = Carbon::parse($chair->booking_startdate);
                    // If the chair is booked, check the booking start time for availability
                    if ($bookingStart->isFuture() && $bookingStart->lt($earliestAvailableTime)) {
                        $earliestAvailableTime = $bookingStart;
                    }
                } elseif ($chair->time_slot === 'night') {
                    $hasNight = true;
                    $bookingStart = Carbon::parse($chair->booking_startdate);
                    // If the chair is booked, check the booking start time for availability
                    if ($bookingStart->isFuture() && $bookingStart->lt($earliestAvailableTime)) {
                        $earliestAvailableTime = $bookingStart;
                    }
                }
            }

            // Determine available durations based on the flags
            $availableDurations = [];

            if ($hasNull) {
                if ($hasDay && !$hasNight) {
                    $availableDurations = ['night'];
                } elseif ($hasNight && !$hasDay) {
                    $availableDurations = ['day'];
                } elseif ($hasDay && $hasNight) {
                    $availableDurations = []; // No availability since both day and night are booked
                } else {
                    $availableDurations = ['day', 'night', 'full_day']; // All durations available if only null chairs
                }
            } else {
                if ($hasDay && !$hasNight) {
                    $availableDurations = ['night'];
                } elseif ($hasNight && !$hasDay) {
                    $availableDurations = ['day'];
                } elseif ($hasDay && $hasNight) {
                    $availableDurations = []; // No durations available since both are booked
                }
            }

            // If there is an available duration, return it along with the earliest available time
            return response()->json([
                'success' => true,
                'data' => [
                    'available_durations' => $availableDurations,
                    'available_time' => $earliestAvailableTime->format('Y-m-d H:i:s') // Return the earliest available time
                ]
            ]);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'error' => $th->getMessage()], 500);
        }
    }
}