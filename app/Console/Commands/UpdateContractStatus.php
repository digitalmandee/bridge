<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Contract;
use App\Models\User;
use App\Notifications\GeneralNotification;
use Carbon\Carbon;

class UpdateContractStatus extends Command
{
    protected $signature = 'contracts:update-status';
    protected $description = 'Automatically mark contracts as Completed when their end date has passed';

    public function handle()
    {
        $today = Carbon::today();

        // Find contracts where end_date has passed and status is "signed"
        $contracts = Contract::where('end_date', '<', $today)->where('status', '=', 'signed')->get();

        foreach ($contracts as $contract) {
            // Update contract status to "completed"
            $contract->status = 'completed';
            $contract->save();

            // Notification data for the user
            $userInvoiceNotificationData = [
                'title' => "Contract Status Updated - {$contract->branch->name}",
                'message' => "Your contract #{$contract->id} has been marked as Completed. Please check the details.",
                'type' => 'contract_completed',
                'contract_id' => $contract->id,
                'created_by' => $contract->branch->name,
            ];

            // Send notification to the user
            $contract->user->notify(new GeneralNotification($userInvoiceNotificationData));

            // Notification data for the admin
            $adminInvoiceNotificationData = [
                'title' => "Contract Status Updated - User: {$contract->user->name}",
                'message' => "The contract #{$contract->id} for {$contract->user->name} has been marked as Completed.",
                'type' => 'contract_completed',
                'contract_id' => $contract->id,
                'created_by' => $contract->branch->name,
            ];

            // Assuming you have an Admin user, or you can fetch the admin from the database
            $admin = User::find($contract->branch->user_id);

            // Send notification to the admin
            if ($admin) {
                $admin->notify(new GeneralNotification($adminInvoiceNotificationData));
            }

            $this->info("Contract #nastp-{$contract->id} status updated to 'Completed'.");
        }
    }
}