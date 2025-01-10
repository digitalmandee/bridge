<?php

namespace App\Models;

use App\Models\User;
use App\Models\Branch;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class BranchManager extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'branch_id',
        'name',
        'address',
        'status',
        'deleted_at'
    ];

    // Relation Section
    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    // Relation Section end

    public static function getBranchManagers()
    {
        return self::with(['branch' => function ($query) {
            $query->select('id', 'name');
        },
        'user' => function ($query) {
            $query->select('id', 'name', 'email');
        }])
        ->get();
    }

    public static function storeBranchManager($request)
    {
        $formattedName = ucwords(strtolower($request->name));

        $user = new User();
        $user->name = $formattedName;
        $user->email = $request->email;
        $user->role_id = $request->role_id;

        $user->password = Hash::make($request->password);
        $user->save();

        $branchManager = new self();
        $branchManager->user_id = $user->id;
        $branchManager->name = $formattedName;
        $branchManager->address = $request->address;
        $branchManager->branch_id = $request->branch_id;
        $branchManager->status = $request->status;
        $branchManager->save();


        // if ($request->role_id) {
        //     $role = Role::findById($request->role_id);
        //     if ($role) {
        //         $user->syncRoles([$role->name]);
        //     }
        // }

        return $branchManager;
    }

    public static function editBranchManager($id)
    {
        $bm = self::with(['branch' => function ($query) {
            $query->select('id', 'name');
        },
        'user' => function ($query) {
            $query->select('id', 'name', 'email');
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
        $user = User::find($branchManager->user_id);
        $user->name = $formattedName;
        $user->email = $request->email;
        $user->role_id = $request->role_id;
        $user->save();

        $branchManager->user_id = $user->id;
        $branchManager->name = $formattedName;
        $branchManager->address = $request->address;
        $branchManager->branch_id = $request->branch_id;
        $branchManager->status = $request->status;
        $branchManager->save();

        // if ($request->role_id) {
        //     $role = Role::findById($request->role_id);
        //     if ($role) {
        //         $user->syncRoles([$role->name]);
        //     }
        // }

        return $branchManager;
    }

    public static function deleteBranchManager($id)
    {
        $branchManager = self::find($id);
        
        if (!$branchManager) {
            return response()->json([
                'success' => false,
                'message' => 'BranchManger Not Found With Given Id',
            ], 200);
        }
        $user = User::find($branchManager->user_id);
        
        $branchManager->delete();
        $user->delete();
    }
}
