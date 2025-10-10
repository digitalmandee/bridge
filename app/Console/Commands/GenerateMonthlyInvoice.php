<?php

namespace App\Console\Commands;

use App\Models\Booking;
use App\Models\BookingPlan;
use App\Models\Branch;
use App\Models\Invoice;
use App\Models\Package;
use App\Models\Tenant;
use App\Models\User;
use App\Models\UserPackage;
use App\Notifications\GeneralNotification;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class GenerateMonthlyInvoice extends Command
{
    protected $signature = 'invoice:generate-monthly';
    protected $description = 'Generate invoices for monthly bookings at the end and start of the month';

    public function handle()
    {
        $branches = Tenant::all();
        $today = Carbon::now();
        $nextMonth = $today->copy()->addMonth()->format('F');
        $nextYear = $today->copy()->addMonth()->year;

        foreach ($branches as $branch) {
            tenant()->initialize($branch);

            // Get all confirmed monthly bookings with active packages
            $bookings = Booking::where('status', 'confirmed')
                ->where('duration', 'monthly')
                ->whereHas('userPackage', function($query) {
                    $query->where('status', 'active');
                })
                ->get();

            foreach ($bookings as $booking) {
                try {
                    $user = User::find($booking->user_id);
                    $admin = User::where('email', $branch->email)->first();
                    $userPackage = $booking->userPackage;

                    // Check if invoice for next month already exists
                    $existingInvoice = Invoice::where('booking_id', $booking->id)
                        ->where('invoice_type', 'Monthly')
                        ->where('paid_year', $nextYear)
                        ->whereJsonContains('paid_month', $nextMonth)
                        ->first();

                    if ($existingInvoice) {
                        continue; // Skip if invoice already exists
                    }

                    // Calculate amount based on chair count from bookingChairs relationship
                    $totalChairs = $booking->bookingChairs()->count();
                    $planPrice = $booking->plan['price'] ?? 0;

                    $invoice = Invoice::create([
                        'booking_id' => $booking->id,
                        'user_id' => $booking->user_id,
                        'invoice_type' => 'Monthly',
                        'due_date' => $today->copy()->addDays(5)->format('Y-m-d'),
                        'amount' => $totalChairs * $planPrice,
                        'plan' => $booking->plan,
                        'payment_type' => $booking->payment_method,
                        'paid_month' => [$nextMonth],
                        'paid_year' => $nextYear,
                        'status' => 'pending',
                    ]);

                    $userInvoiceNotificationData = [
                        'title' => "Invoice Created - {$branch->name}",
                        'message' => "Your invoice #{$invoice->id} for {$invoice->invoice_type} ({$nextMonth} {$nextYear}) has been created and is due on {$invoice->due_date}.",
                        'type' => 'invoice_created',
                        'invoice_id' => $invoice->id,
                        'created_by' => $branch->name,
                    ];

                    $user->notify(new GeneralNotification($userInvoiceNotificationData));

                    $adminInvoiceNotificationData = [
                        'title' => "Invoice Created - User: {$user->name}",
                        'message' => "An invoice (#{$invoice->id}) has been created for User {$user->name} for {$nextMonth} {$nextYear} in {$branch->name}.",
                        'type' => 'invoice_created',
                        'invoice_id' => $invoice->id,
                        'created_by' => $admin->name,
                    ];

                    $admin->notify(new GeneralNotification($adminInvoiceNotificationData));

                    Log::info("Generated monthly invoice for Booking ID: {$booking->id}, Month: {$nextMonth} {$nextYear}");
                } catch (\Exception $e) {
                    Log::error("Failed to generate invoice for Booking ID: {$booking->id} - Error: {$e->getMessage()}");
                }
            }
        }

        $this->info('Monthly invoices generated successfully.');
    }
}