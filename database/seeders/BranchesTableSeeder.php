<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Branch;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class BranchesTableSeeder extends Seeder
{
    public function run()
    {
        $branch = Branch::create(['user_id' => 2, 'name' => 'Co-Work @NATSP', 'location' => 'Lahore']);

        User::create([
            'name' => 'User 1',
            'email' => 'user@gmail.com',
            'type' => 'user',
            'created_by_branch_id' => $branch->id,
            'password' => Hash::make('password'),
        ]);
        User::create([
            'name' => 'Member 2',
            'email' => 'user2@gmail.com',
            'type' => 'user',
            'created_by_branch_id' => $branch->id,
            'password' => Hash::make('password'),
        ]);
        User::create([
            'name' => 'Member 3',
            'email' => 'user3@gmail.com',
            'type' => 'user',
            'created_by_branch_id' => $branch->id,
            'password' => Hash::make('password'),
        ]);
    }
}