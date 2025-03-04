<?php

namespace Database\Seeders\Tenants;

use App\Models\Branch;
use App\Models\Floor;
use App\Models\ScheduleFloor;
use Illuminate\Database\Seeder;

class FloorsTableSeeder extends Seeder
{
    public function run()
    {
        Floor::create(['name' => 'G Floor']);
        Floor::create(['name' => '1st Floor']);

        ScheduleFloor::create(['name' => 'G Floor']);
        ScheduleFloor::create(['name' => '1st Floor']);
    }
}