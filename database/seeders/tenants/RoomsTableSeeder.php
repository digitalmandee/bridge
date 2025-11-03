<?php

namespace Database\Seeders\Tenants;

use App\Models\Chair;
use App\Models\Floor;
use App\Models\Room;
use App\Models\Table;
use Illuminate\Database\Seeder;

class RoomsTableSeeder extends Seeder
{
    public function run()
    {
        $floors = Floor::all();
        foreach ($floors as $floor) {
            $floorId = $floor->id;
            $rooms = [];
            if ($floorId == 1) {
                $rooms = [
                    [
                        'floor_id' => $floor->id,
                        'name' => 'Room 1',
                        'data' => [[
                            'id' => 'A',
                            'name' => 'Table A',
                            'chairs' => [
                                ['id' => 1, 'positionx' => 15, 'positiony' => 5.5, 'rotation' => 0],
                                ['id' => 2, 'positionx' => 19, 'positiony' => 5.5, 'rotation' => 0],
                                ['id' => 3, 'positionx' => 23, 'positiony' => 5.5, 'rotation' => 0],
                                ['id' => 4, 'positionx' => 15, 'positiony' => 10.2, 'rotation' => 180],
                                ['id' => 5, 'positionx' => 19, 'positiony' => 10.2, 'rotation' => 180],
                                ['id' => 6, 'positionx' => 23, 'positiony' => 10.2, 'rotation' => 180],
                                ['id' => 7, 'positionx' => 31, 'positiony' => 7.8, 'rotation' => 90],
                            ]
                        ]]
                    ],
                    [
                        'floor_id' => $floor->id,
                        'name' => 'Room 2',
                        'data' => [[
                            'id' => 'B',
                            'name' => 'Table B',
                            'chairs' => [
                                ['id' => 1, 'positionx' => 17, 'positiony' => 14.5, 'rotation' => 0],
                                ['id' => 2, 'positionx' => 21, 'positiony' => 14.5, 'rotation' => 0],
                                ['id' => 3, 'positionx' => 25, 'positiony' => 14.5, 'rotation' => 0],
                                ['id' => 4, 'positionx' => 17, 'positiony' => 19.1, 'rotation' => 180],
                                ['id' => 5, 'positionx' => 21, 'positiony' => 19.1, 'rotation' => 180],
                                ['id' => 6, 'positionx' => 25, 'positiony' => 19.1, 'rotation' => 180],
                                ['id' => 7, 'positionx' => 32.5, 'positiony' => 17, 'rotation' => 90],
                            ]
                        ]]
                    ],
                    [
                        'floor_id' => $floor->id,
                        'name' => 'Room 3',
                        'data' => [[
                            'id' => 'C',
                            'name' => 'Table C',
                            'chairs' => [
                                ['id' => 1, 'positionx' => 46.5, 'positiony' => 13, 'rotation' => -90],
                                ['id' => 2, 'positionx' => 46.5, 'positiony' => 10, 'rotation' => 270],
                                ['id' => 3, 'positionx' => 55.5, 'positiony' => 10, 'rotation' => 90],
                                ['id' => 4, 'positionx' => 55.5, 'positiony' => 13, 'rotation' => 90],
                                ['id' => 5, 'positionx' => 51, 'positiony' => 15, 'rotation' => 180],
                            ]
                        ]]
                    ],
                    [
                        'floor_id' => $floor->id,
                        'name' => 'Room 4',
                        'data' => [[
                            'id' => 'D',
                            'name' => 'Table D',
                            'chairs' => [
                                ['id' => 1, 'positionx' => 70, 'positiony' => 5.5, 'rotation' => -90],
                                ['id' => 2, 'positionx' => 70, 'positiony' => 7.8, 'rotation' => -90],
                                ['id' => 3, 'positionx' => 70, 'positiony' => 10, 'rotation' => -90],
                                ['id' => 4, 'positionx' => 70, 'positiony' => 12.2, 'rotation' => -90],
                                ['id' => 5, 'positionx' => 70, 'positiony' => 14.5, 'rotation' => -90],
                                ['id' => 6, 'positionx' => 80, 'positiony' => 5.5, 'rotation' => 90],
                                ['id' => 7, 'positionx' => 80, 'positiony' => 7.8, 'rotation' => 90],
                                ['id' => 8, 'positionx' => 80, 'positiony' => 10, 'rotation' => 90],
                                ['id' => 9, 'positionx' => 80, 'positiony' => 12.2, 'rotation' => 90],
                                ['id' => 10, 'positionx' => 80, 'positiony' => 14.5, 'rotation' => 90],
                                ['id' => 11, 'positionx' => 75, 'positiony' => 19, 'rotation' => 180],
                                ['id' => 12, 'positionx' => 65, 'positiony' => 24, 'rotation' => 180],
                                ['id' => 13, 'positionx' => 71, 'positiony' => 24, 'rotation' => 180],
                                ['id' => 14, 'positionx' => 77, 'positiony' => 24, 'rotation' => 180],
                                ['id' => 15, 'positionx' => 83, 'positiony' => 24, 'rotation' => 180],
                                ['id' => 16, 'positionx' => 71, 'positiony' => 27.5, 'rotation' => 0],
                                ['id' => 17, 'positionx' => 77.5, 'positiony' => 27.5, 'rotation' => 0],
                                ['id' => 18, 'positionx' => 84, 'positiony' => 27.5, 'rotation' => 0],
                                ['id' => 19, 'positionx' => 84, 'positiony' => 33.5, 'rotation' => 180],
                                ['id' => 20, 'positionx' => 77.5, 'positiony' => 33.5, 'rotation' => 180],
                                ['id' => 21, 'positionx' => 71, 'positiony' => 33.5, 'rotation' => 180],
                                ['id' => 22, 'positionx' => 84, 'positiony' => 36.5, 'rotation' => 0],
                                ['id' => 23, 'positionx' => 77.5, 'positiony' => 36.5, 'rotation' => 0],
                                ['id' => 24, 'positionx' => 71, 'positiony' => 36.5, 'rotation' => 0],
                                ['id' => 25, 'positionx' => 84, 'positiony' => 42.5, 'rotation' => 180],
                                ['id' => 26, 'positionx' => 77.5, 'positiony' => 42.5, 'rotation' => 180],
                                ['id' => 27, 'positionx' => 71, 'positiony' => 42.5, 'rotation' => 180],
                            ]
                        ]]
                    ],
                    [
                        'floor_id' => $floor->id,
                        'name' => 'Room 5',
                        'data' => [
                            [
                                'id' => 'E',
                                'name' => 'Table E',
                                'chairs' => [
                                    ['id' => 1, 'positionx' => 30, 'positiony' => 54.3, 'rotation' => 82],
                                    ['id' => 2, 'positionx' => 31, 'positiony' => 58, 'rotation' => 82],
                                    ['id' => 3, 'positionx' => 32, 'positiony' => 62, 'rotation' => 82],
                                    ['id' => 4, 'positionx' => 33, 'positiony' => 65, 'rotation' => 82],
                                    ['id' => 5, 'positionx' => 34, 'positiony' => 69, 'rotation' => 82],
                                    ['id' => 6, 'positionx' => 35, 'positiony' => 73, 'rotation' => 82],
                                    ['id' => 7, 'positionx' => 36, 'positiony' => 77, 'rotation' => 82],
                                    ['id' => 8, 'positionx' => 37, 'positiony' => 80.5, 'rotation' => 82],
                                    ['id' => 9, 'positionx' => 38, 'positiony' => 84, 'rotation' => 82],
                                    ['id' => 10, 'positionx' => 43, 'positiony' => 86.3, 'rotation' => 0],
                                    ['id' => 11, 'positionx' => 51, 'positiony' => 86.3, 'rotation' => 0],
                                    ['id' => 12, 'positionx' => 59, 'positiony' => 86.3, 'rotation' => 0],
                                ]
                            ],
                            [
                                'id' => 'F',
                                'name' => 'Table F',
                                'chairs' => [
                                    ['id' => 1, 'positionx' => 38.5, 'positiony' => 55, 'rotation' => -90],
                                    ['id' => 2, 'positionx' => 38.5, 'positiony' => 58.3, 'rotation' => -90],
                                    ['id' => 3, 'positionx' => 38.5, 'positiony' => 62, 'rotation' => -90],
                                    ['id' => 4, 'positionx' => 38.5, 'positiony' => 65, 'rotation' => -90],
                                    ['id' => 5, 'positionx' => 50, 'positiony' => 65, 'rotation' => 90],
                                    ['id' => 6, 'positionx' => 50, 'positiony' => 61.5, 'rotation' => 90],
                                    ['id' => 7, 'positionx' => 50, 'positiony' => 58, 'rotation' => 90],
                                    ['id' => 8, 'positionx' => 50, 'positiony' => 55, 'rotation' => 90],
                                ]
                            ],
                            [
                                'id' => 'G',
                                'name' => 'Table G',
                                'chairs' => [
                                    ['id' => 1, 'positionx' => 58, 'positiony' => 52, 'rotation' => -90],
                                    ['id' => 2, 'positionx' => 58, 'positiony' => 55, 'rotation' => -90],
                                    ['id' => 3, 'positionx' => 58, 'positiony' => 58, 'rotation' => -90],
                                    ['id' => 4, 'positionx' => 58, 'positiony' => 61.5, 'rotation' => -90],
                                    ['id' => 5, 'positionx' => 58, 'positiony' => 65, 'rotation' => -90],
                                ]
                            ]
                        ]
                    ],
                    [
                        'floor_id' => $floor->id,
                        'name' => 'Room 6',
                        'data' => [
                            [
                                'id' => 'H',
                                'name' => 'Table H',
                                'chairs' => [
                                    ['id' => 1, 'positionx' => 60, 'positiony' => 68, 'rotation' => 0],
                                    ['id' => 2, 'positionx' => 54, 'positiony' => 68, 'rotation' => 0],
                                    ['id' => 3, 'positionx' => 43, 'positiony' => 68, 'rotation' => 0],
                                    ['id' => 4, 'positionx' => 43, 'positiony' => 74, 'rotation' => 180],
                                    ['id' => 5, 'positionx' => 54, 'positiony' => 74, 'rotation' => 180],
                                    ['id' => 6, 'positionx' => 60, 'positiony' => 74, 'rotation' => 180],
                                ]
                            ],
                            [
                                'id' => 'I',
                                'name' => 'Table I',
                                'chairs' => [
                                    ['id' => 1, 'positionx' => 47, 'positiony' => 77, 'rotation' => 0],
                                    ['id' => 2, 'positionx' => 54, 'positiony' => 77, 'rotation' => 0],
                                    ['id' => 3, 'positionx' => 60, 'positiony' => 77, 'rotation' => 0],
                                    ['id' => 4, 'positionx' => 60, 'positiony' => 83, 'rotation' => 180],
                                    ['id' => 5, 'positionx' => 54, 'positiony' => 83, 'rotation' => 180],
                                    ['id' => 6, 'positionx' => 47, 'positiony' => 83, 'rotation' => 180],
                                ]
                            ],
                        ]
                    ]
                ];
            } elseif ($floorId == 2) {
                $rooms = [
                    [
                        'floor_id' => $floor->id,
                        'name' => 'Room 1',
                        'data' => [[
                            'id' => 'A',
                            'name' => 'Table A',
                            'chairs' => [
                                ['id' => 1, 'positionx' => 15, 'positiony' => 6.5, 'rotation' => 0],
                                ['id' => 2, 'positionx' => 19, 'positiony' => 6.5, 'rotation' => 0],
                                ['id' => 3, 'positionx' => 23, 'positiony' => 6.5, 'rotation' => 0],
                                ['id' => 4, 'positionx' => 15, 'positiony' => 11.2, 'rotation' => 180],
                                ['id' => 5, 'positionx' => 19, 'positiony' => 11.2, 'rotation' => 180],
                                ['id' => 6, 'positionx' => 23, 'positiony' => 11.2, 'rotation' => 180],
                                ['id' => 7, 'positionx' => 31, 'positiony' => 8.8, 'rotation' => 90]
                            ]
                        ]]
                    ],
                    [
                        'floor_id' => $floor->id,
                        'name' => 'Room 2',
                        'data' => [[
                            'id' => 'B',
                            'name' => 'Table B',
                            'chairs' => [
                                ['id' => 1, 'positionx' => 17, 'positiony' => 15.5, 'rotation' => 0],
                                ['id' => 2, 'positionx' => 21, 'positiony' => 15.5, 'rotation' => 0],
                                ['id' => 3, 'positionx' => 25, 'positiony' => 15.5, 'rotation' => 0],
                                ['id' => 4, 'positionx' => 17, 'positiony' => 20.2, 'rotation' => 180],
                                ['id' => 5, 'positionx' => 21, 'positiony' => 20.2, 'rotation' => 180],
                                ['id' => 6, 'positionx' => 25, 'positiony' => 20.2, 'rotation' => 180],
                                ['id' => 7, 'positionx' => 33, 'positiony' => 18, 'rotation' => 90]
                            ]
                        ]]
                    ],
                    [
                        'floor_id' => $floor->id,
                        'name' => 'Room 3',
                        'data' => [[
                            'id' => 'C',
                            'name' => 'Table C',
                            'chairs' => [
                                ['id' => 1, 'positionx' => 51.5, 'positiony' => 9.8, 'rotation' => -150],
                                ['id' => 2, 'positionx' => 50.5, 'positiony' => 6, 'rotation' => -50],
                                ['id' => 3, 'positionx' => 58.5, 'positiony' => 6, 'rotation' => 50],
                                ['id' => 4, 'positionx' => 58.5, 'positiony' => 9.8, 'rotation' => 120]
                            ]
                        ]]
                    ],
                    [
                        'floor_id' => $floor->id,
                        'name' => 'Room 4',
                        'data' => [[
                            'id' => 'D',
                            'name' => 'Table D',
                            'chairs' => [
                                ['id' => 1, 'positionx' => 70, 'positiony' => 9, 'rotation' => -90],
                                ['id' => 2, 'positionx' => 70, 'positiony' => 11.5, 'rotation' => -90],
                                ['id' => 3, 'positionx' => 70, 'positiony' => 14, 'rotation' => -90],
                                ['id' => 4, 'positionx' => 70, 'positiony' => 16.3, 'rotation' => -90],
                                ['id' => 5, 'positionx' => 70, 'positiony' => 18.8, 'rotation' => -90],
                                ['id' => 6, 'positionx' => 80, 'positiony' => 9, 'rotation' => 90],
                                ['id' => 7, 'positionx' => 80, 'positiony' => 11.5, 'rotation' => 90],
                                ['id' => 8, 'positionx' => 80, 'positiony' => 14, 'rotation' => 90],
                                ['id' => 9, 'positionx' => 80, 'positiony' => 16.5, 'rotation' => 90],
                                ['id' => 10, 'positionx' => 80, 'positiony' => 19, 'rotation' => 90],
                                ['id' => 11, 'positionx' => 75, 'positiony' => 20.5, 'rotation' => 180],
                                ['id' => 12, 'positionx' => 69, 'positiony' => 32.8, 'rotation' => -45],
                                ['id' => 13, 'positionx' => 69, 'positiony' => 35.5, 'rotation' => -135],
                                ['id' => 14, 'positionx' => 75, 'positiony' => 32.5, 'rotation' => 45],
                                ['id' => 15, 'positionx' => 74.5, 'positiony' => 35.5, 'rotation' => 130],
                                ['id' => 16, 'positionx' => 74.5, 'positiony' => 42.8, 'rotation' => 130],
                                ['id' => 17, 'positionx' => 69, 'positiony' => 39.5, 'rotation' => -45],
                                ['id' => 18, 'positionx' => 75, 'positiony' => 39.5, 'rotation' => 45],
                                ['id' => 19, 'positionx' => 68.5, 'positiony' => 42.5, 'rotation' => 225],
                                ['id' => 20, 'positionx' => 62, 'positiony' => 38, 'rotation' => 180],
                                ['id' => 21, 'positionx' => 62, 'positiony' => 33.5, 'rotation' => 0]
                            ]
                        ]]
                    ],
                    [
                        'floor_id' => $floor->id,
                        'name' => 'Room 5',
                        'data' => [[
                            'id' => 'E',
                            'name' => 'Table E',
                            'chairs' => [
                                ['id' => 1, 'positionx' => 30, 'positiony' => 55.8, 'rotation' => 82],
                                ['id' => 2, 'positionx' => 31, 'positiony' => 59, 'rotation' => 82],
                                ['id' => 3, 'positionx' => 32, 'positiony' => 62.5, 'rotation' => 82],
                                ['id' => 4, 'positionx' => 33, 'positiony' => 66.1, 'rotation' => 82],
                                ['id' => 5, 'positionx' => 34, 'positiony' => 69, 'rotation' => 82],
                                ['id' => 6, 'positionx' => 35, 'positiony' => 74, 'rotation' => 82],
                                ['id' => 7, 'positionx' => 36, 'positiony' => 77.4, 'rotation' => 82],
                                ['id' => 8, 'positionx' => 37, 'positiony' => 80.9, 'rotation' => 82],
                                ['id' => 9, 'positionx' => 38, 'positiony' => 85, 'rotation' => 82],
                                ['id' => 10, 'positionx' => 43, 'positiony' => 86.3, 'rotation' => 0]
                            ]
                        ]]
                    ]
                ];
            }

            foreach ($rooms as $room) {
                $newroom = Room::firstOrCreate([
                    'floor_id' => $room['floor_id'],
                    'name' => $room['name'],
                ]);
                foreach ($room['data'] as $table) {
                    $newtable = Table::firstOrCreate([
                        'floor_id' => $room['floor_id'],
                        'room_id' => $newroom->id,
                        'table_id' => $table['id'],
                        'name' => $table['name'],
                    ]);
                    foreach ($table['chairs'] as $chair) {
                        Chair::firstOrCreate([
                            'floor_id' => $room['floor_id'],
                            'room_id' => $newroom->id,
                            'table_id' => $newtable->id,
                            'chair_id' => $chair['id'],
                            'positionx' => $chair['positionx'],
                            'positiony' => $chair['positiony'],
                            'rotation' => $chair['rotation'],
                        ]);
                    }
                }
            }
        }
    }
}
