<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = ['booking_id', 'user_id', 'invoice_type', 'quantity', 'hours', 'discount', 'amount', 'status', 'due_date', 'paid_date', 'paid_month', 'paid_year', 'plan', 'payment_type', 'receipt'];

    protected $casts = ['plan' => 'array', 'paid_month' => 'array'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }
}