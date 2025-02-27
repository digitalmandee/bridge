<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Employee;
use App\Models\LeaveApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class LeaveApplicationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $limit = $request->query('limit', 10);
        $date = $request->query('date', now()->format('Y-m-d'));
        $branchId = auth()->user()->branch->id;

        $leaveApplications = LeaveApplication::where('branch_id', $branchId)->where('start_date', '<=', $date)->where('end_date', '>=', $date)->with('employee:id,user_id', 'employee.user:id,name', 'leaveCategory:id,name')->orderByDesc('created_at')->paginate($limit);

        return response()->json(['success' => true, 'applications' => $leaveApplications]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */

    public function leaveReport(Request $request)
    {
        $monthly = $request->query('month', now()->format('Y-m')); // Default to current month
        $limit = (int) $request->query('limit', 10); // Ensure limit is integer

        $monthStart = Carbon::createFromFormat('Y-m', $monthly)->startOfMonth();
        $monthEnd = Carbon::createFromFormat('Y-m', $monthly)->endOfMonth();

        $branchId = auth()->user()->branch->id;

        // Fetch employees with user data
        $employees = Employee::where('branch_id', $branchId)
            ->with(['user:id,name,profile_image'])
            ->paginate($limit);

        $employeeIds = $employees->pluck('id')->toArray();

        // Get all Sundays in the month
        $sundays = [];
        for ($date = $monthStart->copy(); $date->lte($monthEnd); $date->addDay()) {
            if ($date->isSunday()) {
                $sundays[] = $date->format('Y-m-d');
            }
        }

        $totalWorkingDays = ($monthEnd->diffInDays($monthStart) + 1) - count($sundays);

        // Fetch leave applications with leave category names, excluding Sundays
        $leaveCounts = LeaveApplication::whereIn('employee_id', $employeeIds)
            ->whereBetween('start_date', [$monthStart, $monthEnd])
            ->where('leave_applications.status', 'approved')
            ->whereNotIn(DB::raw('DATE(start_date)'), $sundays)
            ->join('leave_categories', 'leave_applications.leave_category_id', '=', 'leave_categories.id')
            ->selectRaw('employee_id, leave_categories.name as leave_category, SUM(number_of_days) as total_leave')
            ->groupBy('employee_id', 'leave_categories.name')
            ->get()
            ->groupBy('employee_id');

        // Fetch attendance excluding Sundays
        $attendanceStats = Attendance::whereIn('employee_id', $employeeIds)
            ->whereBetween('date', [$monthStart, $monthEnd])
            ->whereNotIn('date', $sundays)
            ->selectRaw("
                employee_id,
                COUNT(*) as total_attendance,
                SUM(CASE WHEN status = 'present' AND check_in IS NOT NULL THEN 1 ELSE 0 END) as time_present,
                SUM(CASE WHEN status = 'late' AND check_in IS NOT NULL THEN 1 ELSE 0 END) as time_late
            ")
            ->groupBy('employee_id')
            ->get()
            ->keyBy('employee_id');

        // Fetch unique attendance dates to exclude from leave
        $attendanceDates = Attendance::whereIn('employee_id', $employeeIds)
            ->whereBetween('date', [$monthStart, $monthEnd])
            ->pluck('date', 'employee_id')
            ->toArray();

        // Initialize totals
        $totalSummary = [
            'total_attendance' => 0,
            'total_absence' => 0,
            'total_leave' => 0,
            'leave_categories' => [],
        ];

        // Prepare response data
        $reportData = [];

        foreach ($employees as $employee) {
            $leaveData = $leaveCounts[$employee->id] ?? collect();
            $attendanceData = $attendanceStats[$employee->id] ?? (object) ['total_attendance' => 0, 'time_present' => 0, 'time_late' => 0];

            // Calculate total leave, excluding days where attendance exists
            $leaveSummary = [];
            $totalLeave = 0;
            foreach ($leaveData as $leave) {
                $filteredLeaveDays = $leave->total_leave - (isset($attendanceDates[$employee->id]) ? 1 : 0);
                $leaveSummary[str_replace(' ', '_', $leave->leave_category)] = max(0, $filteredLeaveDays); // Ensure no negative values
                $totalLeave += $leaveSummary[str_replace(' ', '_', $leave->leave_category)];

                // Update total summary
                if (!isset($totalSummary['leave_categories'][str_replace(' ', '_', $leave->leave_category)])) {
                    $totalSummary['leave_categories'][str_replace(' ', '_', $leave->leave_category)] = 0;
                }
                $totalSummary['leave_categories'][str_replace(' ', '_', $leave->leave_category)] += $leaveSummary[str_replace(' ', '_', $leave->leave_category)];
            }

            // Calculate total absence correctly
            $totalAbsence = $totalWorkingDays - ($totalLeave + $attendanceData->total_attendance);

            // Update totals
            $totalSummary['total_attendance'] += $attendanceData->total_attendance;
            $totalSummary['total_absence'] += $totalAbsence;
            $totalSummary['total_leave'] += $totalLeave;

            // Add employee data to report
            $reportData[] = [
                'employee_id' => $employee->employee_id,
                'profile_image' => $employee->user->profile_image,
                'employee_name' => $employee->user->name,
                'total_attendance' => $attendanceData->total_attendance,
                'total_absence' => $totalAbsence,
                'total_leave' => $totalLeave,
                'leave_categories' => $leaveSummary,
            ];
        }

        return response()->json([
            'success' => true,
            'report_data' => [
                'employees' => $reportData,
                'total_summary' => $totalSummary,
                'current_page' => $employees->currentPage(),
                'last_page' => $employees->lastPage(),
                'total_records' => $employees->total(),
            ],
        ]);
    }

    public function leaveReportMonthly(Request $request)
    {
        $monthly = $request->query('month', now()->format('Y-m')); // Default to current month
        $limit = $request->query('limit', 10); // Get per page limit from request (default: 10)

        $monthStart = Carbon::createFromFormat('Y-m', $monthly)->startOfMonth();
        $monthEnd = Carbon::createFromFormat('Y-m', $monthly)->endOfMonth();

        $branchId = auth()->user()->branch->id;
        $employees = Employee::where('branch_id', $branchId)->paginate($limit); // Pagination applied


        $reportData = [];
        $totalLeave = 0;
        $totalAttendance = 0;
        $totalTimePresent = 0;
        $totalTimeLate = 0;

        foreach ($employees as $employee) {
            $leaveApplications = $employee->leaveApplications()
                ->whereBetween('start_date', [$monthStart, $monthEnd])
                ->where('status', 'approved')
                ->get();

            $attendance = $employee->attendances()
                ->whereBetween('date', [$monthStart, $monthEnd])
                ->get();

            $leaveCount = $leaveApplications->sum('number_of_days');
            $attendanceCount = $attendance->whereIn('status', ['present', 'late'])->count();
            $timePresent = $attendance->where('status', 'present')->whereNotNull('check_in')->count();
            $timeLate = $attendance->where('status', 'late')->whereNotNull('check_in')->count();

            // Update totals
            $totalLeave += $leaveCount;
            $totalAttendance += $attendanceCount;
            $totalTimePresent += $timePresent;
            $totalTimeLate += $timeLate;

            // Add employee data to report
            $reportData[] = [
                'employee_id' => $employee->employee_id,
                'profile_image' => $employee->user->profile_image,
                'employee_name' => $employee->user->name,
                'total_leave' => $leaveCount,
                'total_attendance' => $attendanceCount,
                'time_present' => $timePresent,
                'time_late' => $timeLate,
            ];
        }

        // Add total summary at the bottom
        $totalSummary = [
            'employee_id' => 'Total',
            'employee_name' => 'All Employees',
            'total_leave' => $totalLeave,
            'total_attendance' => $totalAttendance,
            'time_present' => $totalTimePresent,
            'time_late' => $totalTimeLate,
        ];

        return response()->json([
            'success' => true,
            'report_data' => [
                'employees' => $reportData,
                'total_summary' => $totalSummary,
                'current_page' => $employees->currentPage(),
                'last_page' => $employees->lastPage(),
                'total_records' => $employees->total(),
            ],
        ]);
    }



    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
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

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $application = LeaveApplication::with('employee:id,user_id', 'employee.user:id,name', 'leaveCategory:id,name')->find($id);

        return response()->json(['success' => true, 'application' => $application]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'employee_id' => 'required|exists:users,id',
            'leave_category_id' => 'required|exists:leave_categories,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'required|string',
            'status' => 'required|in:pending,approved,rejected',
        ]);

        try {
            $employeeId = Employee::where('user_id', $request->employee_id)->value('id');
            $startDate = Carbon::parse($request->start_date);
            $endDate = Carbon::parse($request->end_date);

            LeaveApplication::find($id)->update([
                'employee_id' => $employeeId,
                'leave_category_id' => $request->leave_category_id,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'reason' => $request->reason,
                'number_of_days' => $startDate->diffInDays($endDate) + 1,
                'status' => $request->status
            ]);

            return response()->json(['success' => true, 'message' => 'Leave application updated successfully']);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'message' => $th->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}