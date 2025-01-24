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
            ['name' => 'Meating Room1', 'type' => 'Basic', 'price' => 446.61],
            ['name' => 'Meeting room2', 'type' => 'Premium', 'price' => 406.27],
            ['name' => 'Meeting room3', 'type' => 'Premium', 'price' => 475.22],
            ['name' => 'Meeting room4', 'type' => 'Basic', 'price' => 105.55],
        ];

        $branches = Branch::all();
        foreach ($branches as $branch) {
            foreach ($plans as $plan) {
                BookingPlan::firstOrCreate(['branch_id' => $branch->id, 'name' => $plan['name'], 'type' => $plan['type'], 'price' => $plan['price']]);
            }
        }
    }
}
