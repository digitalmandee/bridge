<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Employee extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['branch_id', 'user_id', 'department_id', 'employee_id', 'name', 'email', 'designation', 'phone_no', 'address', 'emergency_no', 'gender', 'marital_status', 'national_id', 'account_no', 'salary', 'joining_date'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}