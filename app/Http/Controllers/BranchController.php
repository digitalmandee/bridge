<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class BranchController extends Controller
{
    public function branch()
    {
        return view('admin.branches.index');
    }

    public function branchManager()
    {
        return view('admin.branch_manager.index');
    }
}
