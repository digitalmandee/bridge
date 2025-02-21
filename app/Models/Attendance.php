<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Attendance extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['branch_id', 'employee_id', 'leave_category_id', 'date', 'check_in', 'check_out', 'status'];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function leaveCategory()
    {
        return $this->belongsTo(LeaveCategory::class);
    }
}