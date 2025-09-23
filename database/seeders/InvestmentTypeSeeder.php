<?php

namespace Database\Seeders;

use App\Models\InvestmentType;
use App\Models\InvoiceType;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class InvestmentTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        InvestmentType::firstOrCreate(['name' => 'Equipment']);
        InvestmentType::firstOrCreate(['name' => 'Furniture']);
        InvestmentType::firstOrCreate(['name' => 'Office supplies']);
    }
}
