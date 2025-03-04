<?php

namespace App\Models;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ScheduleFloor extends Model
{
    use HasFactory;

    protected $fillable = [
        'branch_id',
        'name'
    ];

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function rooms()
    {
        return $this->hasMany(ScheduleRoom::class);  // This defines that a floor has many rooms
    }
}