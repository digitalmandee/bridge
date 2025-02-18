<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Booking extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['user_id', 'branch_id', 'floor_id', 'plan_id', 'chair_ids', 'name', 'phone_no', 'type', 'start_date', 'start_time', 'end_date', 'end_time', 'package_end_time', 'duration', 'time_slot', 'total_price', 'package_detail', 'plan', 'booking_purpose', 'payment_method', 'expiration_date', 'cvv', 'card_number', 'receipt', 'save_card_details', 'status'];

    protected $casts = [
        'chair_ids' => 'array',
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
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}