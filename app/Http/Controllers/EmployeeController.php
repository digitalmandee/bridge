<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $limit = $request->query('limit') ?? 10;

        $branchId = auth()->user()->branch->id;
        $employees = User::where('type', 'employee')->where('created_by_branch_id', $branchId)->select('id', 'name', 'email', 'designation', 'phone_no', 'created_by_branch_id')->where('deleted_at', null)->with('employee:user_id,employee_id,department_id,joining_date', 'userBranch:id,name')->paginate($limit);

        return response()->json(['success' => true, 'employees' => $employees], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'employee_id' => 'required',
            'email' => 'required|email',
            'designation' => 'required|string',
            'phone_no' => 'required',
            'gender' => 'required|in:male,female',
            'department_id' => 'required',
            'salary' => 'required|numeric',
            'joining_date' => 'required|date',
        ]);


        try {
            $branchId = auth()->user()->branch->id;

            DB::beginTransaction();
            $user = User::where('email', $request->email)->first();

            if ($user) {
                return response()->json(['success' => false, 'message' => 'Employee already has an account'], 400);
            }

            $user = User::create(['name' => $request->name, 'email' => $request->email, 'type' => 'employee', 'designation' => $request->designation, 'phone_no' => $request->phone_no, 'created_by_branch_id' => $branchId]);

            Employee::create([
                'branch_id' => $branchId,
                'user_id' => $user->id,
                'department_id' => $request->department_id,
                'employee_id' => $request->employee_id,
                'gender' => $request->gender,
                'salary' => $request->salary,
                'joining_date' => $request->joining_date
            ]);

            DB::commit();
            return response()->json(['success' => true, 'message' => 'Employee created successfully'], 201);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'message' => $th->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string',
            'employee_id' => 'required',
            'email' => 'required|email',
            'designation' => 'required|string',
            'phone_no' => 'required',
            'department_id' => 'required',
            'salary' => 'required|numeric',
        ]);

        $employee = Employee::find($id);
        if (!$employee) return response()->json(['success' => false, 'message' => 'Employee not found'], 404);

        DB::beginTransaction();

        $employee->update([
            'department_id' => $request->department_id,
            'employee_id' => $request->employee_id,
            'salary' => $request->salary,
            'address' => $request->address,
            'emergency_no' => $request->emergency_no,
            'gender' => $request->gender,
            'marital_status' => $request->marital_status,
            'national_id' => $request->national_id,
            'account_no' => $request->account_no,
        ]);

        $employee->user->update([
            'name' => $request->name,
            'email' => $request->email,
            'designation' => $request->designation,
            'phone_no' => $request->phone_no,
        ]);

        DB::commit();

        return response()->json(['success' => true, 'message' => 'Employee updated successfully'], 200);
    }
}