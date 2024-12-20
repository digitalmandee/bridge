<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Branch;

class BranchesTableSeeder extends Seeder
{
    public function run()
    {
        Branch::create(['name' => 'Johar Town']);
        Branch::create(['name' => 'Model Town']);
        Branch::create(['name' => 'Gulberg']);
        Branch::create(['name' => 'DHA']);
        Branch::create(['name' => 'Bahria Town']);
    }
}
