<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use Illuminate\Http\Request;

class BranchManagerController extends Controller
{
    public function index()
    {
        return view('admin.branch_manager.index');
    }

    public function branchManagerCreate()
    {
       $branches =  Branch::branches();
       
        return view('admin.branch_manager.create', compact('branches'));
    }
}
