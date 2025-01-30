<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@gmail.com',
            'type' => 'superadmin',
            'password' => Hash::make('password'),
        ]);
        User::create([
            'name' => 'Branch Manager',
            'email' => 'admin@gmail.com',
            'type' => 'admin',
            'password' => Hash::make('password'),
        ]);
        User::create([
            'name' => 'Invester',
            'email' => 'invester@gmail.com',
            'type' => 'invester',
            'password' => Hash::make('password'),
        ]);
        User::create([
            'name' => 'User 1',
            'email' => 'user@gmail.com',
            'type' => 'user',
            'password' => Hash::make('password'),
        ]);
        User::create([
            'name' => 'Member 2',
            'email' => 'user2@gmail.com',
            'type' => 'user',
            'password' => Hash::make('password'),
        ]);
        User::create([
            'name' => 'Member 3',
            'email' => 'user3@gmail.com',
            'type' => 'user',
            'password' => Hash::make('password'),
        ]);
    }
}