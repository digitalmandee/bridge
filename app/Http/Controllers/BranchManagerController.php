<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use Illuminate\Http\Request;
use App\Models\BranchManager;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;

class BranchManagerController extends Controller
{
    public function index()
    {
        $branchManagers = BranchManager::getBranchManagers();

        return view('admin.branch_manager.index', compact('branchManagers'));
    }

    public function branchManagerCreate()
    {
        $branches =  Branch::branches();
        $roles = Role::all();

        return view('admin.branch_manager.create', compact('branches', 'roles'));
    }

    public function branchManagerStore(Request $request)
    {
        try {
            DB::beginTransaction();

            BranchManager::storeBranchManager($request);

            DB::commit();
            return redirect()->route('admin.branch.manager')->with('success', 'Branch Manager created successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('admin.branch.manager.create')->with('error', 'There was an error creating the branch manager. Please try again.');
        }
    }

    public function branchManagerEdit($id)
    {
        $data = BranchManager::editBranchManager($id);

        $branchManager = $data['branch_manager'];
        $roles = $data['roles'];
        $branches = $data['branches'];

        return view('admin.branch_manager.edit', compact('branchManager', 'roles', 'branches'));
    }

    public function branchManagerUpdate(Request $request, $id)
    {
        try {
            DB::beginTransaction();

            BranchManager::updateBranchManager($request, $id);

            DB::commit();
            return redirect()->route('admin.branch.manager')->with('success', 'Branch manager update successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('admin.branch.manager.edit')->with('error', 'There was an error updating the branch manager. Please try again.');
        }
    }

    public function branchManagerDestroy($id)
    {
        try {
            DB::beginTransaction();
            BranchManager::deleteBranchManager($id);
            DB::commit();
            return redirect()->route('admin.branch.manager')->with('success', 'Branch manager deleted successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('admin.branch.manager')->with('error', 'There was an error deleting the branch manager. Please try again.');
        }
    }
}
