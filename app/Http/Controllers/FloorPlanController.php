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
    public function index()
    {
        return view('admin.floor_plan.index');
    }
    public function getSeatAllocations(Request $request)
    {
        try {
            $branchId = $request->branch_id;

            if (!$branchId) {
                return response()->json(['message' => 'Branch ID parameter is required'], 400);
            }

            // Fetch bookings with related data
            $bookings = Booking::where('branch_id', $branchId)->with(['branch', 'floor','user'])->get();

            // Fetch all rooms once to avoid multiple queries
            $rooms = Room::all()->keyBy('id'); // Key rooms by 'id' for easy lookup

            // Transform chairs JSON for each booking
            $response = $bookings->map(function ($booking) use ($rooms) {
                $chairsData = $booking->chairs; // Assume `chairs` contains your JSON structure

                // Flatten and enhance each chair with its corresponding room data
                $flattenedChairs = collect($chairsData)->flatMap(function ($chairs, $tableName) use ($rooms) {
                    return collect($chairs)->map(function ($chair) use ($tableName, $rooms) {
                        $chair['table_name'] = $tableName; // Add table_name to each chair

                        // Match room data by room_id and add it to the chair
                        if (isset($chair['room_id']) && $rooms->has($chair['room_id'])) {
                            $chair['room'] = $rooms[$chair['room_id']]; // Add room data
                        } else {
                            $chair['room'] = null; // No matching room found
                        }

                        return $chair;
                    });
                })->values(); // Flatten and return as a collection

                return [
                    'booking_id' => $booking->id,
                    'name' => $booking->name,
                    'plan' => $booking->plan,
                    'booked' => $booking->booked,
                    'branch' => $booking->branch,
                    'floor' => $booking->floor,
                    'user' => $booking->user,
                    'chairs' => $flattenedChairs,
                ];
            });

            return response()->json(['success' => true, 'seats' => $response]);
        } catch (\Throwable $th) {
            Log::info($th->getMessage());
            return response()->json(['success' => false, 'error' => 'An error occurred while retrieving the seat allocations'], 500);
        }
    }

    public function getFloorPlan(Request $request)
    {
        try {
            $branchId = $request->branch_id;
            $floorId = $request->floor_id;

            if (!$branchId) {
                return response()->json(['message' => 'Branch ID parameter is required'], 400);
            }
            if (!$floorId) {
                return response()->json(['message' => 'Floor ID parameter is required'], 400);
            }

            // Fetch the floor with its related rooms, tables, and chairs
            $floor = Floor::with(['rooms.tables.chairs'])->where('id', $floorId)->where('branch_id', $branchId)->first();

            if ($floor) {
                // Collect all tables (and their chairs) into a single array
                $tables = $floor->rooms->flatMap(function ($room) {
                    return $room->tables->map(function ($table) {
                        return [
                            'id' => $table->table_id,
                            'name' => $table->name,
                            'chairs' => $table->chairs->map(function ($chair) {
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
                                    'booking_startdate' => $chair->booking_startdate,
                                    'booking_enddate' => $chair->booking_enddate,
                                    'booked' => $chair->booked,
                                    'duration' => $chair->duration,
                                ];
                            }),
                        ];
                    });
                });

                $result = [
                    'floor_id' => $floor->id,
                    'branch_id' => $floor->branch_id,
                    'tables' => $tables->values(), // Convert collection to array
                ];
            } else {
                $result = []; // Handle case where floor is not found
            }

            // Return the structured data as JSON
            return response()->json($result);
        } catch (\Throwable $th) {
            // Handle any errors that may occur
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
                if (!$chair->booked) {
                    $hasNull = true; // Unbooked chairs (null duration)
                    continue; // Unbooked chair is available immediately
                } elseif ($chair->duration === 'day') {
                    $hasDay = true;
                    $bookingStart = Carbon::parse($chair->booking_startdate);
                    // If the chair is booked, check the booking start time for availability
                    if ($bookingStart->isFuture() && $bookingStart->lt($earliestAvailableTime)) {
                        $earliestAvailableTime = $bookingStart;
                    }
                } elseif ($chair->duration === 'night') {
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
                    $availableDurations = ['day', 'night', '24']; // All durations available if only null chairs
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
