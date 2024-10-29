<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Member extends Model
{
    use HasFactory, SoftDeletes, HasRoles;

    protected $guard_name = 'web';

    protected $fillable = [
        'created_by',
        'name',
        'company',
        'address',
        'phone',
        'email',
        'total_members',
        'start_date',
        'first_invoice_date',
        'prorated_invoice_date',
        'plan_customization',
        'confirmation_mail',
        'note',
        'deleted_at'
    ];

    public static function getMembers()
    {
        return self::all();
    }

    public static function storeMember($request)
    {
        $formattedName = ucwords(strtolower($request->name));

        $member = new self();
        $member->created_by = auth()->user()->id;
        $member->name = $formattedName;
        $member->company = $request->company;
        $member->address = $request->address;
        $member->phone = $request->phone;
        $member->email = $request->email;
        $member->total_members = $request->total_members;
        $member->start_date = $request->start_date;
        $member->first_invoice_date = $request->first_invoice_date;
        $member->prorated_invoice_date = $request->prorated_invoice_date;
        $member->plan_customization = $request->plan_customization;
        $member->confirmation_mail = $request->confirmation_mail;
        $member->note = $request->note;
        $member->save();

        $member->assignRole('member');
    }

    public static function editMember($id)
    {
        return self::find($id);
    }

    public static function updateMember($request, $id)
    {
        $formattedName = ucwords(strtolower($request->name));

        $member = self::find($id);
        $member->created_by = auth()->user()->id;
        $member->name = $formattedName;
        $member->company = $request->company;
        $member->address = $request->address;
        $member->phone = $request->phone;
        $member->email = $request->email;
        $member->total_members = $request->total_members;
        $member->start_date = $request->start_date;
        $member->first_invoice_date = $request->first_invoice_date;
        $member->prorated_invoice_date = $request->prorated_invoice_date;
        $member->plan_customization = $request->plan_customization;
        $member->confirmation_mail = $request->confirmation_mail;
        $member->note = $request->note;
        $member->save();

        $member->syncRoles(['member']);
    }

    public static function deleteMember($id)
    {
        $member = self::find($id);

        if (!$member) {
            return redirect()->route('admin.members')->with('error', 'There was an error deleting the member. Please try again.');
        }
        $member->roles()->detach();
        $member->delete();
    }
}
