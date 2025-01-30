<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ScheduleFloor;
use App\Models\ScheduleRoom;

class ScheduleRoomsTableSeeder extends Seeder
{
    public function run()
    {
        $floors = ScheduleFloor::all();
        foreach ($floors as $floor) {
            $rooms = [];
            if ($floor->id === 1) {
                $rooms = [
                    ['schedule_floor_id' => $floor->id, 'name' => 'Ground Room 1'],
                    ['schedule_floor_id' => $floor->id, 'name' => 'Ground Room 2'],
                ];
            } elseif ($floor->id === 2) {
                $rooms = [
                    ['schedule_floor_id' => $floor->id, 'name' => 'First Floor Room A'],
                    ['schedule_floor_id' => $floor->id, 'name' => 'First Floor Room B'],
                ];
            }
            foreach ($rooms as $room) {
                ScheduleRoom::create($room);
            }
        }
    }
}