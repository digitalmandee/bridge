<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contract extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'plan_id', 'type', 'company_number', 'start_date', 'end_date', 'duration', 'notice_period', 'plan', 'amount', 'contract', 'agreement', 'signature', 'status'];

    protected $casts = [
        'plan' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}