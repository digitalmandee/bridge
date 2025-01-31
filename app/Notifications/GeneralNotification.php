<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class GeneralNotification extends Notification
{
    use Queueable;

    protected $notificationData;

    public function __construct($notificationData)
    {
        $this->notificationData = $notificationData;
    }

    // Store notification in the database
    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'title' => $this->notificationData['title'],
            'message' => $this->notificationData['message'],
            'type' => $this->notificationData['type'], // 'booking' or 'invoice'
            'booking_id' => $this->notificationData['booking_id'] ?? null,
            'invoice_id' => $this->notificationData['invoice_id'] ?? null,
            'created_by' => $this->notificationData['created_by'] ?? 'System', // Admin who created
            'created_at' => now(),
        ];
    }
}