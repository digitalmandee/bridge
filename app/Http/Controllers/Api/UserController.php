<?php

namespace App\Http\Controllers\Api;

use App\Helpers\FileHelper;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    //
    public function index()
    {
        try {
            $user = auth()->user();

            $bookingSchedules = $user
                ->bookingSchedules()
                ->with(['floor:id,name', 'room:id,name'])
                ->latest()
                ->take(10)
                ->get();

            $totalAmount = $user->invoices()->sum('amount');
            $overDueAmount = $user->invoices()->where('status', 'overdue')->sum('amount');

            return response()->json([
                'success' => true,
                'user' => $user,
                'bookingSchedules' => $bookingSchedules,
                'totalAmount' => $totalAmount,
                'overDueAmount' => $overDueAmount,
                'meetingQuota' => $user->meetingQuota(),
                'printingQuota' => $user->printingQuota(),
            ]);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'message' => $th->getMessage()]);
        }
    }

    public function profile(Request $request)
    {
        try {
            $user = auth()->user();

            // Check if profile_image exists
            if ($user->profile_image) {
                $user->profile_image = url($user->profile_image);
            }

            return response()->json([
                'success' => true,
                'data' => $user->only('id', 'name', 'email', 'phone_no', 'profile_image')
            ]);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'message' => $th->getMessage()]);
        }
    }

    public function updateProfile(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'password' => 'nullable|string|min:6|confirmed',
            'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        try {
            $user = auth()->user();

            $user->name = $request->name;
            $user->password = $request->password ? Hash::make($request->password) : $user->password;
            $user->phone_no = $request->phone_no;
            if ($request->hasFile('profile_image')) {
                $profileImagePath = FileHelper::saveImage($request->file('profile_image'), 'profile_images');
                $user->profile_image = $profileImagePath;
            }

            $user->save();

            return response()->json(['success' => true, 'message' => 'Profile updated successfully']);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'message' => $th->getMessage()]);
        }
    }

    public function getBookingUsers()
    {
        $user = auth()->user();
        $users = $user->type === 'user' ? [] : User::where('type', 'user')->get();

        return response()->json(['success' => true, 'users' => $users]);
    }
}