<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Floor;
use App\Models\Branch;
use App\Models\ScheduleFloor;

class FloorsTableSeeder extends Seeder
{
    public function run()
    {
        $branches = Branch::all();
        foreach ($branches as $branch) {
            Floor::create(['branch_id' => $branch->id, 'name' => 'G Floor']);
            Floor::create(['branch_id' => $branch->id, 'name' => '1st Floor']);
        }
        foreach ($branches as $branch) {
            ScheduleFloor::create(['branch_id' => $branch->id, 'name' => 'G Floor']);
            ScheduleFloor::create(['branch_id' => $branch->id, 'name' => '1st Floor']);
        }
    }
}
