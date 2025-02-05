<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookingInvoice extends Model
{
    use HasFactory;

    // protected $dates = ['due_date', 'paid_date'];

    protected $fillable = ['branch_id', 'booking_id', 'type', 'user_id', 'due_date', 'paid_date', 'payment_method', 'amount', 'receipt', 'status'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}