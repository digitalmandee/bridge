<?php

namespace Database\Seeders\Tenants;

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
        InvoiceType::create(['name' => 'Equipment']);
        InvoiceType::create(['name' => 'Furniture']);
        InvoiceType::create(['name' => 'Office supplies']);
    }
}
