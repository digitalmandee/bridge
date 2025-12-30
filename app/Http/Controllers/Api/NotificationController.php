<?php

namespace App\Http\Controllers\Api;

use App\Helpers\MailHelper;
use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\User;
use App\Notifications\GeneralNotification;
use Carbon\Carbon;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    //
    public function getNotifications(Request $request)
    {
        $status = $request->input('status', 'unread');
        $limit = $request->input('limit', 10);  // Default limit

        $query = auth()->user()->notifications();

        if ($status === 'All') {
            $notifications = $query->paginate($limit);
        } elseif ($status === 'Read') {
            $notifications = $query->whereNotNull('read_at')->paginate($limit);
        } else {
            $notifications = $query->whereNull('read_at')->paginate($limit);
        }

        $unreadNotificationsCount = auth()->user()->unreadNotifications()->count();

        return response()->json([
            'notifications' => $notifications->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'title' => $notification->data['title'],
                    'message' => $notification->data['message'],
                    'type' => $notification->data['type'],
                    'created_by' => $notification->data['created_by'] ?? 'System',
                    'created_at' => Carbon::parse($notification->created_at)->diffForHumans(),
                    'is_read' => $notification->read_at ? true : false,
                ];
            }),
            'unread' => $unreadNotificationsCount,
            'last_page' => $notifications->lastPage(),
            'current_page' => $notifications->currentPage(),
        ]);
    }

    public function markAsRead($id)
    {
        $notification = auth()->user()->notifications()->find($id);
        if ($notification) {
            $notification->markAsRead();
            return response()->json(['message' => 'Notification marked as read']);
        }
        return response()->json(['error' => 'Notification not found'], 404);
    }

    public function sendNotification(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $admin = auth()->user();
        $user = User::findOrFail($request->user_id);
        $invoiceStatus = $request->invoice_status;

        $invoice = Invoice::with(['user'])->find($request->invoice_id);

        if (!$invoice) {
            return response()->json(['success' => false, 'message' => 'Invoice not found.'], 404);
        }

        $notificationData = [
            'paid' => [
                'title' => 'Invoice Paid - ' . tenant('name'),
                'message' => "Your invoice #{$request->invoice_id} has been paid.",
                'type' => 'invoice_paid',
            ],
            'overdue' => [
                'title' => 'Invoice Overdue - ' . tenant('name'),
                'message' => "Your invoice #{$request->invoice_id} is overdue for payment.",
                'type' => 'invoice_overdue',
            ],
            'pending' => [
                'title' => 'Pending Invoice - ' . tenant('name'),
                'message' => "Your invoice #{$request->invoice_id} is pending and awaiting action from {$admin->name}.",
                'type' => 'invoice_pending',
            ],
        ];

        $userNotificationData = $notificationData[$invoiceStatus] ?? $notificationData['pending'];

        // Send Database Notification first
        $user->notify(new GeneralNotification($userNotificationData));

        // Prepare data for email
        $emailData = [
            'username' => $user->name,
            'title' => $userNotificationData['title'],
            'message' => $userNotificationData['message'],
            'invoice_id' => $request->invoice_id,
            'status' => $invoiceStatus,
            // Map data to match invoice.blade.php expectation ($data['invoice']['items'], etc)
            'invoice' => $invoice->toArray(),
            'user' => $user->toArray(),
            'amount' => $invoice->amount,
            'invoiceType' => $invoice->invoice_type,
            'dueDate' => $invoice->due_date,
        ];

        // Send Email using MailHelper
        MailHelper::sendInvoiceStatusMail($user->email, $emailData);

        // Update notify timestamp
        $invoice->notify = Carbon::now();
        $invoice->save();

        return response()->json(['success' => true, 'message' => 'Notification and email sent successfully.', 'notify_date' => $invoice->notify]);
    }
}
