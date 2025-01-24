<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Floor;
use App\Models\Branch;

class FloorsTableSeeder extends Seeder
{
    public function run()
    {
        $branches = Branch::all();
        foreach ($branches as $branch) {
            Floor::create(['branch_id' => $branch->id, 'name' => 'Ground Floor']);
        }
    }
}