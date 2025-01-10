<?php

namespace App\Models;

use App\Models\Branch;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Floor extends Model
{
    use HasFactory;

    protected $fillable = [
        'branch_id',
        'name'
    ];

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
    public function rooms()
    {
        return $this->hasMany(Room::class);
    }

    public static function getFloors()
    {
        return self::with(['branch' => function ($query) {
            $query->where('status', 1);
        }])
            ->get();
    }

    public static function storeFloor($request)
    {
        foreach ($request->branch_id as $key => $branch_id) {
            $formattedName = ucwords(strtolower($request->name[$key]));
            $floor = new self();
            $floor->branch_id = $branch_id;
            $floor->name = $formattedName;
            $floor->save();
        }
    }

    public static function editFloor($id)
    {
        return self::find($id);
    }

    public static function updateFloor($request, $id)
    {
        $formattedName = ucwords(strtolower($request->name));
        $floor = self::find($id);
        $floor->branch_id = $request->branch_id;
        $floor->name = $formattedName;
        $floor->save();

        return $floor;
    }

    public static function destroyFloor($id)
    {
        return self::find($id)->delete();
    }
}
