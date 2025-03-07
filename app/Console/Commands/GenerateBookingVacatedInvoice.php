<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Booking;
use App\Models\User;
use App\Models\Invoice;
use App\Models\Branch;
use App\Models\BookingPlan;
use App\Notifications\GeneralNotification;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class GenerateBookingVacatedInvoice extends Command
{
    protected $signature = 'invoice:generate-vacated';
    protected $description = 'Generate invoices for vacated bookings of the current month and mark them inactive';

    public function handle()
    {
        $now = Carbon::now(); // Current date and time
        $startOfMonth = $now->copy()->startOfMonth(); // First day of this month
        $endOfMonth = $now->copy()->endOfMonth(); // Last day of this month

        $branch = Branch::find(1);

        // Get vacated bookings for this month where end_date falls within the current month
        $vacatedBookings = Booking::where('status', 'vacated')
            ->whereBetween('end_date', [$startOfMonth, $endOfMonth]) // Ensure booking ended this month
            ->get();

        foreach ($vacatedBookings as $booking) {
            try {
                $endDateTime = Carbon::parse($booking->end_date . ' ' . $booking->end_time);

                if ($now->greaterThanOrEqualTo($endDateTime)) {
                    // Mark booking as inactive
                    $booking->update(['status' => 'completed']);
                    Log::info("Booking ID: {$booking->id} has been marked as inactive due to vacancy.");

                    // Notify Admin about the vacated booking
                    $admin = User::find($branch->user_id);
                    $adminNotificationData = [
                        'title' => "Booking Vacated - User: {$booking->user->name}",
                        'message' => "The booking for User {$booking->user->name} (ID: {$booking->id}) has been vacated.",
                        'type' => 'booking_vacated',
                        'booking_id' => $booking->id,
                        'created_by' => $admin->name,
                    ];
                    $admin->notify(new GeneralNotification($adminNotificationData));

                    $user = User::find($booking->user_id);

                    $user->update([
                        'booking_quota' => 0,
                        'printing_quota' => 0,
                    ]);

                    continue; // Skip invoice generation for already expired vacated bookings
                }
            } catch (\Exception $e) {
                Log::error("Failed to process Booking ID: {$booking->id} - Error: {$e->getMessage()}");
            }
        }

        $this->info('This month\'s vacated bookings processed successfully.');
    }
}