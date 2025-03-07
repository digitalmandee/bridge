<?php

namespace App\Console\Commands;

use App\Models\Invoice;
use App\Models\Tenant;
use App\Models\User;
use App\Notifications\GeneralNotification;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class SendInvoiceReminders extends Command
{
    protected $signature = 'invoices:send-reminders';
    protected $description = 'Send reminders to users with unpaid invoices';

    public function handle()
    {
        $branches = Tenant::all();
        $today = Carbon::today();

        foreach ($branches as $branch) {
            tenant()->initialize($branch);

            $invoices = Invoice::where('status', 'pending')
                ->whereDate('due_date', '<=', $today->addDays(3))
                ->get();

            foreach ($invoices as $invoice) {
                $user = User::find($invoice->user_id);

                if ($user) {
                    $userNotify = [
                        'title' => 'Payment Reminder: Your Invoice is Due',
                        'message' => "Your invoice #{$invoice->id} is due soon.
                                         Please pay before {$invoice->due_date->format('Y-m-d')} to avoid service disruption.",
                        'type' => 'payment_reminder',
                        'invoice_id' => $invoice->id,
                        'created_by' => $branch->name,
                    ];

                    $user->notify(new GeneralNotification($userNotify));
                }
            }

            $this->info('Invoice reminders sent.');
        }
    }
}