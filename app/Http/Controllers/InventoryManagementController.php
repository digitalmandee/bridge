<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class InventoryManagementController extends Controller
{
    public function index()
    {
        return view('admin.inventory_management.index');
    }

    public function inventoryCreate()
    {
        return view('admin.inventory_management.create');
    }
}
