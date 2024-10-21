<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class BranchManagerController extends Controller
{
    public function index()
    {
        return view('admin.branch_manager.index');
    }

    public function branchManagerCreate()
    {
        return view('admin.branch_manager.create');
    }
}
