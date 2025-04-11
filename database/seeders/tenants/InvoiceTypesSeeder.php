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
        InvoiceType::create(['name' => 'Monthly']);
        InvoiceType::create(['name' => 'Printing Papers']);
        InvoiceType::create(['name' => 'Meeting Rooms']);
    }
}
