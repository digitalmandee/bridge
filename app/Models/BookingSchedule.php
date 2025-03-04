<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookingSchedule extends Model
{
    use HasFactory;
    protected $dates = ['startTime', 'endTime', 'date'];

    protected $fillable = [
        'branch_id',
        'user_id',
        'company_id',
        'schedule_floor_id',
        'schedule_room_id',
        'title',
        'description',
        'startTime',
        'endTime',
        'date',
        'persons',
        'price',
        'status'
    ];

    protected $primaryKey = 'event_id';

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function room()
    {
        return $this->belongsTo(ScheduleRoom::class, 'schedule_room_id');
    }
    public function floor()
    {
        return $this->belongsTo(ScheduleFloor::class, 'schedule_floor_id');
    }
}
