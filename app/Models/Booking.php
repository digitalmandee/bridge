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
        'room_id',
        'table_id',
        'chair_id',
        'name',
        'email',
        'phone_num',
        'duration',
        'booking_date',
        'start_date',
        'end_date',
        'booking_purpose',
        'payment_method',
        'expiration_date',
        'cvv' ,
        'card_number',
        'receipt',
        'save_card_details'


    ];
    protected $casts = [
        'chair_id' => 'array',
    ];

}
