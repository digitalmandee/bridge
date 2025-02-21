<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Database\Seeders\AdminSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            AdminSeeder::class,
            BranchesTableSeeder::class,
            FloorsTableSeeder::class,
            ScheduleRoomsTableSeeder::class,
            BookingPlanSeeder::class,
            RoomsTableSeeder::class,
            ChairsTableSeeder::class,
            PermissionsSeeder::class,
            LeaveCategorySeeder::class
        ]);
    }
}