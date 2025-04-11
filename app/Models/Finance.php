<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Finance extends Model
{
    use HasFactory;

    protected $fillable = ['category_id', 'name', 'description', 'amount', 'quantity', 'issue_date', 'due_date', 'status', 'receipt'];

    public function category()
    {
        return $this->belongsTo(FinanceCategory::class);
    }
}
