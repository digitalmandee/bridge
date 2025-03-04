<?php

namespace Database\Seeders\Tenants;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::create([
            'name' => 'user',
            'email' => 'user@gmail.com',
            'type' => 'user',
            'password' => Hash::make('password'),
        ]);
        // User::create([
        //     'name' => 'Invester',
        //     'email' => 'invester@gmail.com',
        //     'type' => 'invester',
        //     'password' => Hash::make('password'),
        // ]);
    }
}
