<?php

namespace App\Models;

use App\Models\Floor;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasFactory;

    protected $fillable = [
        'floor_id',
        'name',
        'schedule_start_date',
        'schedule_end_date',
        // 'is_booked',
    ];

    public function bookingSchedules()
    {
        return $this->hasMany(BookingSchedule::class);
    }

    public function floor()
    {
        return $this->belongsTo(Floor::class);
    }

    /**
     * Get the floor that owns the room.
     */
    public function tables()
    {
        return $this->hasMany(Table::class);
    }

    public function chairs()
    {
        return $this->hasMany(Chair::class);
    }

    // public function floor()
    // {
    //     return $this->belongsTo(Floor::class);
    // }
}
