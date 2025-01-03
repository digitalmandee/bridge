<?php

namespace App\Models;
use App\Models\Floor;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Room extends Model
{
    use HasFactory;

    protected $fillable = [
        'floor_id',
        'name',
        'status',    // Example additional field
    ];

    /**
     * Get the floor that owns the room.
     */
    public function floor()
    {
        return $this->belongsTo(Floor::class);
    }


}
