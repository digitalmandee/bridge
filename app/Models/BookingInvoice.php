<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookingInvoice extends Model
{
    protected $dates = ['due_date'];
    use HasFactory;

    protected $fillable = ['user_id', 'booking_id', 'floor_id', 'room_id', 'due_date', 'amount', 'status'];
}