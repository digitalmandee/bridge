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
        // Monthly invoice: Runs at the end & start of the month
        $schedule->command('invoice:generate-monthly')->monthlyOn(Carbon::now()->endOfMonth()->day, '23:59');
        $schedule->command('invoice:generate-monthly')->monthlyOn(1, '00:05');

        // Full-day invoice: Runs every hour
        $schedule->command('invoice:generate-fullday')->hourly();

        // Monthly attendance: Runs at the end of the month
        $schedule->command('sync:attendance')->cron('*/5 9-21 * * *');  // Every 5 minutes from 9 AM to 9 PM
        // */5: Every 5 minutes.
        // 9-21: From 9 AM (9) to 9 PM (21).
        // * * *: Every day of the month, every month, and every day of the week.
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