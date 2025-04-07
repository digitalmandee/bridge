<?php

namespace Database\Seeders\Tenants;

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
            ['name' => 'Seat 1', 'type' => 'monthly', 'price' => 446.61, 'booking_hours' => 40, 'printing_papers' => 100],
            ['name' => 'Seat 2', 'type' => 'monthly', 'price' => 406.27, 'booking_hours' => 30, 'printing_papers' => 150],
            ['name' => 'Seat 3', 'type' => 'monthly', 'price' => 475.22, 'booking_hours' => 50, 'printing_papers' => 200],
            ['name' => 'Dedicated Office', 'type' => 'monthly', 'price' => 30000, 'booking_hours' => 100, 'printing_papers' => 400],
            ['name' => 'Seat 1', 'type' => 'full_day', 'price' => 60],
            ['name' => 'Seat 2', 'type' => 'full_day', 'price' => 70],
            ['name' => 'Seat 3', 'type' => 'full_day', 'price' => 100],
            ['name' => 'Dedicated Office', 'type' => 'full_day', 'price' => 1000],
        ];

        foreach ($plans as $plan) {
            BookingPlan::firstOrCreate($plan);
        }
    }
}
