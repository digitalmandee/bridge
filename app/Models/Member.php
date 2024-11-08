<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Member extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'created_by',
        'name',
        'company',
        'address',
        'phone',
        'total_members',
        'start_date',
        'first_invoice_date',
        'prorated_invoice_date',
        'plan_customization',
        'confirmation_mail',
        'note',
        'deleted_at'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public static function getMembers()
    {
        // return self::with(['user' => function ($query) {
        //     $query->select('id', 'name', 'email');
        // }])
        // ->get();

        return self::all();
    }

    public static function storeMember($request)
    {
        $formattedName = ucwords(strtolower($request->name));

        $user = new User();
        $user->name = $formattedName;
        $user->email = $request->email;
        $user->password = Hash::make('password');
        $user->save();

        $member = new self();
        $member->user_id = $user->id;
        $member->created_by = auth()->user()->id;
        $member->name = $formattedName;
        $member->company = $request->company;
        $member->address = $request->address;
        $member->phone = $request->phone;
        $member->total_members = $request->total_members;
        $member->start_date = $request->start_date;
        $member->first_invoice_date = $request->first_invoice_date;
        $member->prorated_invoice_date = $request->prorated_invoice_date;
        $member->plan_customization = $request->plan_customization;
        $member->confirmation_mail = $request->confirmation_mail;
        $member->note = $request->note;
        $member->save();

        $user->assignRole('member');
    }

    public static function editMember($id)
    {
        // return self::with(['user' => function ($query) {
        //     $query->select('id', 'name', 'email');
        // }])
        // ->find($id);

        return self::find($id);
    }

    public static function updateMember($request, $id)
    {
        $formattedName = ucwords(strtolower($request->name));

        $member = self::find($id);
        $user = User::find($member->user_id);
        $user->name = $formattedName;
        $user->email = $request->email;
        $user->save();

        $member = self::find($id);
        $member->created_by = auth()->user()->id;
        $member->name = $formattedName;
        $member->company = $request->company;
        $member->address = $request->address;
        $member->phone = $request->phone;
        $member->total_members = $request->total_members;
        $member->start_date = $request->start_date;
        $member->first_invoice_date = $request->first_invoice_date;
        $member->prorated_invoice_date = $request->prorated_invoice_date;
        $member->plan_customization = $request->plan_customization;
        $member->confirmation_mail = $request->confirmation_mail;
        $member->note = $request->note;
        $member->save();

        $user->syncRoles(['member']);
    }

    public static function deleteMember($id)
    {
        $member = self::find($id);
        $user = User::find($member->user_id);

        if (!$member) {
            return redirect()->route('admin.members')->with('error', 'There was an error deleting the member. Please try again.');
        }
        $user->roles()->detach();
        $member->delete();
        $user->delete();
    }
}
