<?php

namespace App\Console\Commands;

use App\Models\Booking;
use App\Models\Invoice;
use App\Models\Tenant;
use App\Models\User;
use App\Models\UserAddon;
use App\Models\UserPackage;
use App\Notifications\GeneralNotification;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class ManageMonthlyPackages extends Command
{
    protected $signature = 'packages:manage-monthly';
    protected $description = 'Manage monthly package renewals, expire old quotas and create new ones for paid invoices';

    public function handle()
    {
        $branches = Tenant::all();
        $today = Carbon::now();
        $currentMonth = $today->format('F');
        $currentYear = $today->year;

        foreach ($branches as $branch) {
            tenant()->initialize($branch);
            Log::info("Managing monthly packages for branch: {$branch->id}");

            // Get all active monthly bookings with confirmed status
            $activeBookings = Booking::where('duration', 'monthly')
                ->where('status', 'confirmed')
                ->whereHas('userPackage', function($query) {
                    $query->where('status', 'active');
                })
                ->get();

            foreach ($activeBookings as $booking) {
                try {
                    $this->processMonthlyBooking($booking, $today, $currentMonth, $currentYear, $branch);
                } catch (\Exception $e) {
                    Log::error("Failed to process booking ID: {$booking->id} - Error: {$e->getMessage()}");
                }
            }
        }

        $this->info('Monthly packages managed successfully.');
    }

    private function processMonthlyBooking($booking, $today, $currentMonth, $currentYear, $branch)
    {
        $user = $booking->user;
        $userPackage = $booking->userPackage;

        // Check if we're at the start of a new month and package is still valid
        if ($today->day <= 5 && $userPackage && $userPackage->status === 'active') {
            
            // 1. Expire previous month's addons (if any exist)
            $this->expirePreviousMonthAddons($userPackage->id, $currentMonth, $currentYear);

            // 2. Check if there's a paid invoice for current month
            $paidInvoice = Invoice::where('booking_id', $booking->id)
                ->where('invoice_type', 'Monthly')
                ->where('status', 'paid')
                ->where('paid_year', $currentYear)
                ->whereJsonContains('paid_month', $currentMonth)
                ->first();

            if ($paidInvoice) {
                // 3. Create new addons for the current month
                $this->createMonthlyAddons($booking, $userPackage, $currentMonth);
                
                // 4. Update package validity
                $this->updatePackageValidity($userPackage, $currentMonth, $currentYear);
                
                Log::info("Created new monthly addons for booking ID: {$booking->id}, Month: {$currentMonth}");
            } else {
                // 5. No payment found - check if grace period expired
                $this->handleUnpaidMonth($booking, $userPackage, $currentMonth, $branch);
            }
        }

        // Check for overdue packages that need to be expired
        if ($userPackage && $userPackage->valid_to < $today && $userPackage->status === 'active') {
            $this->expirePackage($userPackage, $booking, $branch);
        }
    }

    private function expirePreviousMonthAddons($userPackageId, $currentMonth, $currentYear)
    {
        // Get previous month
        $previousMonth = Carbon::createFromDate($currentYear, date('n', strtotime($currentMonth)), 1)
            ->subMonth()
            ->format('F');

        // Find and delete addons from previous month (since UserAddon doesn't have status field)
        $previousMonthStart = Carbon::createFromDate($currentYear, date('n', strtotime($previousMonth)), 1);
        $previousMonthEnd = Carbon::createFromDate($currentYear, date('n', strtotime($currentMonth)), 1);

        $deletedCount = UserAddon::where('user_package_id', $userPackageId)
            ->where('created_at', '>=', $previousMonthStart)
            ->where('created_at', '<', $previousMonthEnd)
            ->delete();

        Log::info("Deleted {$deletedCount} addons from {$previousMonth} for package ID: {$userPackageId}");
    }

    private function createMonthlyAddons($booking, $userPackage, $currentMonth)
    {
        $totalChairs = $booking->bookingChairs()->count();
        $admin = auth()->user() ?? User::find(1); // Fallback to admin

        // Create booking hours addon for current month
        UserAddon::create([
            'user_package_id' => $userPackage->id,
            'user_id' => $booking->user_id,
            'addon_type' => 'booking_hours',
            'total' => $totalChairs * $booking->plan['booking_hours'],
            'remaining' => $totalChairs * $booking->plan['booking_hours'],
            'price' => 0,
            'purchased_at' => Carbon::now(),
            'created_by' => $admin->id ?? 1,
        ]);

        // Create printing papers addon for current month
        UserAddon::create([
            'user_package_id' => $userPackage->id,
            'user_id' => $booking->user_id,
            'addon_type' => 'printing_papers',
            'total' => $totalChairs * $booking->plan['printing_papers'],
            'remaining' => $totalChairs * $booking->plan['printing_papers'],
            'price' => 0,
            'purchased_at' => Carbon::now(),
            'created_by' => $admin->id ?? 1,
        ]);
    }

    private function updatePackageValidity($userPackage, $currentMonth, $currentYear)
    {
        // Extend package validity to end of current month
        $endOfMonth = Carbon::createFromDate($currentYear, date('n', strtotime($currentMonth)), 1)->endOfMonth();
        
        $userPackage->update([
            'valid_to' => $endOfMonth,
            'updated_at' => Carbon::now()
        ]);
    }

    private function handleUnpaidMonth($booking, $userPackage, $currentMonth, $branch)
    {
        $gracePeriodDays = 5; // Allow 5 days grace period
        $today = Carbon::now();
        
        // Check if grace period has expired
        if ($today->day > $gracePeriodDays) {
            // Suspend package (don't create new addons)
            $userPackage->update(['status' => 'suspended']);
            
            // Notify user about suspension
            $user = $booking->user;
            $admin = User::where('email', $branch->email)->first();

            $userNotification = [
                'title' => "Package Suspended - {$branch->name}",
                'message' => "Your monthly package has been suspended due to unpaid invoice for {$currentMonth}. Please make payment to reactivate.",
                'type' => 'package_suspended',
                'booking_id' => $booking->id,
                'created_by' => $branch->name,
            ];

            $user->notify(new GeneralNotification($userNotification));

            Log::info("Package suspended for booking ID: {$booking->id} due to unpaid {$currentMonth}");
        }
    }

    private function expirePackage($userPackage, $booking, $branch)
    {
        // Expire the package
        $userPackage->update(['status' => 'expired']);

        // Delete all addons for this package (since UserAddon doesn't have status field)
        $deletedAddons = UserAddon::where('user_package_id', $userPackage->id)->delete();

        // Update booking status
        $booking->update(['status' => 'expired']);

        // Check if user has any other active packages
        $hasActivePackages = UserPackage::where('user_id', $booking->user_id)
            ->where('status', 'active')
            ->exists();

        if (!$hasActivePackages) {
            $booking->user->update(['status' => 'inactive']);
        }

        Log::info("Expired package and booking ID: {$booking->id}, deleted {$deletedAddons} addons");
    }
}
