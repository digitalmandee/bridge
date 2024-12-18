<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Table;
use App\Models\Room;

class TablesTableSeeder extends Seeder
{
    public function run()
    {
        $rooms = Room::all();
        foreach ($rooms as $room) {
            Table::create(['room_id' => $room->id, 'name' => 'Table 1']);
            Table::create(['room_id' => $room->id, 'name' => 'Table 2']);
            Table::create(['room_id' => $room->id, 'name' => 'Table 3']);
        }
    }
}
