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
        $this->call(AdminSeeder::class);
        $this->call([PermissionsSeeder::class]);
        // $this->call([
        //     BranchesTableSeeder::class,
        //     FloorsTableSeeder::class,
        //     RoomsTableSeeder::class,
        //     TablesTableSeeder ::class,
        //     ChairsTableSeeder::class,
        // ]);
    }
}
