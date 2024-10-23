<?php

namespace App\Models;

use App\Models\Branch;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class BranchManager extends Model
{
    use HasFactory, SoftDeletes, HasRoles;

    protected $guard_name = 'web';

    protected $fillable = [
        'branch_id',
        'name',
        'email',
        'password',
        'address',
        'status',
        'deleted_at'
    ];

    // Relation Section
    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
    // Relation Section end

    public static function getBranchManagers()
    {
        return self::with(['branch' => function ($query) {
            $query->select('id', 'name');
        },
        'roles' => function ($query) {
            $query->select('id', 'name');
        }])
        ->get();
    }

    public static function storeBranchManager($request)
    {
        $formattedName = ucwords(strtolower($request->name));

        $branchManager = new self();
        $branchManager->name = $formattedName;
        $branchManager->email = $request->email;
        $branchManager->password = Hash::make($request->password);
        $branchManager->address = $request->address;
        $branchManager->branch_id = $request->branch_id;
        $branchManager->status = $request->status;
        $branchManager->save();

        if ($request->role_id) {
            $role = Role::findById($request->role_id);
            if ($role) {
                $branchManager->assignRole($role->name);
            }
        }
    }

    public static function editBranchManager($id)
    {
        $bm = self::with(['branch' => function ($query) {
            $query->select('id', 'name');
        },
        'roles' => function ($query) {
            $query->select('id', 'name');
        }])
        ->find($id);

        $roles = Role::all();
        $branches = Branch::where('status', 1)->get();

        return [
            'branch_manager' => $bm,
            'roles' => $roles,
            'branches' => $branches,
        ];
    }

    public static function updateBranchManager($request, $id)
    {
        $formattedName = ucwords(strtolower($request->name));

        $branchManager = self::find($id);
        $branchManager->name = $formattedName;
        $branchManager->email = $request->email;
        $branchManager->address = $request->address;
        $branchManager->branch_id = $request->branch_id;
        $branchManager->status = $request->status;
        $branchManager->save();

        if ($request->role_id) {
            $role = Role::findById($request->role_id);
            if ($role) {
                $branchManager->syncRoles([$role->name]);
            }
        }
    }

    public static function deleteBranchManager($id)
    {
        $branchManager = self::find($id);

        if (!$branchManager) {
            return redirect()->route('admin.branch.manager')->with('error', 'There was an error deleting the branch manager. Please try again.');
        }
        $branchManager->roles()->detach();
        $branchManager->delete();
    }
}
