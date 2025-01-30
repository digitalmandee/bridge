<?php

namespace Database\Seeders;

use App\Models\Chair;
use Illuminate\Database\Seeder;
use App\Models\Room;
use App\Models\Floor;
use App\Models\Table;
use Illuminate\Support\Carbon;

class RoomsTableSeeder extends Seeder
{
    public function run()
    {
        $floors = Floor::all();
        foreach ($floors as $floor) {
            $rooms = [
                [
                    'floor_id' => $floor->id,
                    'name' => 'Chair',
                    'data' => [
                        [
                            "id" => "A",
                            "name" => "Table A",
                            "chairs" => [
                                ["id" => 1, "positionx" => 18.2, "positiony" => 8.5, "rotation" => -45, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ["id" => 2, "positionx" => 24, "positiony" => 11, "rotation" => 135, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ["id" => 3, "positionx" => 15, "positiony" => 11, "rotation" => 225, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                            ]
                        ],
                        [
                            "id" => "B",
                            "name" => "Table B",
                            "chairs" => [
                                ["id" => 1, "positionx" => 36.5, "positiony" => 8.5, "rotation" => -45, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ["id" => 2, "positionx" => 42, "positiony" => 11, "rotation" => 135, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ["id" => 3, "positionx" => 34, "positiony" => 11.2, "rotation" => 225, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                            ]
                        ],
                        [
                            "id" => "C",
                            "name" => "Table C",
                            "chairs" => [
                                ["id" => 1, "positionx" => 15, "positiony" => 14, "rotation" => -45, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ["id" => 2, "positionx" => 18.5, "positiony" => 16.5, "rotation" => 225, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ["id" => 3, "positionx" => 24, "positiony" => 14, "rotation" => 45, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                            ]
                        ],
                        [
                            "id" => "D",
                            "name" => "Table D",
                            "chairs" => [
                                ["id" => 1, "positionx" => 33.5, "positiony" => 14, "rotation" => -45, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ["id" => 2, "positionx" => 36.8, "positiony" => 16.7, "rotation" => 225, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ["id" => 3, "positionx" => 42.5, "positiony" => 14, "rotation" => 45, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                            ]
                        ],
                        [
                            "id" => "F",
                            "name" => "Table 5",
                            "chairs" => [
                                ["id" => 1, "positionx" => 67, "positiony" => 9, "rotation" => 0, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ["id" => 2, "positionx" => 71.5, "positiony" => 9, "rotation" => 0, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ["id" => 3, "positionx" => 76, "positiony" => 9, "rotation" => 0, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ["id" => 3, "positionx" => 63, "positiony" => 11, "rotation" => 270, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ["id" => 4, "positionx" => 63, "positiony" => 12.7, "rotation" => 270, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ["id" => 5, "positionx" => 63, "positiony" => 14.5, "rotation" => 270, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ["id" => 6, "positionx" => 67, "positiony" => 16.3, "rotation" => 180, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ["id" => 7, "positionx" => 71.5, "positiony" => 16.3, "rotation" => 180, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ["id" => 8, "positionx" => 76, "positiony" => 16.3, "rotation" => 180, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ["id" => 9, "positionx" => 80, "positiony" => 11, "rotation" => 90, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ["id" => 10, "positionx" => 80, "positiony" => 12.7, "rotation" => 90, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ["id" => 11, "positionx" => 80, "positiony" => 14.5, "rotation" => 90, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null]
                            ]
                        ],
                        [
                            "id" => "G",
                            "name" => "Table 6",
                            "chairs" => [
                                ["id" => 1, "positionx" => 67, "positiony" => 19.2, "rotation" => 0, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ["id" => 2, "positionx" => 71.5, "positiony" => 19.2, "rotation" => 0, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ["id" => 3, "positionx" => 76, "positiony" => 19.2, "rotation" => 0, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null]
                            ]
                        ],
                        [
                            "id" => "H",
                            "name" => "Table 7",
                            "chairs" => [
                                ["id" => 1, "positionx" => 18, "positiony" => 20.5, "rotation" => 0, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ["id" => 2, "positionx" => 26, "positiony" => 20.5, "rotation" => 0, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null]
                            ]
                        ],
                        [
                            "id" => "I",
                            "name" => "Table 8",
                            "chairs" => [
                                ["id" => 1, "positionx" => 24, "positiony" => 29.1, "rotation" => 0, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null]
                            ]
                        ],
                        [
                            "id" => "J",
                            "name" => "Table 9",
                            "chairs" => [
                                ["id" => 1, "positionx" => 29, "positiony" => 43, "rotation" => 90, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ["id" => 2, "positionx" => 29, "positiony" => 45.5, "rotation" => 90, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null]
                            ]
                        ],
                        [
                            "id" => "K",
                            "name" => "Table 10",
                            "chairs" => [
                                ["id" => 1, "positionx" => 17, "positiony" => 49.8, "rotation" => 0, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ["id" => 2, "positionx" => 24, "positiony" => 49.8, "rotation" => 0, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null]
                            ]
                        ],
                        [
                            "id" => 'L',
                            "name" => "Table 11",
                            "chairs" => [
                                ["id" => 1, "positionx" => 74, "positiony" => 46.5, "rotation" => 180, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ["id" => 2, "positionx" => 80, "positiony" => 46.5, "rotation" => 180, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null]
                            ]
                        ],
                        [
                            "id" => "M",
                            "name" => "Table 12",
                            "chairs" => [
                                ["id" => 1, "positionx" => 84.2, "positiony" => 48, "rotation" => 270, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ["id" => 2, "positionx" => 84.2, "positiony" => 50, "rotation" => 270, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null]
                            ]
                        ],
                        [
                            "id" => 'N',
                            "name" => "Table 13",
                            "chairs" => [
                                ["id" => 1, "positionx" => 70, "positiony" => 53.8, "rotation" => 0, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ["id" => 2, "positionx" => 78, "positiony" => 53.8, "rotation" => 0, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ["id" => 3, "positionx" => 70, "positiony" => 58.2, "rotation" => 180, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ["id" => 4, "positionx" => 78, "positiony" => 58.2, "rotation" => 180, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null]
                            ]
                        ],
                        [
                            "id" => 'O',
                            "name" => "Table 14",
                            "chairs" => [
                                ["id" => 1, "positionx" => 73, "positiony" => 65.8, "rotation" => 0, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ["id" => 2, "positionx" => 80, "positiony" => 65.8, "rotation" => 0, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null]
                            ]
                        ],
                        [
                            "id" => 'P',
                            "name" => "Table 15",
                            "chairs" => [
                                ["id" => 1, "positionx" => 84, "positiony" => 61.6, "rotation" => 270, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ["id" => 2, "positionx" => 84, "positiony" => 64, "rotation" => 270, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null]
                            ]
                        ]
                    ]
                ],
                [
                    'floor_id' => $floor->id,
                    'name' => 'Caben',
                    'data' => [
                        [
                            "id" => "Q",
                            "name" => "Cabins",
                            "chairs" => [
                                ["id" => 1, "positionx" => 16, "positiony" => 3, "rotation" => 200, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ["id" => 2, "positionx" => 30, "positiony" => 3, "rotation" => 160, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ["id" => 3, "positionx" => 39, "positiony" => 3, "rotation" => 160, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ["id" => 4, "positionx" => 52, "positiony" => 3, "rotation" => 160, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ["id" => 5, "positionx" => 61, "positiony" => 3, "rotation" => 160, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ["id" => 6, "positionx" => 70, "positiony" => 3, "rotation" => 160, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ["id" => 7, "positionx" => 79, "positiony" => 3, "rotation" => 160, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ["id" => 8, "positionx" => 74, "positiony" => 31.5, "rotation" => 40, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ["id" => 9, "positionx" => 65, "positiony" => 31.5, "rotation" => 40, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ["id" => 10, "positionx" => 57, "positiony" => 31.5, "rotation" => 40, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null]
                            ]
                        ],
                    ]
                ]
            ];
            foreach ($rooms as $room) {
                $newroom = Room::create([
                    'floor_id' => $room['floor_id'],
                    'name' => $room['name'],
                ]);
                foreach ($room['data'] as $table) {
                    $newtable = Table::create([
                        'floor_id' => $room['floor_id'],
                        'room_id' => $newroom->id,
                        'table_id' => $table['id'],
                        'name' => $table['name'],
                    ]);
                    foreach ($table['chairs'] as $chair) {
                        Chair::create([
                            'floor_id' => $room['floor_id'],
                            'room_id' => $newroom->id,
                            'table_id' => $newtable->id,
                            'chair_id' => $chair['id'],
                            'positionx' => $chair['positionx'],
                            'positiony' => $chair['positiony'],
                            'rotation' => $chair['rotation'],
                            'color' => $chair['color'],
                            'booking_startdate' => $chair['booking_startdate'],
                            'booking_enddate' => $chair['booking_enddate'],
                            'booked' => $chair['booked'],
                            'duration' => $chair['duration'],
                        ]);
                    }
                }
            }
        }
    }
}