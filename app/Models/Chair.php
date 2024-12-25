<?php

namespace App\Models;

use App\Models\Room; // Ensure this import is correct
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Chair extends Model
{
    use HasFactory;

    protected $fillable = [
        'room_id', 'name', 'status',
    ];

    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    public static function getChairs()
    {
        return self::with('room')->get(); // Fetch chairs with their associated rooms
    }

    public static function storeChair($request)
    {
        foreach ($request->room_id as $key => $room_id) { // Change table_id to room_id
            $formattedName = ucwords(strtolower($request->name[$key]));
            $chair = new self();
            $chair->room_id = $room_id; // Ensure you are using room_id
            $chair->name = $formattedName;
            $chair->save();
        }
    }

    public static function editChair($id)
    {
        return self::find($id);
    }

    public static function updateChair($request, $id)
    {
        $formattedName = ucwords(strtolower($request->name));
        $chair = self::find($id);
        $chair->room_id = $request->room_id; // Change table_id to room_id
        $chair->name = $formattedName;
        $chair->save();
    }

    public static function destroyChair($id)
    {
        return self::find($id)->delete();
    }
}
