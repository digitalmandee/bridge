<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookingPlan extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'type', 'price', 'location'];

    protected $primaryKey = 'plan_id';
}