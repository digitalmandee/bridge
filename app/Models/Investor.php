<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Investor extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'name',
        'address',
        'phone',
        'deleted_at'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public static function getInvestors()
    {
        // return self::with(['user' => function ($query) {
        //     $query->select('id', 'name', 'email');
        // }])
        // ->get();

        return self::all();
    }

    public static function storeInvestor($request)
    {
        $formattedName = ucwords(strtolower($request->name));

        $user = new User();
        $user->name = $formattedName;
        $user->email = $request->email;
        $user->password = Hash::make('password');
        $user->save();

        $investor = new self();
        $investor->user_id = $user->id;
        $investor->name = $formattedName;
        $investor->address = $request->address;
        $investor->phone = $request->phone;
        $investor->save();

        $user->assignRole('investor');
    }

    public static function editInvestor($id)
    {
        // return self::with(['user' => function ($query) {
        //     $query->select('id', 'name', 'email');
        // }])
        // ->find($id);

        return self::find($id);
    }

    public static function updateInvestor($request, $id)
    {
        $formattedName = ucwords(strtolower($request->name));

        $investor = self::find($id);
        $user = User::find($investor->user_id);
        $user->name = $formattedName;
        $user->email = $request->email;
        $user->save();

        $investor->user_id = $user->id;
        $investor->name = $formattedName;
        $investor->address = $request->address;
        $investor->phone = $request->phone;
        $investor->save();

        $user->syncRoles(['investor']);
    }

    public static function deleteInvestor($id)
    {
        $investor = self::find($id);
        $user = User::find($investor->user_id);

        if (!$investor) {
            return redirect()->route('admin.investor')->with('error', 'There was an error deleting the investor. Please try again.');
        }
        $user->roles()->detach();
        $investor->delete();
        $user->delete();
    }
}
