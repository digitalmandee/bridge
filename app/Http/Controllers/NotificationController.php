<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Notifications\GeneralNotification;
use Carbon\Carbon;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    //
    public function getNotifications()
    {
        return auth()->user()->notifications->map(function ($notification) {
            return [
                'id' => $notification->id,
                'title' => $notification->data['title'],
                'message' => $notification->data['message'],
                'type' => $notification->data['type'],
                'created_by' => $notification->data['created_by'] ?? 'System',
                'created_at' => Carbon::parse($notification->created_at)->diffForHumans(), // Converts to "2 mins ago"
            ];
        });
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
        $user = User::where('id', $request->user_id)->first();
        $invoiceStatus = $request->invoice_status;

        $notificationData = [
            'paid' => [
                'title' => "Invoice Paid - {$admin->branch->name}",
                'message' => "Your invoice #{$request->invoice_id} has been paid.",
                'type' => 'invoice_paid',
            ],
            'overdue' => [
                'title' => "Invoice Overdue - {$admin->branch->name}",
                'message' => "Your invoice #{$request->invoice_id} is overdue for payment.",
                'type' => 'invoice_overdue',
            ],
            'pending' => [
                'title' => "Pending Invoice - {$admin->branch->name}",
                'message' => "Your invoice #{$request->invoice_id} is pending and awaiting action from {$admin->name}.",
                'type' => 'invoice_pending',
            ],
        ];

        $userNotificationData = $notificationData[$invoiceStatus] ?? $notificationData['pending'];
        $user->notify(new GeneralNotification($userNotificationData));

        $adminNotificationData = [
            'title' => "Invoice {$invoiceStatus} - UserId: {$user->id}",
            'message' => "Invoice #{$request->invoice_id} for User ID {$user->id} is {$invoiceStatus}.",
            'type' => "invoice_{$invoiceStatus}",
        ];
        $admin->notify(new GeneralNotification($adminNotificationData));

        return response()->json(['success' => true, 'message' => 'Notification sent successfully.']);
    }
}