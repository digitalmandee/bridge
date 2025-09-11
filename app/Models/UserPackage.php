<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class UserPackage extends BaseModel
{
    use HasFactory;

    protected $fillable = ['user_id', 'package_id', 'valid_from', 'valid_to', 'status', 'created_by', 'updated_by', 'deleted_by'];

    public function addons()
    {
        return $this->hasMany(UserAddon::class);
    }
}