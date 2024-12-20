<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Chair;
use App\Models\Table;

class ChairsTableSeeder extends Seeder
{
    public function run()
    {
        $tables = Table::all();
        foreach ($tables as $table) {
            Chair::create(['table_id' => $table->id, 'name' => 'Chair 1', 'status' => 0]); // 0 = available
            Chair::create(['table_id' => $table->id, 'name' => 'Chair 2', 'status' => 1]); // 1 = booked
            Chair::create(['table_id' => $table->id, 'name' => 'Chair 3', 'status' => 0]);
            Chair::create(['table_id' => $table->id, 'name' => 'Chair 4', 'status' => 0]);
            Chair::create(['table_id' => $table->id, 'name' => 'Chair 5', 'status' => 0]);
        }
    }
}
