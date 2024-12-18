<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Room;
use App\Models\Floor;

class RoomsTableSeeder extends Seeder
{
    public function run()
    {
        $floors = Floor::all();
        foreach ($floors as $floor) {
            Room::create(['floor_id' => $floor->id, 'name' => 'Room 101', 'type' => 'Standard']);
            Room::create(['floor_id' => $floor->id, 'name' => 'Room 102', 'type' => 'Deluxe']);
            Room::create(['floor_id' => $floor->id, 'name' => 'Room 103', 'type' => 'Suite']);
        }
    }
}
