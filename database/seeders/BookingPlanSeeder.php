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
            ['name' => 'Meating Room1', 'type' => 'Basic', 'price' => 446.61, 'location' => 'Lahore'],
            ['name' => 'Meeting room2', 'type' => 'Premium', 'price' => 406.27, 'location' => 'Lahore'],
            ['name' => 'Meeting room3', 'type' => 'Premium', 'price' => 475.22, 'location' => 'Lahore'],
            ['name' => 'Meeting room4', 'type' => 'Basic', 'price' => 105.55, 'location' => 'Lahore'],
        ];

        foreach ($plans as $plan) {
            BookingPlan::firstOrCreate($plan);
        }
    }
}