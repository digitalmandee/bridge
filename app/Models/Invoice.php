<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = ['branch_id', 'booking_id', 'user_id', 'invoice_type', 'quantity', 'hours', 'amount', 'status', 'due_date', 'paid_date', 'plan', 'payment_type', 'receipt'];

    protected $casts = ['plan' => 'array'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}