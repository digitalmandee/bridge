<?php

namespace Database\Seeders;

use App\Models\LeaveCategory;
use Illuminate\Database\Seeder;

class LeaveCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $leaveCategory = [
            [
                'branch_id' => 1,
                'name' => 'Annual Leave',
                'description' => 'Can be avoiled once a year',
                'color' => '#000000',
                'status' => 'published',
            ],
            [
                'branch_id' => 1,
                'name' => 'Business Leave',
                'description' => 'Can be avoiled once a year',
                'color' => '#000000',
                'status' => 'published',
            ],
            [
                'branch_id' => 1,
                'name' => 'Casual Leave',
                'description' => 'Can be avoiled once a year',
                'color' => '#000000',
                'status' => 'published',
            ],
            [
                'branch_id' => 1,
                'name' => 'Maternity Leave',
                'description' => 'Can be avoiled once a year',
                'color' => '#000000',
                'status' => 'published',
            ],
            [
                'branch_id' => 1,
                'name' => 'Sick Leave',
                'description' => 'Can be avoiled once a year',
                'color' => '#000000',
                'status' => 'published',
            ],
            [
                'branch_id' => 1,
                'name' => 'Unpaid Leave',
                'description' => 'Can be avoiled once a year',
                'color' => '#000000',
                'status' => 'published',
            ],
            [
                'branch_id' => 1,
                'name' => 'Unpaid Leave',
                'description' => 'Can be avoiled once a year',
                'color' => '#000000',
                'status' => 'published',
            ],
            [
                'branch_id' => 1,
                'name' => 'Sick Leave',
                'description' => 'Can be avoiled once a year',
                'color' => '#000000',
                'status' => 'published',
            ],
            [
                'branch_id' => 1,
                'name' => 'Maternity Leave',
                'description' => 'Can be avoiled once a year',
                'color' => '#000000',
                'status' => 'published',
            ],
            [
                'branch_id' => 1,
                'name' => 'Casual Leave',
                'description' => 'Can be avoiled once a year',
                'color' => '#000000',
                'status' => 'published',
            ],
            [
                'branch_id' => 1,
                'name' => 'Business Leave',
                'description' => 'Can be avoiled once a year',
                'color' => '#000000',
                'status' => 'published',
            ],
            [
                'branch_id' => 1,
                'name' => 'Annual Leave',
                'description' => 'Can be avoiled once a year',
                'color' => '#000000',
                'status' => 'published',
            ],
        ];

        foreach ($leaveCategory as $data) {
            LeaveCategory::create($data);
        }
    }
}