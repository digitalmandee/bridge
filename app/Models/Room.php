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
        'type'
    ];

    public function floor()
    {
        return $this->belongsTo(Floor::class);
    }

    public static function getRooms()
    {
        return self::with('floor')->get();
    }

    public static function getFloors()
    {
        return Floor::all();
    }


    public function tables()
    {
        return $this->hasMany(Table::class);
    }

    public static function storeRoom($request)
    {
        foreach ($request->floor_id as $key => $floor_id) {
            $formattedName = ucwords(strtolower($request->name[$key]));
            $room = new self();
            $room->floor_id = $floor_id;
            $room->name = $formattedName;
            $room->type = $request->type[$key];
            $room->save();
        }
    }

    public static function editRoom($id)
    {
        return self::find($id);
    }

    public static function updateRoom($request, $id)
    {
        $formattedName = ucwords(strtolower($request->name));
        $room = self::find($id);
        $room->floor_id = $request->floor_id;
        $room->name = $formattedName;
        $room->type = $request->type;
        $room->save();
    }

    public static function destroyRoom($id)
    {
        return self::find($id)->delete();
    }
}
