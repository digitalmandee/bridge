<?php

namespace App\Models;

use App\Models\Table;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Chair extends Model
{
    use HasFactory;

    protected $fillable = [
        'table_id', 'name'
    ];

    public function table()
    {
        return $this->belongsTo(Table::class);
    }

    public static function getChairs()
    {
        return self::with('table')->get();
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
