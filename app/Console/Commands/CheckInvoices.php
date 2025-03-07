<?php

namespace App\Console\Commands;

use App\Models\Booking;
use App\Models\Invoice;
use App\Models\Tenant;
use App\Models\User;
use App\Notifications\GeneralNotification;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class CheckInvoices extends Command
{
    protected $signature = 'invoices:check';
    protected $description = 'Check for due invoices, send notifications, and create new monthly invoices';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        $branches = Tenant::all();
        $today = Carbon::now();  // Store current date to ensure consistency

        foreach ($branches as $branch) {
            tenant()->initialize($branch);
            Log::info("Checking invoices for branch: {$branch->id}");

            // Get all active monthly bookings
            $bookings = Booking::where('duration', 'monthly')->where('package_end_time', '<=', $today)->where('status', 'confirmed')->get();

            foreach ($bookings as $booking) {
                $userId = $booking->user_id;
                $bookingId = $booking->id;
                $dueDate = Carbon::parse($booking->package_end_time);  // End of the current package

                // If today is the due date, generate a new invoice
                if ($today->isSameDay($dueDate)) {
                    $booking->user->update([
                        'booking_quota' => 0,
                        // 'total_booking_quota' => 0,
                        'printing_quota' => 0,
                        // 'total_printing_quota' => 0,
                    ]);

                    $admin = User::where('email', $branch->email)->first();

                    $invoice = Invoice::create([
                        'user_id' => $userId,
                        'booking_id' => $bookingId,
                        'branch_id' => $booking->branch_id,
                        'invoice_type' => 'Monthly',
                        'amount' => $booking->total_price,
                        'status' => 'pending',
                        'plan' => $booking->plan,
                        'due_date' => $today->copy()->addDays(3),  // Give 3 days to pay
                    ]);

                    $userInvoiceNotificationData = [
                        'title' => "Invoice Created - {$branch->name}",
                        'message' => "Your invoice #nastp-{$invoice->id} for {$invoice->invoice_type} has been created and is due on {$invoice->due_date}.",
                        'type' => 'invoice_created',
                        'invoice_id' => $invoice->id,
                        'created_by' => $branch->name,
                    ];
                    $userNotifyThreeToRenew = [
                        'title' => "Renewal Reminder - {$branch->name}",
                        'message' => "Reminder: Your booking at {$branch->name} is due for renewal in 3 days.
                                         Please make the payment before {$invoice->due_date->format('Y-m-d')} to continue your service.",
                        'type' => 'renewal_reminder',
                        'invoice_id' => $invoice->id,
                        'created_by' => $branch->name,
                    ];

                    $booking->user->notify(new GeneralNotification($userInvoiceNotificationData));
                    $booking->user->notify(new GeneralNotification($userNotifyThreeToRenew));

                    $adminInvoiceNotificationData = [
                        'title' => "Invoice Created - User: {$booking->user->name}",
                        'message' => "An invoice (#nastp-{$invoice->id}) has been created for User {$booking->user->name} in {$branch->name}.",
                        'type' => 'invoice_created',
                        'invoice_id' => $invoice->id,
                        'created_by' => $admin->name,
                    ];

                    $admin->notify(new GeneralNotification($adminInvoiceNotificationData));

                    Log::info("Invoice generated for User {$userId}, Booking: {$bookingId}.");
                }

                // If 3 days overdue, mark booking as vacated
                $overdueDate = $dueDate->copy()->addDays(3);
                if ($today->greaterThan($overdueDate)) {
                    $booking->update(['status' => 'vacated']);

                    $userNotifyVacated = [
                        'title' => "Booking Marked as Vacated - {$branch->name}",
                        'message' => "Your booking at {$branch->name} has been marked as vacated due to non-payment.
                                         Please contact support if you wish to renew or have any concerns.",
                        'type' => 'booking_vacated',
                        'invoice_id' => $invoice->id,
                        'created_by' => $branch->name,
                    ];

                    $booking->user->notify(new GeneralNotification($userNotifyVacated));

                    $adminUserVacatedNotificationData = [
                        'title' => "Booking Vacated - User: {$booking->user->name}",
                        'message' => "User {$booking->user->name}'s booking at {$branch->name} has been marked as vacated due to non-payment.
                                         The related invoice (#nastp-{$invoice->id}) remains unpaid.",
                        'type' => 'booking_vacated',
                        'invoice_id' => $invoice->id,
                        'created_by' => $admin->name,
                    ];

                    $admin->notify(new GeneralNotification($adminUserVacatedNotificationData));

                    Log::info("Booking {$bookingId} for User {$userId} marked as vacated for non-payment.");
                }
            }

            $this->info('Invoices checked successfully.');
        }
    }
}