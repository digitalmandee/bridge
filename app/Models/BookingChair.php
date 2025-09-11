<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class BookingChair extends BaseModel
{
    use HasFactory;

    protected $fillable = [
        'booking_id',
        'chair_id',
        'name',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function chair()
    {
        return $this->belongsTo(Chair::class);
    }

    public function table()
    {
        return $this->belongsTo(Table::class, 'chair_id', 'id');
    }

    public function room()
    {
        return $this->belongsTo(Room::class, 'room_id', 'id');
    }
}