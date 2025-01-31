<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
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
                // 'title' => $notification->data['title'],
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
}