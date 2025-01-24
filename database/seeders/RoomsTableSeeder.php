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
                    'name' => 'Room 1',
                    'data' => [[
                        "id" => "A",
                        "name" => "Table A",
                        "chairs" => [
                            ["id" => 1, "positionx" => 12, "positiony" => 3, "rotation" => 0, "color" => 'gray', "booking_startdate" => Carbon::now(), "booking_enddate" => "", "booked" => 1, "duration" => 'day'],
                            ["id" => 2, "positionx" => 15, "positiony" => 3, "rotation" => 0, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                            ["id" => 3, "positionx" => 18, "positiony" => 3, "rotation" => 0, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                            ["id" => 4, "positionx" => 12, "positiony" => 13, "rotation" => 180, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                            ["id" => 5, "positionx" => 15, "positiony" => 13, "rotation" => 180, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                            ["id" => 6, "positionx" => 18, "positiony" => 13, "rotation" => 180, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                            ["id" => 7, "positionx" => 23.7, "positiony" => 8, "rotation" => 90, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                        ]
                    ]]
                ],
                [
                    'floor_id' => $floor->id,
                    'name' => 'Room 2',
                    'data' => [[
                        "id" => "B",
                        "name" => "Table B",
                        "chairs" => [
                            ["id" => 1, "positionx" => 14, "positiony" => 22.5, "rotation" => 0, "color" => 'gray', "booking_startdate" => Carbon::now(), "booking_enddate" => "", "booked" => 1, "duration" => 24],
                            ["id" => 2, "positionx" => 17, "positiony" => 22.5, "rotation" => 0, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                            ["id" => 3, "positionx" => 20, "positiony" => 22.5, "rotation" => 0, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                            ["id" => 4, "positionx" => 14, "positiony" => 32.5, "rotation" => 180, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                            ["id" => 5, "positionx" => 17, "positiony" => 32.5, "rotation" => 180, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                            ["id" => 6, "positionx" => 20, "positiony" => 32.5, "rotation" => 180, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                            ["id" => 7, "positionx" => 25.3, "positiony" => 27, "rotation" => 90, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                        ]
                    ]]
                ],
                [
                    'floor_id' => $floor->id,
                    'name' => 'Room 3',
                    'data' => [[
                        "id" => "C",
                        "name" => "Table C",
                        "chairs" => [
                            ["id" => 1, "positionx" => 54.5, "positiony" => 3, "rotation" => 0, "color" => 'gray', "booking_startdate" => Carbon::now(), "booking_enddate" => "", "booked" => 0, "duration" => 'day'],
                            ["id" => 2, "positionx" => 50, "positiony" => 10, "rotation" => 270, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                            ["id" => 3, "positionx" => 59.2, "positiony" => 10, "rotation" => 90, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                            ["id" => 4, "positionx" => 54.5, "positiony" => 17, "rotation" => 180, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                        ]
                    ]]
                ],
                [
                    'floor_id' => $floor->id,
                    'name' => 'Room 4',
                    'data' => [[
                        "id" => "D",
                        "name" => "Table D",
                        "chairs" => [
                            ["id" => 1, "positionx" => 77.5, "positiony" => 3, "rotation" => 0, "color" => 'gray', "booking_startdate" => Carbon::now(), "booking_enddate" => "", "booked" => 0, "duration" => 24],
                            ["id" => 2, "positionx" => 81.2, "positiony" => 8.5, "rotation" => 90, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                            ["id" => 3, "positionx" => 81.2, "positiony" => 14, "rotation" => 90, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                            ["id" => 4, "positionx" => 81.2, "positiony" => 19.5, "rotation" => 90, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                            ["id" => 5, "positionx" => 81.2, "positiony" => 25, "rotation" => 90, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                            ["id" => 6, "positionx" => 81.2, "positiony" => 30.5, "rotation" => 90, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                            ["id" => 7, "positionx" => 81.2, "positiony" => 36, "rotation" => 90, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                            ["id" => 8, "positionx" => 81.2, "positiony" => 41.5, "rotation" => 90, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                            ["id" => 9, "positionx" => 81.2, "positiony" => 47, "rotation" => 90, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                            ["id" => 10, "positionx" => 73.8, "positiony" => 8.5, "rotation" => 270, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                            ["id" => 11, "positionx" => 73.8, "positiony" => 14, "rotation" => 270, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                            ["id" => 12, "positionx" => 73.8, "positiony" => 19.5, "rotation" => 270, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                            ["id" => 13, "positionx" => 73.8, "positiony" => 25, "rotation" => 270, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                            ["id" => 14, "positionx" => 73.8, "positiony" => 30.5, "rotation" => 270, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                            ["id" => 15, "positionx" => 73.8, "positiony" => 36, "rotation" => 270, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                            ["id" => 16, "positionx" => 73.8, "positiony" => 41.5, "rotation" => 270, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                            ["id" => 17, "positionx" => 73.8, "positiony" => 47, "rotation" => 270, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                            ["id" => 18, "positionx" => 77.5, "positiony" => 51.7, "rotation" => 180, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                        ]
                    ]]
                ],
                [
                    'floor_id' => $floor->id,
                    'name' => 'Room 5',
                    'data' => [
                        [
                            "id" => "E",
                            "name" => "Table E",
                            "chairs" => [
                                ["id" => 1, "positionx" => 19, "positiony" => 72, "rotation" => 90, "color" => 'gray', "booking_startdate" => Carbon::now(), "booking_enddate" => "", "booked" => 0, "duration" => 'day'],
                                ["id" => 2, "positionx" => 19, "positiony" => 78, "rotation" => 90, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ["id" => 3, "positionx" => 19, "positiony" => 84, "rotation" => 90, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                            ]
                        ],
                        [
                            "id" => "F",
                            "name" => "Table F",
                            "chairs" => [
                                ["id" => 1, "positionx" => 31.5, "positiony" => 59, "rotation" => 0, "color" => 'gray', "booking_startdate" => Carbon::now(), "booking_enddate" => "", "booked" => 0, "duration" => 'day'],
                                ["id" => 2, "positionx" => 36.2, "positiony" => 66, "rotation" => 90, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ["id" => 3, "positionx" => 27, "positiony" => 66, "rotation" => 270, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ["id" => 4, "positionx" => 31.5, "positiony" => 72.5, "rotation" => 180, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null]
                            ]
                        ],
                        [
                            "id" => "G",
                            "name" => "Table G",
                            "chairs" => [
                                ["id" => 1, "positionx" => 31.5, "positiony" => 80, "rotation" => 0, "color" => 'gray', "booking_startdate" => Carbon::now(), "booking_enddate" => "", "booked" => 0, "duration" => 24],
                                ["id" => 2, "positionx" => 36.2, "positiony" => 87, "rotation" => 90, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ["id" => 3, "positionx" => 27, "positiony" => 87, "rotation" => 270, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ["id" => 4, "positionx" => 31.5, "positiony" => 93.5, "rotation" => 180, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null]
                            ]
                        ]
                    ]
                ],
                [
                    'floor_id' => $floor->id,
                    'name' => 'Room 6',
                    'data' => [
                        [
                            "id" => "H",
                            "name" => "Table H",
                            "chairs" => [
                                ["id" => 1, "positionx" => 63.6, "positiony" => 72, "rotation" => 90, "color" => 'gray', "booking_startdate" => Carbon::now(), "booking_enddate" => "", "booked" => 1, "duration" => 'night'],
                                ["id" => 2, "positionx" => 63.6, "positiony" => 78, "rotation" => 90, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ["id" => 3, "positionx" => 63.6, "positiony" => 84, "rotation" => 90, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null]
                            ]
                        ],
                        [
                            "id" => "I",
                            "name" => "Table I",
                            "chairs" => [
                                ["id" => 1, "positionx" => 76, "positiony" => 59, "rotation" => 0, "color" => 'gray', "booking_startdate" => Carbon::now(), "booking_enddate" => "", "booked" => 0, "duration" => 24],
                                ["id" => 2, "positionx" => 80.7, "positiony" => 66, "rotation" => 90, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ["id" => 3, "positionx" => 71.7, "positiony" => 66, "rotation" => 270, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ["id" => 4, "positionx" => 76.5, "positiony" => 72.5, "rotation" => 180, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null]
                            ]
                        ],
                        [
                            "id" => "J",
                            "name" => "Table J",
                            "chairs" => [
                                ["id" => 1, "positionx" => 76, "positiony" => 80, "rotation" => 0, "color" => 'gray', "booking_startdate" => Carbon::now(), "booking_enddate" => "", "booked" => 0, "duration" => 'day'],
                                ["id" => 2, "positionx" => 80.7, "positiony" => 87, "rotation" => 90, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ["id" => 3, "positionx" => 71.7, "positiony" => 87, "rotation" => 270, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ["id" => 4, "positionx" => 76.5, "positiony" => 93.5, "rotation" => 180, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null]
                            ]
                        ]
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
