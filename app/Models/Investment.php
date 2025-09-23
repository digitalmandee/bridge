<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Investment extends BaseModel
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'investment_type_id',
        'investor_id',
        'tenant_id',
        'amount',
        'date',
        'invoice_path',
        'notes',
        'profit_percent',
        'share_percent',
        'share_type',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    public function investor()
    {
        return $this->belongsTo(Investor::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function location()
    {
        return $this->belongsTo(Tenant::class, 'tenant_id', 'id');
    }
}
