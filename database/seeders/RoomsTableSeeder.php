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
            if ($floor->id === 1) {
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
                                    ["id" => 2, "positionx" => 23, "positiony" => 11, "rotation" => 135, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 3, "positionx" => 16, "positiony" => 11, "rotation" => 225, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ]
                            ],
                            [
                                "id" => "B",
                                "name" => "Table B",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 36, "positiony" => 8.5, "rotation" => -45, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 2, "positionx" => 40.5, "positiony" => 11, "rotation" => 135, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 3, "positionx" => 34, "positiony" => 11.2, "rotation" => 225, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ]
                            ],
                            [
                                "id" => "C",
                                "name" => "Table C",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 14.8, "positiony" => 13.8, "rotation" => -45, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 2, "positionx" => 18, "positiony" => 16, "rotation" => 225, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 3, "positionx" => 23.8, "positiony" => 13.5, "rotation" => 45, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ]
                            ],
                            [
                                "id" => "D",
                                "name" => "Table D",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 33, "positiony" => 13, "rotation" => -45, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 2, "positionx" => 36.5, "positiony" => 15.8, "rotation" => 225, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 3, "positionx" => 42, "positiony" => 13.5, "rotation" => 45, "color" => 'gray', "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ]
                            ],
                            [
                                "id" => "F",
                                "name" => "Table 5",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 66, "positiony" => 8.7, "rotation" => 0, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 2, "positionx" => 70.5, "positiony" => 8.7, "rotation" => 0, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 3, "positionx" => 75, "positiony" => 8.7, "rotation" => 0, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 4, "positionx" => 61.5, "positiony" => 10, "rotation" => 270, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 5, "positionx" => 61.5, "positiony" => 12, "rotation" => 270, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 6, "positionx" => 61.5, "positiony" => 14, "rotation" => 270, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 7, "positionx" => 66, "positiony" => 15.3, "rotation" => 180, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 8, "positionx" => 70.5, "positiony" => 15.3, "rotation" => 180, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 9, "positionx" => 75, "positiony" => 15.3, "rotation" => 180, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 10, "positionx" => 79, "positiony" => 10, "rotation" => 90, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 11, "positionx" => 79, "positiony" => 12, "rotation" => 90, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 12, "positionx" => 79, "positiony" => 14, "rotation" => 90, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null]
                                ]
                            ],
                            [
                                "id" => "G",
                                "name" => "Table 6",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 69, "positiony" => 21, "rotation" => -45, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 2, "positionx" => 66.5, "positiony" => 23.5, "rotation" => 225, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 3, "positionx" => 73.5, "positiony" => 23.5, "rotation" => 135, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null]
                                ]
                            ],
                            [
                                "id" => "H",
                                "name" => "Table 7",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 25, "positiony" => 21, "rotation" => -45, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 2, "positionx" => 22.2, "positiony" => 23.5, "rotation" => 225, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 3, "positionx" => 29.5, "positiony" => 23.5, "rotation" => 135, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null]
                                ]
                            ],
                            [
                                "id" => "I",
                                "name" => "Table 8",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 24, "positiony" => 27.7, "rotation" => 0, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null]
                                ]
                            ],
                            [
                                "id" => "J",
                                "name" => "Table 9",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 29, "positiony" => 41, "rotation" => 90, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 2, "positionx" => 29, "positiony" => 43.5, "rotation" => 90, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 3, "positionx" => 17.5, "positiony" => 41, "rotation" => 270, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 4, "positionx" => 17.5, "positiony" => 43.5, "rotation" => 270, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null]
                                ]
                            ],
                            [
                                "id" => "K",
                                "name" => "Table 10",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 17, "positiony" => 47.4, "rotation" => 0, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 2, "positionx" => 24, "positiony" => 47.4, "rotation" => 0, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 3, "positionx" => 17, "positiony" => 51.5, "rotation" => 180, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 4, "positionx" => 24, "positiony" => 51.5, "rotation" => 180, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null]
                                ]
                            ],
                            [
                                "id" => 'L',
                                "name" => "Table 11",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 68, "positiony" => 35.8, "rotation" => 0, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 2, "positionx" => 64, "positiony" => 35.8, "rotation" => 0, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 3, "positionx" => 60, "positiony" => 35.8, "rotation" => 0, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 4, "positionx" => 68, "positiony" => 39.4, "rotation" => 180, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 5, "positionx" => 64, "positiony" => 39.4, "rotation" => 180, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 6, "positionx" => 60, "positiony" => 39.4, "rotation" => 180, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 7, "positionx" => 56, "positiony" => 37.5, "rotation" => 270, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 8, "positionx" => 72.5, "positiony" => 37.5, "rotation" => 90, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null]
                                ]
                            ],
                            [
                                "id" => "M",
                                "name" => "Table 12",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 83.2, "positiony" => 45.8, "rotation" => 270, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 2, "positionx" => 83.2, "positiony" => 48, "rotation" => 270, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 3, "positionx" => 71, "positiony" => 44, "rotation" => 180, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 4, "positionx" => 78, "positiony" => 44, "rotation" => 180, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null]
                                ]
                            ],
                            [
                                "id" => 'N',
                                "name" => "Table 13",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 69, "positiony" => 50.9, "rotation" => 0, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 2, "positionx" => 78, "positiony" => 50.9, "rotation" => 0, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 3, "positionx" => 69, "positiony" => 55, "rotation" => 180, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 4, "positionx" => 78, "positiony" => 55, "rotation" => 180, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null]
                                ]
                            ],
                            [
                                "id" => 'O',
                                "name" => "Table 14",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 84, "positiony" => 58, "rotation" => 270, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 2, "positionx" => 84, "positiony" => 60, "rotation" => 270, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 3, "positionx" => 75, "positiony" => 62.2, "rotation" => 0, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 4, "positionx" => 82, "positiony" => 62.2, "rotation" => 0, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null]
                                ]
                            ],
                        ]
                    ],
                    [
                        'floor_id' => $floor->id,
                        'name' => 'Caben',
                        'data' => [
                            [
                                "id" => "P",
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
            } else {
                $rooms = [
                    [
                        'floor_id' => $floor->id,
                        'name' => 'Chair',
                        'data' => [
                            [
                                "id" => 'A',
                                "name" => "Table 1",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 18, "positiony" => 9.2, "rotation" => -45, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 2, "positionx" => 23.5, "positiony" => 12, "rotation" => 135, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 3, "positionx" => 15, "positiony" => 12, "rotation" => 225, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ]
                            ],
                            [
                                "id" => 'B',
                                "name" => "Table 2",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 36, "positiony" => 9.1, "rotation" => -45, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 2, "positionx" => 42, "positiony" => 11.5, "rotation" => 135, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 3, "positionx" => 32.7, "positiony" => 12, "rotation" => 225, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ]
                            ],
                            [
                                "id" => 'C',
                                "name" => "Table 3",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 15.5, "positiony" => 14.5, "rotation" => -45, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 2, "positionx" => 18, "positiony" => 17.4, "rotation" => 225, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 3, "positionx" => 24, "positiony" => 14.5, "rotation" => 45, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ]
                            ],
                            [
                                "id" => 'D',
                                "name" => "Table 4",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 33, "positiony" => 14.5, "rotation" => -45, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 2, "positionx" => 36, "positiony" => 17, "rotation" => 225, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 3, "positionx" => 41, "positiony" => 14.5, "rotation" => 45, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ]
                            ],
                            [
                                "id" => 'E',
                                "name" => "Table 5",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 65, "positiony" => 9.6, "rotation" => 50, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 2, "positionx" => 74, "positiony" => 9.6, "rotation" => -49, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 3, "positionx" => 59.5, "positiony" => 12, "rotation" => 225, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 4, "positionx" => 66, "positiony" => 13, "rotation" => 135, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 5, "positionx" => 65, "positiony" => 16.8, "rotation" => 50, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 6, "positionx" => 59, "positiony" => 18.5, "rotation" => 225, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 7, "positionx" => 73.5, "positiony" => 16.8, "rotation" => -45, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 8, "positionx" => 79, "positiony" => 12, "rotation" => 135, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null]
                                ]
                            ],
                            [
                                "id" => 'F',
                                "name" => "Table 6",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 66, "positiony" => 20, "rotation" => 135, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 2, "positionx" => 72, "positiony" => 19.6, "rotation" => 225, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 3, "positionx" => 79, "positiony" => 19, "rotation" => 135, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ]
                            ],
                            [
                                "id" => 'G',
                                "name" => "Table 7",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 18, "positiony" => 21, "rotation" => 0, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 2, "positionx" => 26, "positiony" => 21, "rotation" => 0, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 3, "positionx" => 18, "positiony" => 25.5, "rotation" => 180, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 4, "positionx" => 26, "positiony" => 25.5, "rotation" => 180, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ]
                            ],
                            [
                                "id" => 'H',
                                "name" => "Table 8",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 26.5, "positiony" => 29.2, "rotation" => 0, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 2, "positionx" => 60, "positiony" => 37.8, "rotation" => 0, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 3, "positionx" => 64, "positiony" => 37.8, "rotation" => 0, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 4, "positionx" => 68, "positiony" => 37.8, "rotation" => 0, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 5, "positionx" => 60, "positiony" => 41.5, "rotation" => 180, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 6, "positionx" => 64, "positiony" => 41.5, "rotation" => 180, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 7, "positionx" => 68, "positiony" => 41.5, "rotation" => 180, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 8, "positionx" => 25.5, "positiony" => 53.3, "rotation" => 180, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 9, "positionx" => 17.5, "positiony" => 53.3, "rotation" => 180, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 10, "positionx" => 17.5, "positiony" => 50.5, "rotation" => 0, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 11, "positionx" => 25.5, "positiony" => 50.5, "rotation" => 0, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 12, "positionx" => 17, "positiony" => 45, "rotation" => 270, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 13, "positionx" => 17, "positiony" => 48, "rotation" => 270, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 14, "positionx" => 28, "positiony" => 45, "rotation" => 90, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 15, "positionx" => 28, "positiony" => 48, "rotation" => 90, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null]
                                ]
                            ],
                            [
                                "id" => 'I',
                                "name" => "Table 9",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 73, "positiony" => 46.2, "rotation" => 180, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 2, "positionx" => 79, "positiony" => 46.2, "rotation" => 180, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 3, "positionx" => 83.2, "positiony" => 48, "rotation" => 270, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 4, "positionx" => 83.2, "positiony" => 50, "rotation" => 270, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ]
                            ],
                            [
                                "id" => 'J',
                                "name" => "Table 10",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 69, "positiony" => 53.2, "rotation" => 0, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 2, "positionx" => 77, "positiony" => 53.2, "rotation" => 0, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 3, "positionx" => 69, "positiony" => 57.5, "rotation" => 180, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 4, "positionx" => 77, "positiony" => 57.5, "rotation" => 180, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                ]
                            ],
                            [
                                "id" => 'K',
                                "name" => "Table 11",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 81, "positiony" => 64.9, "rotation" => 0, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 2, "positionx" => 74, "positiony" => 64.9, "rotation" => 0, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 3, "positionx" => 83.5, "positiony" => 61, "rotation" => 270, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 4, "positionx" => 83.5, "positiony" => 63, "rotation" => 270, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null]
                                ]
                            ]
                        ]
                    ],
                    [
                        'floor_id' => $floor->id,
                        'name' => 'Caben',
                        'data' => [
                            [
                                "id" => "L",
                                "name" => "Cabins",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 17, "positiony" => 4, "rotation" => 200, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 2, "positionx" => 30, "positiony" => 4, "rotation" => 160, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 3, "positionx" => 39, "positiony" => 4, "rotation" => 160, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 4, "positionx" => 52, "positiony" => 4, "rotation" => 160, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 5, "positionx" => 61, "positiony" => 4, "rotation" => 160, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 6, "positionx" => 70, "positiony" => 4, "rotation" => 160, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 7, "positionx" => 79, "positiony" => 4, "rotation" => 160, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 8, "positionx" => 74, "positiony" => 31.5, "rotation" => 40, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 9, "positionx" => 65, "positiony" => 31.5, "rotation" => 40, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null],
                                    ["id" => 10, "positionx" => 57, "positiony" => 31.5, "rotation" => 40, "color" => "gray", "booking_startdate" => "", "booking_enddate" => "", "booked" => 0, "duration" => null]
                                ]
                            ]
                        ]
                    ]
                ];
            }

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
