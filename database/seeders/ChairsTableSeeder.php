<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Chair;
use App\Models\Room;

class ChairsTableSeeder extends Seeder
{
    public function run()
    {
        $rooms = Room::all();  // Get all rooms
        foreach ($rooms as $room) {
            for ($i = 1; $i <= 10; $i++) {
                Chair::create([
                    'room_id' => $room->id,
                    'name' => 'R' . $room->id . '-' . $i, // Unique chair names
                    'status' => ($i % 2 == 0) ? 1 : 0 // Example: alternate booked and available
                ]);
            }
        }
    }
}
