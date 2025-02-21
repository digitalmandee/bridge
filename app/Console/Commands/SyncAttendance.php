<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\ZKTecoService;
use App\Models\Attendance;
use App\Models\Employee;
use App\Models\LeaveApplication;
use Carbon\Carbon;

class SyncAttendance extends Command
{
    protected $signature = 'sync:attendance';
    protected $description = 'Fetch attendance from ZKTeco and update database';
    protected $zkService;

    public function __construct(ZKTecoService $zkService)
    {
        parent::__construct();
        $this->zkService = $zkService;
    }

    public function handle()
    {
        // Fetch attendance data from ZKTeco
        // $logs = $this->zkService->getAttendance();

        $logs = [
            [
                "uid" => 1,
                "id" => "12",
                "timestamp" => "2025-02-21 9:00:00",
                "type" => 'check-in'
            ],
            [
                "uid" => 1,
                "id" => "13",
                "timestamp" => "2025-02-21 9:10:00",
                "type" => 'check-in'
            ]
        ];

        if (!$logs) {
            $this->info("No attendance data found.");
        }

        // Define the standard working time (e.g., 9:00 AM) for late arrival check
        $standardTime = Carbon::createFromFormat('H:i', '09:00');
        $today = Carbon::today()->format('Y-m-d');

        // Get all employees
        $employees = Employee::all();

        // Track employees who have attendance logs today
        $employeesWithAttendance = [];

        foreach ($logs as $log) {
            $employee = Employee::where('employee_id', $log['id'])->first();

            if ($employee) {
                $employeesWithAttendance[] = $employee->id;

                $attendanceData = [
                    'branch_id' => $employee->branch_id,
                    'employee_id' => $employee->id,
                    'date' => Carbon::parse($log['timestamp'])->format('Y-m-d'),
                    'check_in' => $log['type'] === 'check-in' ? Carbon::parse($log['timestamp'])->format('H:i:s') : null,
                    'check_out' => $log['type'] === 'check-out' ? Carbon::parse($log['timestamp'])->format('H:i:s') : null,
                ];

                if ($attendanceData['check_in']) {
                    $checkInTime = Carbon::parse($attendanceData['check_in']);
                    $attendanceData['status'] = $checkInTime->gt($standardTime) ? 'late' : 'present';
                }

                $attendance = Attendance::where('employee_id', $attendanceData['employee_id'])
                    ->where('date', $attendanceData['date'])
                    ->first();

                if ($attendance) {
                    if (!$attendance->check_in && $attendanceData['check_in']) {
                        $attendance->update($attendanceData);
                    } elseif ($attendance->check_in && !$attendance->check_out && $attendanceData['check_out']) {
                        $attendance->update(['check_out' => $attendanceData['check_out']]);
                    }
                } else {
                    Attendance::create($attendanceData);
                }
            }
        }

        // Check for employees who have no attendance records
        foreach ($employees as $employee) {
            if (!in_array($employee->id, $employeesWithAttendance)) {
                // Check if the employee is on leave today
                $onLeave = LeaveApplication::where('employee_id', $employee->id)
                    ->whereDate('start_date', '<=', $today)
                    ->whereDate('end_date', '>=', $today)
                    ->where('status', 'approved') // Ensure leave is approved
                    ->exists();

                // Set status based on leave status
                $status = $onLeave ? 'leave' : 'absent';

                Attendance::updateOrCreate(
                    ['branch_id' => $employee->branch_id, 'employee_id' => $employee->id, 'date' => $today],
                    ['status' => $status]
                );
            }
        }

        $this->info("Attendance sync completed.");
    }
}