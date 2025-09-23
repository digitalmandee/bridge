<?php

namespace Database\Seeders\Tenants;

use App\Models\InvoiceType;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class InvoiceTypesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        InvoiceType::firstOrCreate(['name' => 'Monthly']);
        InvoiceType::firstOrCreate(['name' => 'Printing Papers']);
        InvoiceType::firstOrCreate(['name' => 'Meeting Rooms']);
    }
}
