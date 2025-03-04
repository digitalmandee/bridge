<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ScheduleRoom extends Model
{
    use HasFactory;

    protected $fillable = [
        'schedule_floor_id',
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
        return $this->belongsTo(ScheduleFloor::class);
    }
}