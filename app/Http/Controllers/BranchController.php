<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use Illuminate\Http\Request;

class BranchController extends Controller
{
    public function index()
    {
        $branches = Branch::branches();

        return view('admin.branches.index', compact('branches'));
    }

    public function branchCreate()
    {
        return view('admin.branches.create');
    }

    public function branchStore(Request $request)
    {
        try {
            Branch::storeBranch($request);

            return redirect()->route('admin.branches')->with('success', 'Branch created successfully');
        } catch (\Exception $e) {
            return redirect()->route('admin.branches.create')->with('error', 'There was an error creating the branch. Please try again.');
        }        
    }

    public function branchEdit($id)
    {
        $branch = Branch::editBranch($id);

        return view('admin.branches.edit', compact('branch'));
    }

    public function branchUpdate(Request $request, $id)
    {
        try {
            Branch::updateBranch($request, $id);

            return redirect()->route('admin.branches')->with('success', 'Branch Updated successfully');
        } catch (\Exception $e) {
            return redirect()->route('admin.branch.edit')->with('error', 'There was an error updating the branch. Please try again.');
        } 
    }

    public function branchDestroy($id)
    {
        try {
            Branch::destroyBranch($id);

            return redirect()->route('admin.branches')->with('success', 'Branch Deleted successfully');
        } catch (\Exception $e) {
            return redirect()->route('admin.branches')->with('error', 'There was an error deleting the branch. Please try again.');
        }
    }
}
