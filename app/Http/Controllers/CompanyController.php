<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Chair;
use App\Models\Table;
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

            $bookingSchedules = $company->bookingSchedulesByCompany()->with(['floor:id,name', 'room:id,name', 'user:id,name'])->latest()->take(10)->get();

            $totalSeats = count($company->booking()->get()->pluck('chair_ids')->flatten(1));

            // Get all chair_ids from User table's allocated_seat_id column
            $existingSeats = User::where('company_id', $company->id)->whereNotNull('allocated_seat_id')->pluck('allocated_seat_id')->flatten();

            // $availableSeats = $user->booking->chairs;
            // $occupiedSeats = $user->available_seats;

            return response()->json([
                'success' => true,
                'bookingSchedules' => $bookingSchedules,
                'totalSeats' => $totalSeats,
                'occupiedSeats' => $existingSeats->count(),
                'totalBookings' => $company->total_booking_quota,
                'remainingBookings' => $company->booking_quota,
                'remainingPrinting' => $company->printing_quota,
            ]);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'message' => $th->getMessage()]);
        }
    }

    public function getStaff()
    {
        try {
            $company = auth()->user();

            // Get all approved bookings and extract chairs from JSON
            $chairIds = $company->booking()->where('status', 'confirmed')->get()->pluck('chair_ids')->flatten(1)->unique();

            // Fetch chairs with related table and room data
            $chairs = Chair::whereIn('id', $chairIds)->with(['table:id,table_id,name', 'room:id,name'])->get()->keyBy('id');

            // Format the chairs data as requested
            $formattedChairs = collect($chairIds)->map(function ($chairId) use ($chairs) {
                $chair = $chairs[$chairId] ?? null;
                return $chair ? [
                    'id' => $chair->id,
                    'chair_id' => $chair->chair_id,
                    'table_id' => $chair->table->table_id ?? null,
                    'table_name' => $chair->table->name ?? 'N/A',
                    'room_id' => $chair->room->id ?? null,
                    'room_name' => $chair->room->name ?? 'N/A',
                ] : null;
            })->filter()->values(); // Remove null values and reset indexes

            // Return the response
            return response()->json([
                'success' => true,
                'bookingQuota' => $company->booking_quota,
                'printingQuota' => $company->printing_quota,
                'chairs' => $formattedChairs
            ]);
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
            'seatNo' => 'required',
            'booking_quota' => 'required',
            'printing_quota' => 'required|integer',
        ]);

        DB::beginTransaction();

        try {
            $company = auth()->user();
            $companyId = $company->id;

            // Fetch the current company's quotas
            $avaiableBookingQuota = $company->booking_quota;
            $avaiablePrintingQuota = $company->printing_quota;

            // Validate that the submitted quotas do not exceed the available quotas
            if ($request->booking_quota > $avaiableBookingQuota) {
                return response()->json(['success' => false, 'booking_quota' => "Booking quota exceeds available quota of $avaiableBookingQuota"], 400);
            }

            if ($request->printing_quota > $avaiablePrintingQuota) {
                return response()->json(['success' => false, 'printing_quota' => "Printing quota exceeds available quota of $avaiablePrintingQuota"], 400);
            }

            // Deduct the used quotas from the company's available quotas
            $company->booking_quota -= $request->booking_quota;
            $company->printing_quota -= $request->printing_quota;
            $company->save(); // Save updated quotas

            $profileImagePath = '';
            // Handle profile_image upload
            if ($request->hasFile('profile_image')) {
                $profileImagePath = $request->file('profile_image')->store('profile_images', 'public');
            }

            // Create the new user (staff)
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
                'printing_quota' => $request->printing_quota,
                'booking_quota' => $request->booking_quota,
                'total_booking_quota' => $request->booking_quota,
                'total_printing_quota' => $request->printing_quota,
                'created_by_branch_id' => $company->created_by_branch_id
            ]);

            $user->assignRole('user');

            // Commit the transaction if everything is successful
            DB::commit();

            return response()->json(['success' => true, 'user' => $user]);
        } catch (\Throwable $th) {
            // Rollback the transaction if something goes wrong
            DB::rollBack();
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
                        $query->select('id', 'chair_id', 'table_id')->with([
                            'table' => function ($query) {
                                $query->select('id', 'table_id', 'name');
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

            return response()->json(['success' => true, 'staffs' => $users, 'totalAll' => $totalAll, 'totalActive' => $totalActive, 'totalInactive' => $totalInactive]);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'message' => $th->getMessage()], 500);
            //throw $th;
        }
    }

    public function updateStaff(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string',
            'status' => 'required|in:active,inactive',
        ]);
        try {
            $company = auth()->user();

            $user = User::find($id);
            if (!$user) {
                return response()->json(['success' => false, 'message' => 'User not found'], 404);
            }

            // Store old quotas
            $oldBookingQuota = $user->booking_quota;
            $oldPrintingQuota = $user->printing_quota;

            // If booking_quota changed
            if ($request->has('booking_quota') && $request->booking_quota != $oldBookingQuota) {
                $bookingDifference = $request->booking_quota - $oldBookingQuota;

                if ($bookingDifference > 0) {
                    // Need to deduct from company quota
                    if ($company->booking_quota >= $bookingDifference) {
                        $company->booking_quota -= $bookingDifference;
                    } else {
                        return response()->json(['success' => false, 'booking_quota' => 'Not enough booking quota in company'], 400);
                    }
                } else {
                    // Return quota back to company
                    $company->booking_quota += abs($bookingDifference);
                }
            }

            // If printing_quota changed
            if ($request->has('printing_quota') && $request->printing_quota != $oldPrintingQuota) {
                $printingDifference = $request->printing_quota - $oldPrintingQuota;

                if ($printingDifference > 0) {
                    // Need to deduct from company quota
                    if ($company->printing_quota >= $printingDifference) {
                        $company->printing_quota -= $printingDifference;
                    } else {
                        return response()->json(['success' => false, 'printing_quota' => 'Not enough printing quota in company'], 400);
                    }
                } else {
                    // Return quota back to company
                    $company->printing_quota += abs($printingDifference);
                }
            }

            // Save updated company quotas
            $company->save();

            // Update user data
            $user->name = $request->name;
            $user->designation = $request->designation;
            $user->address = $request->address;
            $user->phone_no = $request->phone_no;
            $user->status = $request->status;
            $user->allocated_seat_id = $request->allocated_seat_id;

            if ($request->has('booking_quota') && $request->booking_quota != $oldBookingQuota) {
                $user->booking_quota = $request->booking_quota;
                $user->total_booking_quota = $request->booking_quota;
            }
            if ($request->has('printing_quota') && $request->printing_quota != $oldPrintingQuota) {
                $user->printing_quota = $request->printing_quota;
            }

            $user->save();

            return response()->json(['success' => true, 'message' => 'User updated successfully']);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'message' => $th->getMessage()], 500);
        }
    }


    public function deleteStaffPermanently(Request $request)
    {
        try {
            $user = User::withTrashed()->find($request->id); // Include soft-deleted users
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