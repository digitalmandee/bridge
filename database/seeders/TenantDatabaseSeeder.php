<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use Database\Seeders\Tenants\BookingPlanSeeder;
use Database\Seeders\Tenants\FloorsTableSeeder;
use Database\Seeders\Tenants\InvestmentTypeSeeder;
use Database\Seeders\Tenants\InvoiceTypesSeeder;
use Database\Seeders\Tenants\LeaveCategorySeeder;
use Database\Seeders\Tenants\PermissionsSeeder;
use Database\Seeders\Tenants\RoomsTableSeeder;
use Database\Seeders\Tenants\ScheduleRoomsTableSeeder;
use Database\Seeders\Tenants\UserSeeder;
use Illuminate\Database\Seeder;

class TenantDatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        $this->call([
            // UserSeeder::class,
            PermissionsSeeder::class,
            FloorsTableSeeder::class,
            RoomsTableSeeder::class,
            BookingPlanSeeder::class,
            ScheduleRoomsTableSeeder::class,
            LeaveCategorySeeder::class,
            InvoiceTypesSeeder::class,
            InvestmentTypeSeeder::class,
        ]);
    }
}