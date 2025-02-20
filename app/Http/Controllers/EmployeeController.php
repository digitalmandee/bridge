<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $limit = $request->query('limit') ?? 10;

        $branchId = auth()->user()->branch->id;
        $employees = Employee::where('branch_id', $branchId)->with(['user:id,name,email,designation,phone_no', 'department:id,name', 'branch:id,name'])->paginate($limit);

        return response()->json(['success' => true, 'employees' => $employees], 200);
    }

    public function dashboard(Request $request)
    {
        $limit = $request->query('limit') ?? 10;
        $branchId = auth()->user()->branch->id;

        // Get total employees in the branch (excluding deleted)
        $totalEmployees = Employee::where('branch_id', $branchId)->whereNull('deleted_at')->count();

        // Get attendance statistics for the current day
        $currentDay = now()->format('Y-m-d');
        $attendanceStats = Attendance::where('branch_id', $branchId)
            ->where('date', $currentDay)
            ->selectRaw("
                SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) as total_absent,
                SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as total_present,
                SUM(CASE WHEN status = 'late' THEN 1 ELSE 0 END) as total_late
            ")->first();

        return response()->json([
            'success' => true,
            'total_employees' => $totalEmployees,
            'total_present' => $attendanceStats->total_present ?? 0,
            'total_absent' => $attendanceStats->total_absent ?? 0,
            'total_late' => $attendanceStats->total_late ?? 0,
        ], 200);
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

            if (Employee::where('branch_id', $branchId)->where('employee_id', $request->employee_id)->exists()) {
                return response()->json(['success' => false, 'message' => 'Employee ID already exists'], 400);
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

    public function show($id)
    {
        $branchId = auth()->user()->branch->id;

        $employee = Employee::where('branch_id', $branchId)->where('employee_id', $id)->with(['user:id,name,email,designation,phone_no', 'department:id,name'])->first();
        if (!$employee) return response()->json(['success' => false, 'message' => 'Employee not found'], 404);

        return response()->json(['success' => true, 'employee' => $employee], 200);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'user.name' => 'required|string',
            'employee_id' => 'required',
            'user.email' => 'required|email',
            'user.designation' => 'required|string',
            'user.phone_no' => 'required',
            // 'department_id' => 'required',
            'salary' => 'required|numeric',
        ]);
        $branchId = auth()->user()->branch->id;
        $employee = Employee::where('branch_id', $branchId)->where('employee_id', $id)->first();
        if (!$employee) return response()->json(['success' => false, 'message' => 'Employee not found'], 404);

        // Check if another employee has the same employee_id
        $existingEmployee = Employee::where('branch_id', $branchId)->where('employee_id', $request->employee_id)->where('id', '!=', $employee->id)->first();

        if ($existingEmployee) {
            return response()->json(['success' => false, 'message' => 'Employee ID already exists for another employee'], 400);
        }

        // Check if email has changed and validate uniqueness
        if ($request->user['email'] !== $employee->user->email) {
            $existingEmailUser = User::where('email', $request->user['email'])->first();
            if ($existingEmailUser) {
                return response()->json(['success' => false, 'message' => 'Email already in use by another user'], 400);
            }
        }

        DB::beginTransaction();

        $employee->update([
            // 'department_id' => $request->department_id,
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
            'name' => $request->user['name'],
            'email' => $request->user['email'],
            'designation' => $request->user['designation'],
            'phone_no' => $request->user['phone_no'],
        ]);

        DB::commit();

        return response()->json(['success' => true, 'message' => 'Employee updated successfully'], 200);
    }
}