<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Booking;
use App\Models\BookingPlan;
use App\Models\Branch;
use App\Models\Invoice;
use App\Models\Package;
use App\Models\User;
use App\Notifications\GeneralNotification;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class GenerateMonthlyInvoice extends Command
{
    protected $signature = 'invoice:generate-monthly';
    protected $description = 'Generate invoices for monthly bookings at the end and start of the month';

    public function handle()
    {
        // Get all confirmed monthly bookings
        $bookings = Booking::where('status', 'confirmed')->where('duration', 'monthly')->get();

        $branch = Branch::find(1);

        foreach ($bookings as $booking) {
            try {
                $bookingPlan = BookingPlan::select('id', 'name', 'price')->find($booking->plan->id);
                $user = User::find($booking->user_id);
                $admin = User::find($branch->user_id);

                $invoice = Invoice::create([
                    'branch_id' => $booking->branch_id,
                    'booking_id' => $booking->id,
                    'user_id' => $booking->user_id,
                    'invoice_type' => 'monthly',
                    'due_date' => now()->addDays(5)->format('Y-m-d'),
                    'amount' => count($booking->chair_ids) * $bookingPlan->price,
                    "plan" => $bookingPlan,
                    'payment_type' => $booking->payment_method,
                ]);

                $booking->update(['status' => 'completed']);

                $user->update([
                    'booking_quota' => 0,
                    // 'total_booking_quota' => 0,
                    'printing_quota' => 0,
                    // 'total_printing_quota' => 0,
                ]);

                $userInvoiceNotificationData = [
                    'title' => "Invoice Created - {$branch->name}",
                    'message' => "Your invoice #nastp-{$invoice->id} for {$invoice->invoice_type} has been created and is due on {$invoice->due_date}.",
                    'type' => 'invoice_created',
                    'invoice_id' => $invoice->id,
                    'created_by' => $branch->name,
                ];

                $user->notify(new GeneralNotification($userInvoiceNotificationData));

                $adminInvoiceNotificationData = [
                    'title' => "Invoice Created - User: {$user->name}",
                    'message' => "An invoice (#nastp-{$invoice->id}) has been created for User {$user->name} in {$branch->name}.",
                    'type' => 'invoice_created',
                    'invoice_id' => $invoice->id,
                    'created_by' => $admin->name,
                ];

                $admin->notify(new GeneralNotification($adminInvoiceNotificationData));
            } catch (\Exception $e) {
                Log::error("Failed to generate invoice for Booking ID: {$booking->id} - Error: {$e->getMessage()}");
            }
        }

        $this->info('Monthly invoices generated successfully.');
    }
}