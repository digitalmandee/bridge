<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class UserAddon extends BaseModel
{
    use HasFactory;

    protected $fillable = ['user_package_id', 'user_id', 'addon_type', 'total', 'remaining', 'price', 'purchased_at', 'created_by', 'updated_by', 'deleted_by'];

    public function package()
    {
        return $this->belongsTo(UserPackage::class, 'user_package_id');
    }
}
