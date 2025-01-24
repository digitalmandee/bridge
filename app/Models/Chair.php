<?php

namespace App\Models;

use App\Models\Floor;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Chair extends Model
{
    use HasFactory;

    protected $fillable = [
        'floor_id',
        'room_id',
        'table_id',
        'positionx',
        'positiony',
        'rotation',
        'color',
        'booking_startdate',
        'booking_enddate',
        'booked',
        'duration'
    ];

    public function floor()
    {
        return $this->belongsTo(Floor::class);
    }


    public static function getChairs()
    {
        return self::with('floor')->get();
    }

    public static function storeChair($request)
    {
        foreach ($request->table_id as $key => $table_id) {
            $formattedName = ucwords(strtolower($request->name[$key]));
            $room = new self();
            $room->table_id = $table_id;
            $room->name = $formattedName;
            $room->save();
        }
    }

    public static function editChair($id)
    {
        return self::find($id);
    }

    public static function updateChair($request, $id)
    {
        $formattedName = ucwords(strtolower($request->name));
        $room = self::find($id);
        $room->table_id = $request->table_id;
        $room->name = $formattedName;
        $room->save();
    }

    public static function destroyChair($id)
    {
        return self::find($id)->delete();
    }
}
