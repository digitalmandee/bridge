<?php

namespace App\Models;

use App\Models\Room;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Table extends Model
{
    use HasFactory;

    protected $fillable = [
        'room_id', 'name'
    ];

    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    public static function getTables()
    {
        return self::with('room')->get();
    }

    public static function storeTables($request)
    {
        foreach ($request->room_id as $key => $room_id) {
            $formattedName = ucwords(strtolower($request->name[$key]));
            $room = new self();
            $room->room_id = $room_id;
            $room->name = $formattedName;
            $room->save();
        }
    }

    public static function editTable($id)
    {
        return self::find($id);
    }

    public static function updateTable($request, $id)
    {
        $formattedName = ucwords(strtolower($request->name));
        $room = self::find($id);
        $room->room_id = $request->room_id;
        $room->name = $formattedName;
        $room->save();
    }

    public static function destroyTable($id)
    {
        return self::find($id)->delete();
    }
}
