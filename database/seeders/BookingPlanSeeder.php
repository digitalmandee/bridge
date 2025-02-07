<?php

namespace Database\Seeders;

use App\Models\BookingPlan;
use App\Models\Branch;
use Illuminate\Database\Seeder;

class BookingPlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $plans = [
            ['name' => 'Seat 1', 'type' => 'monthly', 'price' => 446.61],
            ['name' => 'Seat 2', 'type' => 'monthly', 'price' => 406.27],
            ['name' => 'Seat 3', 'type' => 'monthly', 'price' => 475.22],
            ['name' => 'Dedicated Office', 'type' => 'monthly', 'price' => 30000],
            ['name' => 'Seat 1', 'type' => 'full_day', 'price' => 60],
            ['name' => 'Seat 2', 'type' => 'full_day', 'price' => 70],
            ['name' => 'Seat 3', 'type' => 'full_day', 'price' => 100],
            ['name' => 'Dedicated Office', 'type' => 'full_day', 'price' => 1000],
        ];

        $branches = Branch::all();
        foreach ($branches as $branch) {
            foreach ($plans as $plan) {
                BookingPlan::firstOrCreate(['branch_id' => $branch->id, 'name' => $plan['name'], 'type' => $plan['type'], 'price' => $plan['price']]);
            }
        }
    }
}
