<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\ZKTecoService;
use App\Models\Attendance;
use App\Models\Employee;
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
        $logs = $this->zkService->getAttendance(); // Assuming this is how you fetch the logs from ZKTeco
        if (!$logs) {
            $this->info("No attendance data found.");
            return;
        }

        // Define the standard working time (e.g., 9:00 AM) for late arrival check
        $standardTime = Carbon::createFromFormat('H:i', '09:00');

        foreach ($logs as $log) {
            // Fetch the employee data based on the employee ID
            $employee = Employee::where('employee_id', $log['id'])->first();
            if ($employee) {
                // Prepare attendance data
                $attendanceData = [
                    'employee_id' => $employee->id,
                    'date' => Carbon::parse($log['timestamp'])->format('Y-m-d'),
                    'check_in' => $log['type'] === 'check-in' ? Carbon::parse($log['timestamp'])->format('H:i:s') : null,
                    'check_out' => $log['type'] === 'check-out' ? Carbon::parse($log['timestamp'])->format('H:i:s') : null,
                ];

                // If the check-in time exists, check if it's late and update status
                if ($attendanceData['check_in']) {
                    $checkInTime = Carbon::parse($attendanceData['check_in']);

                    // If the check-in time is later than the standard time (e.g., 9:00 AM), mark as late
                    if ($checkInTime->gt($standardTime)) {
                        $attendanceData['status'] = 'late'; // Mark the status as late
                    } else {
                        $attendanceData['status'] = 'present'; // If on time, mark as present
                    }
                }

                // Check if an attendance record already exists for the employee on this date
                $attendance = Attendance::where('employee_id', $attendanceData['employee_id'])->where('date', $attendanceData['date'])->first();

                // If the attendance exists but doesn't have a check-in time, update all fields
                if ($attendance && !$attendance->check_in && $attendanceData['check_in']) {
                    // Update all fields: check_in and check_out (if available)
                    $attendance->update($attendanceData);
                } elseif ($attendance && $attendance->check_in && !$attendance->check_out && $attendanceData['check_out']) {
                    // If attendance already has check-in but doesn't have check-out, only update check-out
                    $attendance->update(['check_out' => $attendanceData['check_out']]);
                } elseif (!$attendance) {
                    // If no attendance record exists for the employee on that day, create a new one
                    Attendance::create($attendanceData);
                }
            }
        }

        $this->info("Attendance sync completed.");
    }
}