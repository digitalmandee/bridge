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
        'room_id',
        'created_by_branch',
        'created_by_user',
        'title',
        'description',
        'startTime',
        'endTime',
        'date',
        'persons',
        'price',
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
        return $this->belongsTo(Room::class);
    }
}
