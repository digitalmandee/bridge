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
        $branchId = auth()->user()->branch->id;

        $date = $request->query('date', now()->format('Y-m-d'));
        $attendance = Attendance::where('branch_id', $branchId)->with('employee')->where('date', $date)->get();

        return response()->json($attendance);
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
            'employee_id' => 'required',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'required|string',
        ]);

        try {
            $startDate = Carbon::parse($request->start_date);
            $endDate = Carbon::parse($request->end_date);

            // Check if the user already has a leave application in this range
            if (LeaveApplication::where('branch_id', auth()->user()->branch->id)
                ->where('employee_id', $request->employee_id)
                ->whereBetween('start_date', [$startDate, $endDate])
                ->orWhereBetween('end_date', [$startDate, $endDate])
                ->exists()
            ) {
                return response()->json(['success' => false, 'message' => 'You already have a leave application in this date range'], 422);
            }

            LeaveApplication::create([
                'branch_id' => auth()->user()->branch->id,
                'employee_id' => $request->employee_id,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
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
            'status' => 'required|in:pending,approved,rejected',
        ]);

        try {
            LeaveApplication::find($id)->update([
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'reason' => $request->reason,
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
}