<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Booking;
use App\Models\BookingPlan;
use App\Models\Branch;
use App\Models\Invoice;
use App\Models\User;
use App\Notifications\GeneralNotification;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class GenerateFullDayInvoice extends Command
{
    protected $signature = 'invoice:generate-fullday';
    protected $description = 'Generate invoices for full-day bookings every hour';

    public function handle()
    {
        // Get all confirmed full-day bookings that have ended
        $bookings = Booking::where('status', 'confirmed')->where('duration', 'full_day')->where('end_time', '<=', now())->get();

        $branch = Branch::find(1); // Replace with dynamic branch retrieval if needed

        foreach ($bookings as $booking) {
            try {
                $bookingPlan = BookingPlan::select('id', 'name', 'price')->find($booking->plan->id);
                $user = User::find($booking->user_id);
                $admin = User::find($branch->user_id);

                // Create invoice for the booking
                $invoice = Invoice::create([
                    'branch_id' => $booking->branch_id,
                    'booking_id' => $booking->id,
                    'user_id' => $booking->user_id,
                    'invoice_type' => 'full_day',
                    'due_date' => now()->addDays(2)->format('Y-m-d'),
                    'amount' => count($booking->chair_ids) * $bookingPlan->price,
                    "plan" => $bookingPlan,
                    'payment_type' => $booking->payment_method,
                ]);

                // Send notification to user
                $userInvoiceNotificationData = [
                    'title' => "Invoice Created - {$branch->name}",
                    'message' => "Your invoice #{$invoice->id} for {$invoice->invoice_type} has been created and is due on {$invoice->due_date}.",
                    'type' => 'invoice_created',
                    'invoice_id' => $invoice->id,
                    'created_by' => $branch->name,
                ];

                $user->notify(new GeneralNotification($userInvoiceNotificationData));

                // Send notification to admin
                $adminInvoiceNotificationData = [
                    'title' => "Invoice Created - User: {$user->name}",
                    'message' => "An invoice (#{$invoice->id}) has been created for User ID {$user->id} in {$branch->name}.",
                    'type' => 'invoice_created',
                    'invoice_id' => $invoice->id,
                    'created_by' => $admin->name,
                ];

                $admin->notify(new GeneralNotification($adminInvoiceNotificationData));

                // Update booking status to completed
                $booking->update(['status' => 'completed']);

                Log::info("Full-day invoice generated for Booking ID: {$booking->id}");
            } catch (\Exception $e) {
                Log::error("Failed to generate invoice for Booking ID: {$booking->id} - Error: {$e->getMessage()}");
            }
        }

        $this->info('Full-day invoices generated successfully.');
    }
}