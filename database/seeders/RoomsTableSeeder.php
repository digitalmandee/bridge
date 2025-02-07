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
                                    ["id" => 1, "positionx" => 16, "positiony" => 8, "rotation" => 270, "color" => "gray"],
                                    ["id" => 2, "positionx" => 27, "positiony" => 11, "rotation" => 90, "color" => "gray"],
                                    ["id" => 3, "positionx" => 16, "positiony" => 11, "rotation" => 270, "color" => "gray"],
                                    ["id" => 4, "positionx" => 27, "positiony" => 8, "rotation" => 90, "color" => "gray"]
                                ]
                            ],
                            [
                                "id" => "B",
                                "name" => "Table B",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 39, "positiony" => 8, "rotation" => 270, "color" => "gray"],
                                    ["id" => 2, "positionx" => 39, "positiony" => 10, "rotation" => 270, "color" => "gray"],
                                    ["id" => 3, "positionx" => 39, "positiony" => 12, "rotation" => 270, "color" => "gray"],
                                    ["id" => 4, "positionx" => 39, "positiony" => 14, "rotation" => 270, "color" => "gray"]
                                ]
                            ],
                            [
                                "id" => "C",
                                "name" => "Table C",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 16, "positiony" => 14, "rotation" => 270, "color" => "gray"],
                                    ["id" => 2, "positionx" => 16, "positiony" => 17, "rotation" => 270, "color" => "gray"],
                                    ["id" => 3, "positionx" => 26, "positiony" => 17, "rotation" => 90, "color" => "gray"],
                                    ["id" => 4, "positionx" => 26, "positiony" => 14, "rotation" => 90, "color" => "gray"]
                                ]
                            ],
                            [
                                "id" => "D",
                                "name" => "DED Chairs",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 68, "positiony" => 4.2, "rotation" => 180, "color" => "gray"],
                                    ["id" => 2, "positionx" => 72.2, "positiony" => 4.2, "rotation" => 180, "color" => "gray"],
                                    ["id" => 3, "positionx" => 76.5, "positiony" => 4.2, "rotation" => 180, "color" => "gray"]
                                ]
                            ],
                            [
                                "id" => "E",
                                "name" => "Table 4",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 62, "positiony" => 8, "rotation" => 0, "color" => "gray"],
                                    ["id" => 2, "positionx" => 66.5, "positiony" => 8, "rotation" => 0, "color" => "gray"],
                                    ["id" => 3, "positionx" => 71, "positiony" => 8, "rotation" => 0, "color" => "gray"],
                                    ["id" => 4, "positionx" => 57.8, "positiony" => 9.5, "rotation" => 270, "color" => "gray"],
                                    ["id" => 5, "positionx" => 57.8, "positiony" => 11.2, "rotation" => 270, "color" => "gray"],
                                    ["id" => 6, "positionx" => 57.8, "positiony" => 13, "rotation" => 270, "color" => "gray"],
                                    ["id" => 7, "positionx" => 75, "positiony" => 9.5, "rotation" => 90, "color" => "gray"],
                                    ["id" => 8, "positionx" => 75, "positiony" => 11.3, "rotation" => 90, "color" => "gray"],
                                    ["id" => 9, "positionx" => 75, "positiony" => 13, "rotation" => 90, "color" => "gray"],
                                    ["id" => 10, "positionx" => 62, "positiony" => 14.8, "rotation" => 180, "color" => "gray"],
                                    ["id" => 11, "positionx" => 66.5, "positiony" => 14.8, "rotation" => 180, "color" => "gray"],
                                    ["id" => 12, "positionx" => 71, "positiony" => 14.8, "rotation" => 180, "color" => "gray"]
                                ]
                            ],
                            [
                                "id" => "F",
                                "name" => "Table 7",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 15, "positiony" => 20.2, "rotation" => -56, "color" => "gray"],
                                    ["id" => 2, "positionx" => 18.5, "positiony" => 23.2, "rotation" => 225, "color" => "gray"],
                                    ["id" => 3, "positionx" => 30, "positiony" => 23.2, "rotation" => 135, "color" => "gray"],
                                    ["id" => 4, "positionx" => 24, "positiony" => 20, "rotation" => 0, "color" => "gray"]
                                ]
                            ],
                            [
                                "id" => "G",
                                "name" => "Executive office",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 25, "positiony" => 27, "rotation" => 0, "color" => "gray"],
                                ]
                            ],
                            [
                                "id" => "H",
                                "name" => "Table 8",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 29, "positiony" => 38.5, "rotation" => 90, "color" => "gray"],
                                    ["id" => 2, "positionx" => 17.5, "positiony" => 38.5, "rotation" => 270, "color" => "gray"],
                                    ["id" => 3, "positionx" => 17.5, "positiony" => 41, "rotation" => 270, "color" => "gray"],
                                    ["id" => 4, "positionx" => 29, "positiony" => 41, "rotation" => 90, "color" => "gray"]
                                ]
                            ],
                            [
                                "id" => "I",
                                "name" => "Table 9",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 24, "positiony" => 44.5, "rotation" => 0, "color" => "gray"],
                                    ["id" => 2, "positionx" => 17, "positiony" => 48.5, "rotation" => 180, "color" => "gray"],
                                    ["id" => 3, "positionx" => 24, "positiony" => 48.5, "rotation" => 180, "color" => "gray"],
                                    ["id" => 4, "positionx" => 17, "positiony" => 44.5, "rotation" => 0, "color" => "gray"]
                                ]
                            ],
                            [
                                "id" => "J",
                                "name" => "Table 10",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 62, "positiony" => 18.5, "rotation" => 0, "color" => "gray"],
                                    ["id" => 2, "positionx" => 66.5, "positiony" => 18.5, "rotation" => 0, "color" => "gray"],
                                    ["id" => 3, "positionx" => 71, "positiony" => 18.5, "rotation" => 0, "color" => "gray"],

                                    ["id" => 4, "positionx" => 57.8, "positiony" => 20, "rotation" => 270, "color" => "gray"],
                                    ["id" => 5, "positionx" => 57.8, "positiony" => 21.8, "rotation" => 270, "color" => "gray"],
                                    ["id" => 6, "positionx" => 57.8, "positiony" => 23.6, "rotation" => 270, "color" => "gray"],

                                    ["id" => 7, "positionx" => 75, "positiony" => 20, "rotation" => 90, "color" => "gray"],
                                    ["id" => 8, "positionx" => 75, "positiony" => 21.8, "rotation" => 90, "color" => "gray"],
                                    ["id" => 9, "positionx" => 75, "positiony" => 23.6, "rotation" => 90, "color" => "gray"],

                                    ["id" => 10, "positionx" => 62, "positiony" => 25, "rotation" => 180, "color" => "gray"],
                                    ["id" => 11, "positionx" => 66.5, "positiony" => 25, "rotation" => 180, "color" => "gray"],
                                    ["id" => 12, "positionx" => 71, "positiony" => 25, "rotation" => 180, "color" => "gray"]
                                ]
                            ],
                            [
                                "id" => 'K',
                                "name" => "Table 11 DED",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 54.5, "positiony" => 42.2, "rotation" => 90, "color" => "gray"],
                                    ["id" => 2, "positionx" => 54.5, "positiony" => 44, "rotation" => 90, "color" => "gray"],
                                    ["id" => 3, "positionx" => 54.5, "positiony" => 46, "rotation" => 90, "color" => "gray"],
                                    ["id" => 4, "positionx" => 54.5, "positiony" => 48, "rotation" => 90, "color" => "gray"]
                                ]
                            ],
                            [
                                "id" => "L",
                                "name" => "Table 12 Small Office 1",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 67, "positiony" => 43, "rotation" => 180, "color" => "gray"],
                                    ["id" => 2, "positionx" => 72, "positiony" => 43, "rotation" => 180, "color" => "gray"],
                                    ["id" => 3, "positionx" => 74.5, "positiony" => 44.2, "rotation" => 270, "color" => "gray"],
                                    ["id" => 4, "positionx" => 74.5, "positiony" => 45.9, "rotation" => 270, "color" => "gray"]
                                ]
                            ],
                            [
                                "id" => 'M',
                                "name" => "Table 13",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 69, "positiony" => 48.5, "rotation" => 0, "color" => "gray"],
                                    ["id" => 2, "positionx" => 75, "positiony" => 48.5, "rotation" => 0, "color" => "gray"],
                                    ["id" => 3, "positionx" => 69, "positiony" => 52.7, "rotation" => 180, "color" => "gray"],
                                    ["id" => 4, "positionx" => 75, "positiony" => 52.7, "rotation" => 180, "color" => "gray"]
                                ]
                            ],
                            [
                                "id" => 'N',
                                "name" => "Table 14 Small Office 2",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 73.5, "positiony" => 55, "rotation" => 270, "color" => "gray"],
                                    ["id" => 2, "positionx" => 73.5, "positiony" => 57, "rotation" => 270, "color" => "gray"],
                                    ["id" => 3, "positionx" => 67, "positiony" => 58.6, "rotation" => 0, "color" => "gray"],
                                    ["id" => 4, "positionx" => 72, "positiony" => 58.6, "rotation" => 0, "color" => "gray"]
                                ]
                            ],
                        ]
                    ],
                    [
                        'floor_id' => $floor->id,
                        'name' => 'Caben',
                        'data' => [
                            [
                                "id" => "O",
                                "name" => "Cabin",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 15, "positiony" => 4, "rotation" => 180, "color" => "gray"],
                                ]
                            ],
                            [
                                "id" => "P",
                                "name" => "Cabin",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 23, "positiony" => 4, "rotation" => 180, "color" => "gray"],
                                ]
                            ],
                            [
                                "id" => "Q",
                                "name" => "Cabin",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 31, "positiony" => 4, "rotation" => 180, "color" => "gray"],
                                ]
                            ],
                            [
                                "id" => "R",
                                "name" => "Cabin",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 40, "positiony" => 4, "rotation" => 180, "color" => "gray"],
                                ]
                            ],
                            [
                                "id" => "S",
                                "name" => "Cabin",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 50, "positiony" => 3.5, "rotation" => 180, "color" => "gray"],
                                ]
                            ],
                            [
                                "id" => "T",
                                "name" => "Cabin",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 46.5, "positiony" => 8, "rotation" => 90, "color" => "gray"],
                                ]
                            ],
                            [
                                "id" => "U",
                                "name" => "Cabin",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 46.5, "positiony" => 11, "rotation" => 90, "color" => "gray"],
                                ]
                            ],
                            [
                                "id" => "V",
                                "name" => "Cabin",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 47, "positiony" => 14.5, "rotation" => 90, "color" => "gray"],
                                ]
                            ],
                            [
                                "id" => "W",
                                "name" => "Cabin",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 69.5, "positiony" => 31.5, "rotation" => 0, "color" => "gray"],
                                ]
                            ],
                            [
                                "id" => "X",
                                "name" => "Cabin",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 62, "positiony" => 31.5, "rotation" => 0, "color" => "gray"],
                                ]
                            ],
                            [
                                "id" => "Y",
                                "name" => "Cabin",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 54, "positiony" => 31.5, "rotation" => 0, "color" => "gray"],
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
                                    ["id" => 1, "positionx" => 20, "positiony" => 9.6, "rotation" => 0, "color" => "gray"],
                                    ["id" => 2, "positionx" => 24.5, "positiony" => 9.6, "rotation" => 0, "color" => "gray"],
                                    ["id" => 3, "positionx" => 29, "positiony" => 9.6, "rotation" => 0, "color" => "gray"],

                                    ["id" => 4, "positionx" => 16, "positiony" => 11, "rotation" => 270, "color" => "gray"],
                                    ["id" => 5, "positionx" => 16, "positiony" => 12.9, "rotation" => 270, "color" => "gray"],
                                    ["id" => 6, "positionx" => 16, "positiony" => 14.8, "rotation" => 270, "color" => "gray"],

                                    ["id" => 7, "positionx" => 20, "positiony" => 16.2, "rotation" => 180, "color" => "gray"],
                                    ["id" => 8, "positionx" => 24.5, "positiony" => 16.2, "rotation" => 180, "color" => "gray"],
                                    ["id" => 9, "positionx" => 29, "positiony" => 16.2, "rotation" => 180, "color" => "gray"],

                                    ["id" => 10, "positionx" => 32.5, "positiony" => 11, "rotation" => 90, "color" => "gray"],
                                    ["id" => 11, "positionx" => 32.5, "positiony" => 12.9, "rotation" => 90, "color" => "gray"],
                                    ["id" => 12, "positionx" => 32.5, "positiony" => 14.8, "rotation" => 90, "color" => "gray"]
                                ]
                            ],
                            [
                                "id" => 'B',
                                "name" => "Table 2",
                                "chairs" => [
                                    ["id" => 13, "positionx" => 41, "positiony" => 11.3, "rotation" => 0, "color" => "gray"],
                                    ["id" => 14, "positionx" => 41, "positiony" => 15, "rotation" => 180, "color" => "gray"]
                                ]
                            ],
                            [
                                "id" => 'C',
                                "name" => "Table 3",
                                "chairs" => [
                                    ["id" => 15, "positionx" => 68, "positiony" => 5.2, "rotation" => 180, "color" => "gray"],
                                    ["id" => 16, "positionx" => 72, "positiony" => 5.2, "rotation" => 180, "color" => "gray"],
                                    ["id" => 17, "positionx" => 76, "positiony" => 5.2, "rotation" => 180, "color" => "gray"]
                                ]
                            ],
                            [
                                "id" => 'D',
                                "name" => "Table 4",
                                "chairs" => [
                                    ["id" => 18, "positionx" => 57.8, "positiony" => 10.5, "rotation" => 270, "color" => "gray"],
                                    ["id" => 19, "positionx" => 57.8, "positiony" => 12.2, "rotation" => 270, "color" => "gray"],
                                    ["id" => 20, "positionx" => 57.8, "positiony" => 14, "rotation" => 270, "color" => "gray"],
                                    ["id" => 21, "positionx" => 62, "positiony" => 15.4, "rotation" => 180, "color" => "gray"],
                                    ["id" => 22, "positionx" => 66.5, "positiony" => 15.4, "rotation" => 180, "color" => "gray"],
                                    ["id" => 23, "positionx" => 71, "positiony" => 15.4, "rotation" => 180, "color" => "gray"],
                                    ["id" => 24, "positionx" => 75, "positiony" => 10.5, "rotation" => 90, "color" => "gray"],
                                    ["id" => 25, "positionx" => 75, "positiony" => 12.2, "rotation" => 90, "color" => "gray"],
                                    ["id" => 26, "positionx" => 75, "positiony" => 14, "rotation" => 90, "color" => "gray"],
                                    ["id" => 27, "positionx" => 62, "positiony" => 9, "rotation" => 0, "color" => "gray"],
                                    ["id" => 28, "positionx" => 66.5, "positiony" => 9, "rotation" => 0, "color" => "gray"],
                                    ["id" => 29, "positionx" => 71, "positiony" => 9, "rotation" => 0, "color" => "gray"]
                                ]
                            ],
                            [
                                "id" => 'E',
                                "name" => "Table 5",
                                "chairs" => [
                                    ["id" => 30, "positionx" => 59, "positiony" => 22, "rotation" => 290, "color" => "gray"],
                                    ["id" => 31, "positionx" => 64.5, "positiony" => 25.7, "rotation" => 180, "color" => "gray"],
                                    ["id" => 32, "positionx" => 73.5, "positiony" => 25.5, "rotation" => 120, "color" => "gray"],
                                    ["id" => 33, "positionx" => 69.8, "positiony" => 22, "rotation" => 50, "color" => "gray"],
                                    ["id" => 34, "positionx" => 64.3, "positiony" => 19.5, "rotation" => 0, "color" => "gray"]
                                ]
                            ],
                            [
                                "id" => 'F',
                                "name" => "Table 6",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 15.3, "positiony" => 21, "rotation" => -60, "color" => "gray"],
                                    ["id" => 2, "positionx" => 24.5, "positiony" => 20.5, "rotation" => 0, "color" => "gray"],
                                    ["id" => 3, "positionx" => 18.5, "positiony" => 24, "rotation" => 230, "color" => "gray"],
                                    ["id" => 4, "positionx" => 30, "positiony" => 24, "rotation" => 120, "color" => "gray"]
                                ]
                            ],
                            [
                                "id" => 'G',
                                "name" => "Table 7",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 22, "positiony" => 29.5, "rotation" => -40, "color" => "gray"],
                                    ["id" => 2, "positionx" => 31, "positiony" => 31.5, "rotation" => 100, "color" => "gray"],
                                    ["id" => 3, "positionx" => 21.5, "positiony" => 33.5, "rotation" => 210, "color" => "gray"]
                                ]
                            ],
                            [
                                "id" => 'H',
                                "name" => "Table 8",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 28.5, "positiony" => 39, "rotation" => 90, "color" => "gray"],
                                    ["id" => 2, "positionx" => 28.5, "positiony" => 41.5, "rotation" => 90, "color" => "gray"],
                                    ["id" => 3, "positionx" => 18, "positiony" => 39, "rotation" => 270, "color" => "gray"],
                                    ["id" => 4, "positionx" => 18, "positiony" => 41.5, "rotation" => 270, "color" => "gray"]
                                ]
                            ],
                            [
                                "id" => 'I',
                                "name" => "Table 9",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 18, "positiony" => 49, "rotation" => 180, "color" => "gray"],
                                    ["id" => 2, "positionx" => 25, "positiony" => 49, "rotation" => 180, "color" => "gray"],
                                    ["id" => 3, "positionx" => 18, "positiony" => 45, "rotation" => 0, "color" => "gray"],
                                    ["id" => 4, "positionx" => 25, "positiony" => 45, "rotation" => 0, "color" => "gray"]
                                ]
                            ],
                            [
                                "id" => 'J',
                                "name" => "Table 10",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 54.5, "positiony" => 43, "rotation" => 90, "color" => "gray"],
                                    ["id" => 2, "positionx" => 54.5, "positiony" => 45, "rotation" => 90, "color" => "gray"],
                                    ["id" => 3, "positionx" => 54.5, "positiony" => 47, "rotation" => 90, "color" => "gray"]
                                ]
                            ],
                            [
                                "id" => 'K',
                                "name" => "Table 11",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 67, "positiony" => 42.5, "rotation" => 180, "color" => "gray"],
                                    ["id" => 2, "positionx" => 73, "positiony" => 42.5, "rotation" => 180, "color" => "gray"],
                                    ["id" => 3, "positionx" => 77.5, "positiony" => 44, "rotation" => 270, "color" => "gray"],
                                    ["id" => 4, "positionx" => 77.5, "positiony" => 46, "rotation" => 270, "color" => "gray"]
                                ]
                            ],
                            [
                                "id" => 'L',
                                "name" => "Table 12",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 69, "positiony" => 49, "rotation" => 0, "color" => "gray"],
                                    ["id" => 2, "positionx" => 76, "positiony" => 49, "rotation" => 0, "color" => "gray"],
                                    ["id" => 3, "positionx" => 69, "positiony" => 53, "rotation" => 180, "color" => "gray"],
                                    ["id" => 4, "positionx" => 76, "positiony" => 53, "rotation" => 180, "color" => "gray"]
                                ]
                            ],
                            [
                                "id" => 'M',
                                "name" => "Table 13",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 73, "positiony" => 59, "rotation" => 0, "color" => "gray"],
                                    ["id" => 2, "positionx" => 67, "positiony" => 59, "rotation" => 0, "color" => "gray"],
                                    ["id" => 3, "positionx" => 77.5, "positiony" => 56, "rotation" => 270, "color" => "gray"],
                                    ["id" => 4, "positionx" => 77.5, "positiony" => 58, "rotation" => 270, "color" => "gray"]
                                ]
                            ],
                        ]
                    ],
                    [
                        'floor_id' => $floor->id,
                        'name' => 'Caben',
                        'data' => [
                            [
                                "id" => "N",
                                "name" => "Cabin",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 19, "positiony" => 4, "rotation" => 0, "color" => "gray"],
                                ]
                            ],
                            [
                                "id" => "P",
                                "name" => "Cabin",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 29, "positiony" => 4, "rotation" => 0, "color" => "gray"],
                                ]
                            ],
                            [
                                "id" => "Q",
                                "name" => "Cabin",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 38, "positiony" => 4, "rotation" => 0, "color" => "gray"],
                                ]
                            ],
                            [
                                "id" => "R",
                                "name" => "Cabin",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 47, "positiony" => 5, "rotation" => 90, "color" => "gray"],
                                ]
                            ],
                            [
                                "id" => "S",
                                "name" => "Cabin",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 47, "positiony" => 9, "rotation" => 90, "color" => "gray"],
                                ]
                            ],
                            [
                                "id" => "T",
                                "name" => "Cabin",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 47, "positiony" => 12, "rotation" => 90, "color" => "gray"],
                                ]
                            ],
                            [
                                "id" => "U",
                                "name" => "Cabin",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 47, "positiony" => 15, "rotation" => 90, "color" => "gray"],
                                ]
                            ],
                            [
                                "id" => "V",
                                "name" => "Cabin",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 69, "positiony" => 32.3, "rotation" => 0, "color" => "gray"],
                                ]
                            ],
                            [
                                "id" => "W",
                                "name" => "Cabin",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 62, "positiony" => 32.3, "rotation" => 0, "color" => "gray"],
                                ]
                            ],
                            [
                                "id" => "X",
                                "name" => "Cabin",
                                "chairs" => [
                                    ["id" => 1, "positionx" => 53, "positiony" => 32.3, "rotation" => 0, "color" => "gray"],
                                ]
                            ],
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
                        ]);
                    }
                }
            }
        }
    }
}
