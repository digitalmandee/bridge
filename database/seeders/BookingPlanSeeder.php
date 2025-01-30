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
            ['name' => 'Seat 1', 'type' => 'basic', 'price' => 446.61],
            ['name' => 'Seat 2', 'type' => 'basic', 'price' => 406.27],
            ['name' => 'Seat 3', 'type' => 'basic', 'price' => 475.22],
            ['name' => 'Dedicated Office', 'type' => 'premium', 'price' => 30000],
        ];

        $branches = Branch::all();
        foreach ($branches as $branch) {
            foreach ($plans as $plan) {
                BookingPlan::firstOrCreate(['branch_id' => $branch->id, 'name' => $plan['name'], 'type' => $plan['type'], 'price' => $plan['price']]);
            }
        }
    }
}