<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Employee;
use App\Models\LeaveApplication;
use Carbon\Carbon;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    //
    public function index(Request $request)
    {
        $limit = $request->query('limit') ?? 10;
        $branchId = auth()->user()->branch->id;
        $date = $request->query('date', now()->format('Y-m-d'));

        // Load Employee with User
        $attendance = Attendance::where('branch_id', $branchId)
            ->with([
                'employee:id,user_id,branch_id',
                'employee.user:id,name,designation',
                'leaveCategory:id,name',
            ])
            ->where('date', $date)
            ->paginate($limit);

        return response()->json(['success' => true, 'attendance' => $attendance], 200);
    }

    public function updateAttendance(Request $request, $attendanceId)
    {
        // Validate
        $request->validate([
            'leave_category_id' => 'nullable|integer|exists:leave_categories,id',
            'check_in' => 'nullable|date_format:H:i:s|before:check_out',
            'check_out' => 'nullable|date_format:H:i:s|after:check_in',
            'status' => [
                'required',
                function ($attribute, $value, $fail) use ($request) {
                    if ($request->leave_category_id && $value !== 'leave') {
                        $fail("Status must be 'leave' when a leave category is selected.");
                    }
                },
            ],
        ]);

        // Find attendance or fail
        $attendance = Attendance::findOrFail($attendanceId);

        // Update attendance fields
        $attendance->fill([
            'leave_category_id' => $request->leave_category_id,
            'check_in' => $request->check_in,
            'check_out' => $request->check_out,
            'status' => $request->status,
        ])->save();

        // Return success response
        return response()->json(['success' => true, 'message' => 'Attendance updated successfully'], 200);
    }


    public function allEmployeesReport(Request $request)
    {
        $branchId = auth()->user()->branch->id;

        // Get the start and end dates of the current month by default
        $month = $request->query('month', now()->format('Y-m')); // Default to current month
        $startDate = Carbon::parse($month . '-01')->startOfMonth();
        $endDate = Carbon::parse($month . '-01')->endOfMonth();

        // Fetch attendance records for all employees in the branch for the selected month
        $attendance = Attendance::where('branch_id', $branchId)->whereBetween('date', [$startDate, $endDate])->get();

        // Group attendance by employee
        $groupedAttendance = $attendance->groupBy('employee_id');

        // Prepare the summary report for each employee
        $report = [];

        foreach ($groupedAttendance as $employeeId => $records) {
            $employee = Employee::find($employeeId);

            if ($employee) {
                $report[] = [
                    'employee_id'   => $employee->employee_id,
                    'name'          => $employee->user->name,
                    'designation'   => $employee->user->designation,
                    'profile_image'   => $employee->user->profile_image,
                    'total_present' => $records->where('status', 'present')->count(),
                    'total_leave'   => $records->where('status', 'leave')->count(),
                    'total_late'    => $records->where('status', 'late')->count(),
                    'total_absent'  => $records->where('status', 'absent')->count(),
                ];
            }
        }

        return response()->json(['success' => true, 'report' => $report]);
    }

    // Leave Application
    public function createLeave(Request $request)
    {
        $request->validate([
            'employee_id' => 'required|exists:users,id',
            'leave_category_id' => 'required|exists:leave_categories,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'required|string',
        ]);

        try {
            $startDate = Carbon::parse($request->start_date);
            $endDate = Carbon::parse($request->end_date);

            $employeeId = Employee::where('user_id', $request->employee_id)->value('id');

            // Check if the user already has a leave application in this range
            if (LeaveApplication::where('branch_id', auth()->user()->branch->id)
                ->where('employee_id', $employeeId)
                ->whereBetween('start_date', [$startDate, $endDate])
                ->orWhereBetween('end_date', [$startDate, $endDate])
                ->exists()
            ) {
                return response()->json(['success' => false, 'message' => 'You already have a leave application in this date range'], 422);
            }

            LeaveApplication::create([
                'branch_id' => auth()->user()->branch->id,
                'employee_id' => $employeeId,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'leave_category_id' => $request->leave_category_id,
                'number_of_days' => $startDate->diffInDays($endDate) + 1,
                'reason' => $request->reason,
            ]);

            return response()->json(['success' => true, 'message' => 'Leave application created successfully']);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'message' => $th->getMessage()], 500);
        }
    }

    public function updateLeave(Request $request, $id)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'required|string',
            'leave_category_id' => 'required',
            'status' => 'required|in:pending,approved,rejected',
        ]);

        try {
            LeaveApplication::find($id)->update([
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'reason' => $request->reason,
                'leave_category_id' => $request->leave_category_id,
                'status' => $request->status
            ]);

            return response()->json(['success' => true, 'message' => 'Leave application updated successfully']);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'message' => $th->getMessage()], 500);
        }
    }

    public function leaveReport(Request $request)
    {
        $limit = $request->query('limit', 10);
        $branchId = auth()->user()->branch->id;

        $date = $request->query('date', now()->format('Y-m-d'));

        $leaveApplications = LeaveApplication::where('branch_id', $branchId)->where('start_date', '<=', $date)->where('end_date', '>=', $date)->orderByDesc('created_at')->paginate($limit);

        return response()->json(['success' => true, 'leave_applications' => $leaveApplications]);
    }

    public function profileReport(Request $request, $employeeId)
    {
        $branchId = auth()->user()->branch->id;

        // Get the start and end dates of the current month by default
        $month = $request->query('month', now()->format('Y-m')); // Default to current month
        $startDate = Carbon::parse($month . '-01')->startOfMonth();
        $endDate = Carbon::parse($month . '-01')->endOfMonth();

        // Fetch attendance records for all employees in the branch for the selected month
        $attendance = Attendance::where('branch_id', $branchId)->where('employee_id', $employeeId)->whereBetween('date', [$startDate, $endDate])->get();

        return response()->json(['success' => true, 'report' => $attendance]);
    }
}