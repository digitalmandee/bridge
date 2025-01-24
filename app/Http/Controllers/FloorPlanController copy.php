<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\BookingPlan;
use App\Models\Branch;
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

            if (!$branchId) return response()->json(['message' => 'Branch ID parameter is required'], 400);

            $bookings = Booking::where('branch_id', $branchId)->get();

            $chairAllocations = [];

            foreach ($bookings as $booking) {
                $chairAllocations[] = [
                    "name" => $booking->name,
                    "chairs" => json_decode($booking->booking_purpose, true),
                    "payment" => json_decode($booking->payment_method, true),
                ];
            }

            return response()->json([
                'chairs' => $chairAllocations,
            ]);
        } catch (\Throwable $th) {
            return response()->json(['error' => 'An error occurred while retrieving the floor plan'], 500);
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

    private function getRoomsData($floor)
    {
        // Initialize an empty array to hold room data
        $roomsData = [];

        // Loop through each room in the floor's rooms and decode the room data
        foreach ($floor->rooms as $room) {
            $roomData = json_decode($room->data, true); // Decode JSON to PHP array

            // Add each room's data to roomsData without extra nesting
            foreach ($roomData as $data) {
                $roomsData[] = $data;  // Append each entry to the roomsData array
            }
        }

        // Return the array containing all rooms' data in a single, flat array
        return $roomsData;
    }



    public function checkChairAvailability(Request $request)
    {
        try {
            // Validate the incoming request
            $validated = $request->validate([
                'data' => 'required|array',
            ]);

            $response = [];

            foreach ($validated['data'] as $roomRequest) {
                $room = Room::find($roomRequest['roomId']);
                if (!$room) {
                    $response[] = [
                        'roomId' => $roomRequest['roomId'],
                        'status' => 'Room not found',
                    ];
                    continue;
                }

                $roomData = json_decode($room->data, true);
                $requestedData = $roomRequest['data'];

                foreach ($requestedData as $tableName => $tableData) {
                    foreach ($tableData['chairs'] as $chairRequest) {
                        $chairId = $chairRequest['id'];

                        // Find the chair by ID in the JSON array
                        $chair = collect($roomData[$tableName]['chairs'])->firstWhere('id', $chairId);

                        if ($chair) {
                            // Check booking status
                            if ($chair['booked']) {
                                $bookingStart = isset($chair['booking_startdate']) ? Carbon::parse($chair['booking_startdate']) : null;
                                $bookingEnd = isset($chair['booking_enddate']) ? Carbon::parse($chair['booking_enddate']) : null;
                                $now = Carbon::now();

                                if ($bookingStart && $bookingEnd) {
                                    if ($now->between($bookingStart, $bookingEnd)) {
                                        $response[] = [
                                            'roomId' => $roomRequest['roomId'],
                                            'table' => $tableName,
                                            'chairId' => $chairId,
                                            'status' => 'Booked',
                                        ];
                                    } else {
                                        $response[] = [
                                            'roomId' => $roomRequest['roomId'],
                                            'table' => $tableName,
                                            'chairId' => $chairId,
                                            'status' => 'Available',
                                        ];
                                    }
                                } elseif ($bookingStart && !$bookingEnd) {
                                    // Active booking without an end date
                                    $response[] = [
                                        'roomId' => $roomRequest['roomId'],
                                        'table' => $tableName,
                                        'chairId' => $chairId,
                                        'status' => 'Booked',
                                    ];
                                } else {
                                    $response[] = [
                                        'roomId' => $roomRequest['roomId'],
                                        'table' => $tableName,
                                        'chairId' => $chairId,
                                        'status' => 'Available',
                                    ];
                                }
                            } else {
                                $response[] = [
                                    'roomId' => $roomRequest['roomId'],
                                    'table' => $tableName,
                                    'chairId' => $chairId,
                                    'status' => 'Available',
                                ];
                            }
                        } else {
                            $response[] = [
                                'roomId' => $roomRequest['roomId'],
                                'table' => $tableName,
                                'chairId' => $chairId,
                                'status' => 'Chair not found',
                            ];
                        }
                    }
                }
            }

            return response()->json($response);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }
}
