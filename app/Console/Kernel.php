<?php

namespace App\Console;

use Carbon\Carbon;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // 🎯 CORE MONTHLY BILLING CYCLE
        
        // End of Month: Generate next month's invoices
        $schedule->command('invoice:generate-monthly')->monthlyOn(Carbon::now()->endOfMonth()->day, '23:59');
        
        // Start of Month: Manage packages and quotas  
        $schedule->command('packages:manage-monthly')->monthlyOn(1, '00:30');
        $schedule->command('packages:manage-monthly')->monthlyOn(2, '00:30'); // Safety
        $schedule->command('packages:manage-monthly')->monthlyOn(3, '00:30'); // Safety
        
        // Mid Month: Check overdue invoices
        $schedule->command('invoices:check')->monthlyOn(3, '23:59');
        $schedule->command('invoices:check')->monthlyOn(4, '23:59');

        // 🎯 OTHER OPERATIONS
        
        // Full-day bookings: Every hour
        $schedule->command('invoice:generate-fullday')->hourly();
        
        // Attendance sync: Business hours
        $schedule->command('sync:attendance')->cron('*/5 9-21 * * *');
        
        // 📧 OPTIONAL: Invoice reminders (uncomment if needed)
        $schedule->command('invoices:send-reminders')->daily();
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
}