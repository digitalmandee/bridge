<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Branch extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'location',
        'status',
        'deleted_at'
    ];

    public function floors()
    {
        return $this->hasMany(Floor::class);
    }
    public function scheduleFloors()
    {
        return $this->hasMany(ScheduleFloor::class);
    }

    public function employees()
    {
        return $this->hasMany(Employee::class);
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    public function leaveApplications()
    {
        return $this->hasMany(LeaveApplication::class);
    }
}