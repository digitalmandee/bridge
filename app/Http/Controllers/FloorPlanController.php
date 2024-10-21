<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FloorPlanController extends Controller
{
    public function index()
    {
        return view('admin.floor_plan.index');
    }
}
