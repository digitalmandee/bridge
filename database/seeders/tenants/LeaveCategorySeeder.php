<?php

namespace Database\Seeders\Tenants;

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
                'name' => 'Annual Leave',
                'description' => 'Can be avoiled once a year',
                'color' => '#00ffbf',
                'status' => 'published',
                'short_code' => 'A',
            ],
            [
                'name' => 'Business Leave',
                'description' => 'Can be avoiled once a year',
                'color' => '#77c155',
                'status' => 'published',
                'short_code' => 'B',
            ],
            [
                'name' => 'Casual Leave',
                'description' => 'Can be avoiled once a year',
                'color' => '#469bd1',
                'status' => 'published',
                'short_code' => 'C',
            ],
            [
                'name' => 'Maternity Leave',
                'description' => 'Can be avoiled once a year',
                'color' => '#ff6698',
                'status' => 'published',
                'short_code' => 'M',
            ],
            [
                'name' => 'Sick Leave',
                'description' => 'Can be avoiled once a year',
                'color' => '#e3bd5f',
                'status' => 'published',
                'short_code' => 'S',
            ],
            [
                'name' => 'Unpaid Leave',
                'description' => 'Can be avoiled once a year',
                'color' => '#bad53f',
                'status' => 'published',
                'short_code' => 'N',
            ],
        ];

        foreach ($leaveCategory as $data) {
            LeaveCategory::firstOrCreate($data);
        }
    }
}
