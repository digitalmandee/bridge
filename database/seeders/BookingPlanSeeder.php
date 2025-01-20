<?php

namespace Database\Seeders;

use App\Models\BookingPlan;
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
            ['plan_name' => 'Monthly', 'plan_price' => 300],
            ['plan_name' => 'Weekly', 'plan_price' => 100],
            ['plan_name' => 'Daily', 'plan_price' => 20],
        ];

        foreach ($plans as $plan) {
            BookingPlan::firstOrCreate($plan);
        }
    }
}