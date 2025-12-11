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
        Floor::firstOrCreate(['name' => '6th Floor']);
        Floor::firstOrCreate(['name' => '5th Floor']);

        ScheduleFloor::firstOrCreate(['name' => 'G Floor']);
        ScheduleFloor::firstOrCreate(['name' => '1st Floor']);
    }
}
