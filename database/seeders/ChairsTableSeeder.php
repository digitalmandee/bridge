<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Chair;
use App\Models\Floor;

class ChairsTableSeeder extends Seeder
{

    public function run()
    {
        // $floors = Floor::all();
        // foreach ($floors as $floor) {
        //     for ($table = 0; $table < 2; $table++) {
        //         for ($i = 0; $i < 3; $i++) {
        //             Chair::create([
        //                 'floor_id' => $floor->id,
        //                 'status' => rand(0, 1),
        //                 'position' => 'top'
        //             ]);
        //             Chair::create([
        //                 'floor_id' => $floor->id,
        //                 'status' => rand(0, 1),
        //                 'position' => 'bottom'
        //             ]);
        //         }
        //     }
        // }
    }
}
