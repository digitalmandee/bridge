<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Booking extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'branch_id',
        'floor_id',
        'plan_id',
        'chairs',
        'name',
        'phone_no',
        'type',
        'duration',
        'start_date',
        'start_time',
        'end_date',
        'end_time',
        'total_price',
        'plan',
        'booking_purpose',
        'payment_method',
        'expiration_date',
        'cvv',
        'card_number',
        'receipt',
        'save_card_details'


    ];
    protected $casts = [
        'chairs' => 'array',
        'plan' => 'array',
    ];

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function floor()
    {
        return $this->belongsTo(Floor::class);
    }
}