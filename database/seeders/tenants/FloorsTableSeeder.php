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
        Floor::firstOrCreate(['name' => 'Ground Floor']);
        Floor::firstOrCreate(['name' => '1st Floor']);

        ScheduleFloor::firstOrCreate(['name' => 'G Floor']);
        ScheduleFloor::firstOrCreate(['name' => '1st Floor']);
    }
}