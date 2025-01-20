<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookingPlan extends Model
{
    use HasFactory;

    protected $fillable = ['plan_name', 'plan_price'];

    protected $primaryKey = 'plan_id';
}