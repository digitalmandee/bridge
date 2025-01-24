<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Branch extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'location',
        'status',
        'deleted_at'
    ];

    // public static function branches()
    // {
    //     return self::where('status', 1)->get();
    // }

    // public static function storeBranch($request)
    // {
    //     $formattedName = ucwords(strtolower($request->name));

    //     $branch = new self();
    //     $branch->name = $formattedName;
    //     $branch->location = $request->location;
    //     $branch->status = $request->status ?? 0;
    //     $branch->save();
    // }

    // public static function editBranch($id)
    // {
    //    return self::find($id);
    // }

    // public static function updateBranch($request, $id)
    // {
    //     $formattedName = ucwords(strtolower($request->name));

    //     $branch = self::find($id);
    //     $branch->name = $formattedName;
    //     $branch->location = $request->location;
    //     $branch->status = $request->status ?? 0;
    //     $branch->save();
    // }

    // public static function destroyBranch($id)
    // {
    //    return self::find($id)->delete();
    // }
    // public function floors()
    // {
    //     return $this->hasMany(Floor::class);
    // }
}
