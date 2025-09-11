<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BookingChair;
use App\Models\Chair;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class CompanyController extends Controller
{
    public function index()
    {
        try {
            $company = auth()->user();

            $bookingSchedules = $company
                ->bookingSchedulesByCompany()
                ->with(['floor:id,name', 'room:id,name', 'user:id,name'])
                ->latest()
                ->take(10)
                ->get();

            // 🔹 Count total seats from booking chairs
            $totalSeats = BookingChair::whereHas('booking', function ($q) use ($company) {
                $q->where('user_id', $company->id)->where('status', 'confirmed');
            })->count();

            // 🔹 Count occupied seats (allocated to company members)
            $occupiedSeats = User::where('company_id', $company->id)
                ->whereNotNull('allocated_seat_id')
                ->count();

            $availableSeats = max($totalSeats - $occupiedSeats, 0);

            // 🔹 Quotas (using same User model methods)
            $meetingQuota = $company->meetingQuota();
            $printingQuota = $company->printingQuota();

            return response()->json([
                'success' => true,
                'bookingSchedules' => $bookingSchedules,
                'totalSeats' => $totalSeats,
                'occupiedSeats' => $occupiedSeats,
                'availableSeats' => $availableSeats,
                'meetingQuota' => $meetingQuota,
                'printingQuota' => $printingQuota,
            ]);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'message' => $th->getMessage()]);
        }
    }

    public function getStaff()
    {
        try {
            $company = auth()->user();

            // Get all confirmed booking chairs for this company
            $chairs = BookingChair::whereHas('booking', function ($q) use ($company) {
                $q
                    ->where('user_id', $company->id)
                    ->where('status', 'confirmed');
            })->with(['table:id,table_id,name', 'room:id,name', 'booking:id,time_slot'])->get();

            // Get all seats already assigned to staff under this company
            $assignedSeatIds = User::where('company_id', $company->id)
                ->whereNotNull('allocated_seat_id')
                ->pluck('allocated_seat_id')
                ->toArray();

            // Exclude already allocated chairs
            $availableChairs = $chairs->filter(function ($chair) use ($assignedSeatIds) {
                return !in_array($chair->id, $assignedSeatIds);
            });

            $formattedChairs = $availableChairs->map(function ($chair) {
                return [
                    'id' => $chair->id,
                    'chair_id' => $chair->chair_id,
                    'time_slot' => $chair->booking->time_slot ?? null,
                    'table_id' => $chair->chair->table->table_id ?? null,
                    'table_name' => $chair->chair->table->name ?? 'N/A',
                    'room_id' => $chair->chair->room->id ?? null,
                    'room_name' => $chair->chair->room->name ?? 'N/A',
                ];
            })->values();

            return response()->json(['success' => true, 'chairs' => $formattedChairs]);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'message' => $th->getMessage()], 500);
        }
    }

    public function createStaff(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string',
            'seatNo' => 'nullable|integer|exists:booking_chairs,id',
            'blood_group' => 'nullable|string|max:5',  // NEW
        ]);

        DB::beginTransaction();

        try {
            $company = auth()->user();
            $companyId = $company->id;

            // Deduct from company
            $profileImagePath = '';
            if ($request->hasFile('profile_image')) {
                $profileImagePath = $request->file('profile_image')->store('profile_images', 'public');
            }

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'type' => 'user',
                'profile_image' => $profileImagePath,
                'designation' => $request->designation,
                'address' => $request->address,
                'phone_no' => $request->phone_no,
                'company_id' => $companyId,
                'allocated_seat_id' => $request->seatNo,
                'blood_group' => $request->blood_group,  // NEW
            ]);

            $user->assignRole('user');

            DB::commit();

            return response()->json(['success' => true, 'user' => $user]);
        } catch (\Throwable $th) {
            // Rollback the transaction if something goes wrong
            DB::rollBack();
            Log::info('Error creating staff: ' . $th->getMessage());
            return response()->json(['success' => false, 'message' => $th->getMessage()], 500);
        }
    }

    public function getStaffs(Request $request)
    {
        try {
            $filter = $request->get('filter');
            $company = auth()->user();
            $companyId = $company->id;

            $totalAll = User::where('company_id', $companyId)->count();
            $totalActive = User::where('company_id', $companyId)->where('status', 'active')->count();
            $totalInactive = User::where('company_id', $companyId)->where('status', 'inactive')->count();

            $users = User::where('company_id', $companyId)
                ->with([
                    'chair' => function ($query) {
                        $query
                            ->select('id', 'chair_id', 'booking_id')
                            ->with([
                                'chair' => function ($q) {
                                    $q
                                        ->select('id', 'chair_id', 'table_id', 'room_id')
                                        ->with([
                                            'table:id,table_id,name',
                                            'room:id,name',
                                        ]);
                                }
                            ]);
                    }
                ]);

            if ($filter === 'active') {
                $users->where('status', 'active');
            } elseif ($filter === 'inactive') {
                $users->where('status', 'inactive');
            }

            $users = $users->orderBy('created_at', 'desc')->get();

            return response()->json([
                'success' => true,
                'staffs' => $users,
                'totalAll' => $totalAll,
                'totalActive' => $totalActive,
                'totalInactive' => $totalInactive
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => $th->getMessage()
            ], 500);
        }
    }

    public function updateStaff(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string',
            'status' => 'required|in:active,inactive',
        ]);
        try {
            $user = User::find($id);
            if (!$user) {
                return response()->json(['success' => false, 'message' => 'User not found'], 404);
            }

            // Update user data
            $user->name = $request->name;
            $user->designation = $request->designation;
            $user->address = $request->address;
            $user->phone_no = $request->phone_no;
            $user->status = $request->status;
            $user->allocated_seat_id = $request->allocated_seat_id;

            $user->save();

            return response()->json(['success' => true, 'message' => 'User updated successfully']);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'message' => $th->getMessage()], 500);
        }
    }

    public function deleteStaffPermanently(Request $request)
    {
        try {
            $user = User::withTrashed()->find($request->id);  // Include soft-deleted users
            if (!$user) {
                return response()->json(['success' => false, 'message' => 'User not found'], 404);
            }

            $company = auth()->user();

            // Restore user's remaining quotas back to the company before permanent deletion
            $company->booking_quota += $user->booking_quota;
            $company->printing_quota += $user->printing_quota;
            $company->save();

            // Permanently delete the user
            $user->forceDelete();

            return response()->json(['success' => true, 'message' => 'User permanently deleted']);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'message' => $th->getMessage()], 500);
        }
    }
}
