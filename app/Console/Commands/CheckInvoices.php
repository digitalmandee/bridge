<?php

namespace App\Console\Commands;

use App\Models\Booking;
use App\Models\Invoice;
use App\Models\Tenant;
use App\Models\User;
use App\Models\UserPackage;
use App\Models\UserAddon;
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

            // Get all active monthly bookings with packages
            $bookings = Booking::where('duration', 'monthly')
                ->where('status', 'confirmed')
                ->whereHas('userPackage', function($query) use ($today) {
                    $query->where('status', 'active')
                          ->where('valid_to', '<=', $today);
                })
                ->get();

            foreach ($bookings as $booking) {
                $userId = $booking->user_id;
                $bookingId = $booking->id;
                $userPackage = $booking->userPackage;
                $dueDate = Carbon::parse($userPackage->valid_to);

                // If today is the due date, check for payment and handle accordingly
                if ($today->isSameDay($dueDate)) {
                    $currentMonth = $today->format('F');
                    $currentYear = $today->year;

                    // Check if there's a paid invoice for current month
                    $paidInvoice = Invoice::where('booking_id', $booking->id)
                        ->where('invoice_type', 'Monthly')
                        ->where('status', 'paid')
                        ->where('paid_year', $currentYear)
                        ->whereJsonContains('paid_month', $currentMonth)
                        ->first();

                    if (!$paidInvoice) {
                        // No payment found - suspend package
                        $userPackage->update(['status' => 'suspended']);
                        
                        // Delete current month's addons (since UserAddon doesn't have status field)
                        $deletedAddons = UserAddon::where('user_package_id', $userPackage->id)
                            ->where('created_at', '>=', $today->startOfMonth())
                            ->delete();
                        
                        Log::info("Suspended package and deleted {$deletedAddons} addons for booking ID: {$booking->id}");
                    }

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