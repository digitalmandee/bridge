<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookingRequest extends Model
{
    use HasFactory;

    protected $table = 'booking_request';

    protected $fillable = ['user_id', 'no_of_seats', 'floor_id', 'required_date'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function floor()
    {
        return $this->belongsTo(Floor::class);
    }
}
?>