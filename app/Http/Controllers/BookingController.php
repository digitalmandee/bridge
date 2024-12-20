<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Branch;
use App\Models\Floor;
use App\Models\Room;
use App\Models\Table;
use App\Models\Chair;
use App\Models\Booking;
use Illuminate\Support\Facades\Auth;




class BookingController extends Controller
{
    public function index()
    {
        return view('admin.booking.index');
    }

    // public function Create()
    // {
    //     return view('admin.booking.create');
    // }
    public function create()
    {
        $branches = Branch::with('floors.rooms.tables.chairs')->get();
        //$branches = Branch::all();
       // dd($branches);
        return view('admin.booking.create', compact('branches'));
    }
    public function getFloors($branchId)
    {
        return Floor::where('branch_id', $branchId)->with('rooms.tables.chairs')->get();
    }

    public function getRooms($floorId)
    {
        return Room::where('floor_id', $floorId)->with('tables.chairs')->get();
    }

    public function getTables($roomId)
    {
        return Table::where('room_id', $roomId)->with('chairs')->get();
    }

    public function getChairs($tableId)
    {
        return Chair::where('table_id', $tableId)->get();
    }

    public function bookChair(Request $request)
    {
        dd($request->all());
        // Validate the incoming request
        $request->validate([
            'chair_id' => 'required|exists:chairs,id',
            'table_id' => 'required|exists:tables,id',
        ]);

        // Find the chair and update its status
        $chair = Chair::find($request->chair_id);
        if ($chair->status == 0) { // Assuming 0 means available
            $chair->status = 1; // Assuming 1 means reserved
            $chair->save();

            return response()->json(['message' => 'Chair booked successfully!'], 200);
        }

        return response()->json(['message' => 'Chair is already reserved.'], 400);
    }

    // public function storeUserDetails(Request $request)
    // {
    //     dd($request->all());


    // }
    // public function storeUserDetails(Request $request)
    // {
    //     // Validate the request data
    //     $request->validate([
    //         'name' => 'required|string|max:255',
    //         'email' => 'required|email|max:255',
    //         'phone' => 'required|string|max:20',
    //         'product' => 'nullable|string',
    //         'date' => 'required|date',
    //         'time' => 'required|string',
    //         'branch_id' => 'required|integer|exists:branches,id',
    //         'floor_id' => 'required|integer|exists:floors,id',
    //         'room_id' => 'required|integer|exists:rooms,id',
    //         'table_id' => 'required|integer|exists:tables,id',
    //         'chair_id' => 'required|integer|exists:chairs,id',
    //         'duration' => 'nullable|string',
    //     ]);

    //     // Map incoming request data to the model
    //     $booking = Booking::create([
    //         'name' => $request->input('name'),
    //         'email' => $request->input('email'),
    //         'phone_num' => $request->input('phone'),
    //         'branch_id' => $request->input('branch_id'),
    //         'floor_id' => $request->input('floor_id'),
    //         'room_id' => $request->input('room_id'),
    //         'table_id' => $request->input('table_id'),
    //         'chair_id' => $request->input('chair_id'),
    //         'duration' => $request->input('duration'),
    //         'booking_date' => $request->input('date'),
    //         'start_date' => now()->toDateString(),
    //         'end_date' => now()->addWeek()->toDateString(),
    //         'booking_purpose' => $request->input('product'),
    //     ]);

    //     return response()->json([
    //         'success' => true,
    //         'message' => 'Booking created successfully!',
    //         'data' => $booking,
    //     ]);
    // }
    // public function storeUserDetails(Request $request)
    // {
    //     dd($request->all());
    //     // Validate the request data
    //     $request->validate([
    //         'name' => 'required|string|max:255',
    //         'email' => 'required|email|max:255',
    //         'phone' => 'required|string|max:20',
    //         'product' => 'nullable|string',
    //         'date' => 'required|date',
    //         'time' => 'required|string',
    //         'branch_id' => 'required|integer|exists:branches,id',
    //         'floor_id' => 'required|integer|exists:floors,id',
    //         'room_id' => 'required|integer|exists:rooms,id',
    //         'table_id' => 'required|integer|exists:tables,id',
    //         'chair_id' => 'required|integer|exists:chairs,id',
    //         'duration' => 'nullable|string',
    //     ]);

    //     // Map incoming request data to the model
    //     $booking = Booking::create([
    //         'name' => $request->input('name'),
    //         'email' => $request->input('email'),
    //         'phone_num' => $request->input('phone'),
    //         'branch_id' => $request->input('branch_id'),
    //         'floor_id' => $request->input('floor_id'),
    //         'room_id' => $request->input('room_id'),
    //         'table_id' => $request->input('table_id'),
    //         'chair_id' => $request->input('chair_id'),
    //         'duration' => $request->input('duration'),
    //         'booking_date' => $request->input('date'),
    //         'start_date' => now()->toDateString(),
    //         'end_date' => now()->addWeek()->toDateString(),
    //         'booking_purpose' => $request->input('product'),
    //     ]);

    //     // Update chair status to reserved (1)
    //     $chair = Chair::find($request->input('chair_id'));
    //     if ($chair) {
    //         $chair->status = 1; // Set status to reserved
    //         $chair->save();
    //     }

    //     return response()->json([
    //         'success' => true,
    //         'message' => 'Booking created successfully!',
    //         'data' => $booking,
    //     ]);
    // }
    // public function storeUserDetails(Request $request)
    // {
    //     // Debug the request
    //     dd($request->all());

    //     // Validate the request data
    //     $request->validate([
    //         'name' => 'required|string|max:255',
    //         'email' => 'required|email|max:255',
    //         'phone' => 'required|string|max:20',
    //         'product' => 'nullable|string',
    //         'date' => 'required|date',
    //         'time' => 'required|string',
    //         'branch_id' => 'required|integer|exists:branches,id',
    //         'floor_id' => 'required|integer|exists:floors,id',
    //         'room_id' => 'required|integer|exists:rooms,id',
    //         'table_id' => 'required|integer|exists:tables,id',
    //         'chair_id' => 'required|integer|exists:chairs,id',
    //         'duration' => 'nullable|string',
    //     ]);

    //     $userId = Auth::id();
    //     //dd($userId);

    //     $booking = Booking::create([
    //         'user_id' => $userId,
    //         'name' => $request->input('name'),
    //         'email' => $request->input('email'),
    //         'phone_num' => $request->input('phone'),
    //         'branch_id' => $request->input('branch_id'),
    //         'floor_id' => $request->input('floor_id'),
    //         'room_id' => $request->input('room_id'),
    //         'table_id' => $request->input('table_id'),
    //         'chair_id' => $request->input('chair_id'),
    //         'duration' => $request->input('duration'),
    //         'booking_date' => $request->input('date'),
    //         'start_date' => now()->toDateString(),
    //         'end_date' => now()->addWeek()->toDateString(),
    //         'booking_purpose' => $request->input('product'),
    //     ]);

    //     $chair = Chair::find($request->input('chair_id'));
    //     if ($chair) {
    //         $chair->status = 1;
    //         $chair->save();
    //     }

    //     return response()->json([
    //         'success' => true,
    //         'message' => 'Booking created successfully!',
    //         'data' => $booking,
    //     ]);
    // }//
    // public function storeUserDetails(Request $request)
    // {
    //     dd($request->all());
    //     try {
    //         $validated = $request->validate([
    //             'name' => 'required|string',
    //             'email' => 'required|email',
    //             'phone' => 'required|string',
    //             'product' => 'required|string',
    //             'branch_id' => 'required|numeric',
    //             'floor_id' => 'required|numeric',
    //             'room_id' => 'required|numeric',
    //             'table_id' => 'required|numeric',
    //             'chair_id' => 'required|numeric',
    //             'date' => 'required|date',
    //             'time' => 'required',
    //             'duration' => 'required|string'
    //         ]);

    //         // Create booking
    //         $booking = Booking::create($validated);
    //     // dd($booking);

    //         return response()->json([
    //             'success' => true,
    //             'message' => 'Booking created successfully',
    //             'booking' => $booking
    //         ]);

    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => $e->getMessage()
    //         ], 500);
    //     }
    // }// one chair
    // public function storeUserDetails(Request $request)
    // {
    //     // try {
    //     //     // Validate the request with chair_id as an array
    //     //     $validated = $request->validate([
    //     //         'name' => 'required|string',
    //     //         'email' => 'required|email',
    //     //         'phone' => 'required|string',
    //     //         'product' => 'required|string',
    //     //         'branch_id' => 'required|numeric',
    //     //         'floor_id' => 'required|numeric',
    //     //         'room_id' => 'required|numeric',
    //     //         'table_id' => 'required|numeric',
    //     //         'chair_id' => 'required|array|min:1', // Chair IDs should be an array
    //     //         'chair_id.*' => 'required|numeric',   // Validate each chair_id as numeric
    //     //         'date' => 'required|date',
    //     //         'time' => 'required',
    //     //         'duration' => 'required|string'
    //     //     ]);

    //     //     $bookings = [];

    //     //     // Loop through the chair_id array and create a booking for each
    //     //     foreach ($validated['chair_id'] as $chairId) {
    //     //         $bookingData = [
    //     //             'name' => $validated['name'],
    //     //             'email' => $validated['email'],
    //     //             'phone' => $validated['phone'],
    //     //             'product' => $validated['product'],
    //     //             'branch_id' => $validated['branch_id'],
    //     //             'floor_id' => $validated['floor_id'],
    //     //             'room_id' => $validated['room_id'],
    //     //             'table_id' => $validated['table_id'],
    //     //             'chair_id' => $chairId, // Assign the current chair_id
    //     //             'date' => $validated['date'],
    //     //             'time' => $validated['time'],
    //     //             'duration' => $validated['duration'],
    //     //         ];

    //     //         $bookings[] = Booking::create($bookingData);
    //     //     }

    //     //     return response()->json([
    //     //         'success' => true,
    //     //         'message' => 'Bookings created successfully',
    //     //         'bookings' => $bookings
    //     //     ]);

    //     // } catch (\Exception $e) {
    //     //     return response()->json([
    //     //         'success' => false,
    //     //         'message' => $e->getMessage()
    //     //     ], 500);
    //     // }
    //     try {
    //         // Validate the input
    //         $validated = $request->validate([
    //             'name' => 'required|string',
    //             'email' => 'required|email',
    //             'phone_num' => 'required|string',
    //             'duration' => 'required|string',
    //             'booking_date' => 'required|date',
    //             'start_date' => 'required|date',
    //             'end_date' => 'required|date',
    //             'branch_id' => 'required|numeric',
    //             'floor_id' => 'required|numeric',
    //             'room_id' => 'required|numeric',
    //             'table_id' => 'required|numeric',
    //             'chair_ids' => 'required|array|min:1', // Validate as array
    //             'chair_ids.*' => 'numeric',           // Each chair_id must be numeric
    //         ]);

    //         // Create a booking and store multiple chair IDs as JSON
    //         $booking = Booking::create([
    //             'name' => $validated['name'],
    //             'email' => $validated['email'],
    //             'phone_num' => $validated['phone_num'],
    //             'duration' => $validated['duration'],
    //             'booking_date' => $validated['booking_date'],
    //             'start_date' => $validated['start_date'],
    //             'end_date' => $validated['end_date'],
    //             'branch_id' => $validated['branch_id'],
    //             'floor_id' => $validated['floor_id'],
    //             'room_id' => $validated['room_id'],
    //             'table_id' => $validated['table_id'],
    //             'chair_ids' => json_encode($validated['chair_ids']), // Convert array to JSON
    //         ]);

    //         return response()->json([
    //             'success' => true,
    //             'message' => 'Booking created successfully!',
    //             'data' => $booking,
    //         ]);
    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => $e->getMessage(),
    //         ], 500);
    //     }
    // }


// public function storeUserDetails(Request $request)
// {
//     try {
//         // Validate the input
//         $validated = $request->validate([
//             'name' => 'required|string',
//             'email' => 'required|email',
//             'phone' => 'required',
//             'duration' => 'required|string',
//             'booking_date' => 'required|date',
//             'start_date' => 'required|date',
//             'end_date' => 'required|date',
//             'branch_id' => 'required|numeric',
//             'floor_id' => 'required|numeric',
//             'room_id' => 'required|numeric',
//             'table_id' => 'required|numeric',
//             'chair_id' => 'required|array|min:1', // Chair IDs must be an array with at least one item

//         ]);

//         // Store chair IDs as an array in the database (automatically handled with $casts)
//         $booking = Booking::create([
//             'name' => $validated['name'],
//             'email' => $validated['email'],
//             'phone' => $validated['phone'],
//             'duration' => $validated['duration'],
//             'booking_date' => $validated['booking_date'],
//             'start_date' => $validated['start_date'],
//             'end_date' => $validated['end_date'],
//             'branch_id' => $validated['branch_id'],
//             'floor_id' => $validated['floor_id'],
//             'room_id' => $validated['room_id'],
//             'table_id' => $validated['table_id'],
//             'chair_id' => $validated['chair_ids'], // No need for json_encode, cast will handle it
//         ]);

//         return response()->json([
//             'success' => true,
//             'message' => 'Booking created successfully!',
//             'data' => $booking,
//         ]);
//     } catch (\Exception $e) {
//         return response()->json([
//             'success' => false,
//             'message' => $e->getMessage(),
//         ], 500);
//     }
// }

    // public function storeUserDetails(Request $request)
    //  {
    //         try {
    //             // Validate the input
    //             $validated = $request->validate([
    //                 'name' => 'required|string',
    //                 'email' => 'required|email',
    //                 'phone' => 'required|string',
    //                 'duration' => 'required|string',
    //                 'date' => 'required|date',
    //                 'branch_id' => 'required|numeric',
    //                 'floor_id' => 'required|numeric',
    //                 'room_id' => 'required|numeric',
    //                 'table_id' => 'required|numeric',
    //                 'chair_id' => 'required|min:1',
    //             ]);

    //             // Store chair IDs as an array in the database
    //             $booking = Booking::create([
    //                 'name' => $validated['name'],
    //                 'email' => $validated['email'],
    //                 'phone' => $validated['phone'],
    //                 'duration' => $validated['duration'],
    //                 'date' => $validated['date'],
    //                 'branch_id' => $validated['branch_id'],
    //                 'floor_id' => $validated['floor_id'],
    //                 'room_id' => $validated['room_id'],
    //                 'table_id' => $validated['table_id'],
    //                 'chair_id' => $validated['chair_id'],
    //             ]);

    //             return response()->json([
    //                 'success' => true,
    //                 'message' => 'Booking created successfully!',
    //                 'data' => $booking,
    //             ]);
    //         } catch (\Illuminate\Validation\ValidationException $e) {
    //             return response()->json([
    //                 'success' => false,
    //                 'message' => $e->validator->errors(),
    //             ], 422); // Return validation errors
    //         } catch (\Exception $e) {
    //             return response()->json([
    //                 'success' => false,
    //                 'message' => $e->getMessage(),
    //             ], 500); // Return general error
    //         }
    //  }
    ////////////////////////////////////////
    // public function storeUserDetails(Request $request)
    // {
    //     try {
    //         // Validate the input
    //         $validated = $request->validate([
    //             'name' => 'required|string',
    //             'email' => 'required|email',
    //             'phone' => 'required|string',
    //             'duration' => 'required|string',
    //             'date' => 'required|date',
    //             'branch_id' => 'required|numeric',
    //             'floor_id' => 'required|numeric',
    //             'room_id' => 'required|numeric',
    //             'table_id' => 'required|numeric',
    //             'chair_id' => 'required', // Accept single or multiple
    //         ]);

    //         // Ensure chair_id is always treated as an array
    //         $chairIds = is_array($validated['chair_id'])
    //             ? $validated['chair_id']
    //             : [$validated['chair_id']];

    //         // Store booking in the database
    //         $booking = Booking::create([
    //             'name' => $validated['name'],
    //             'email' => $validated['email'],
    //             'phone' => $validated['phone'],
    //             'duration' => $validated['duration'],
    //             'date' => $validated['date'],
    //             'branch_id' => $validated['branch_id'],
    //             'floor_id' => $validated['floor_id'],
    //             'room_id' => $validated['room_id'],
    //             'table_id' => $validated['table_id'],
    //             'chair_id' => json_encode($chairIds), // Store chair IDs as JSON
    //         ]);

    //         // Update the status of the selected chairs to 1 (booked)
    //         foreach ($chairIds as $chairId) {
    //             Chair::where('id', $chairId)->update(['status' => 1]);
    //         }

    //         return response()->json([
    //             'success' => true,
    //             'message' => 'Booking created successfully!',
    //             'data' => $booking,
    //         ]);

    //     } catch (\Illuminate\Validation\ValidationException $e) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => $e->validator->errors(),
    //         ], 422); // Return validation errors
    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => $e->getMessage(),
    //         ], 500); // Return general error
    //     }
    // }
    // public function storeUserDetails(Request $request)
    // {
    //     try {
    //         // Validate the input
    //         $validated = $request->validate([
    //             'name' => 'required|string',
    //             'email' => 'required|email',
    //             'phone' => 'required|string',
    //             'product' => 'required|string',
    //             'duration' => 'required|string',
    //             'date' => 'required|date',
    //             'time' => 'required',
    //             'branch_id' => 'required|numeric',
    //             'floor_id' => 'required|numeric',
    //             'room_id' => 'required|numeric',
    //             'table_id' => 'required|numeric',
    //             'chair_id' => 'required',
    //         ]);

    //         // Convert comma-separated chair IDs to array
    //         $chairIds = explode(',', $validated['chair_id']);

    //         // Create the booking
    //         $booking = Booking::create([
    //             'name' => $validated['name'],
    //             'email' => $validated['email'],
    //             'phone' => $validated['phone'],
    //             'product' => $validated['product'],
    //             'duration' => $validated['duration'],
    //             'date' => $validated['date'],
    //             'time' => $validated['time'],
    //             'branch_id' => $validated['branch_id'],
    //             'floor_id' => $validated['floor_id'],
    //             'room_id' => $validated['room_id'],
    //             'table_id' => $validated['table_id'],
    //             'chair_ids' => json_encode($chairIds),
    //         ]);

    //         // Update chair statuses
    //         Chair::whereIn('id', $chairIds)->update(['status' => 1]);

    //         return response()->json([
    //             'success' => true,
    //             'message' => 'Booking created successfully!',
    //             'data' => $booking,
    //         ]);

    //     } catch (\Illuminate\Validation\ValidationException $e) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => $e->validator->errors(),
    //         ], 422);
    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => $e->getMessage(),
    //         ], 500);
    //     }
    // }
    public function storeUserDetails(Request $request)
    {
         //dd($request->all());
        try {
            // Validate the input
            $validated = $request->validate([
                'name' => 'required|string',
                'email' => 'required|email',
                'phone' => 'required|string',
                'product' => 'required|string',
                'duration' => 'required|string',
                'date' => 'required|date',
                'time' => 'required',
                'branch_id' => 'required|numeric',
                'floor_id' => 'required|numeric',
                'room_id' => 'required|numeric',
                'table_id' => 'required|numeric',
                'chair_id' => 'required',
            ]);

            // Convert comma-separated chair IDs to array
            $chairIds = explode(',', $validated['chair_id']);
            //dd($chairIds);

            // Create the booking
            $booking = Booking::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'product' => $validated['product'],
                'duration' => $validated['duration'],
                'date' => $validated['date'],
                'time' => $validated['time'],
                'branch_id' => $validated['branch_id'],
                'floor_id' => $validated['floor_id'],
                'room_id' => $validated['room_id'],
                'table_id' => $validated['table_id'],
                'chair_id' => json_encode($chairIds),
            ]);

            // Update chair statuses
            Chair::whereIn('id', $chairIds)->update(['status' => 1]);

            return response()->json([
                'success' => true,
                'message' => 'Booking created successfully!',
                'data' => $booking,
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->validator->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }




    //





    // public function storeUserDetails(Request $request)
    // {
    //     try {
    //         // Validate the input
    //         $validated = $request->validate([
    //             'name' => 'required|string',
    //             'email' => 'required|email',
    //             'phone' => 'required|string',
    //             'duration' => 'required|string',
    //             'date' => 'required|date',
    //             'branch_id' => 'required|numeric',
    //             'floor_id' => 'required|numeric',
    //             'room_id' => 'required|numeric',
    //             'table_id' => 'required|numeric',
    //             'chair_id' => 'required|min:1',
    //         ]);

    //         // Store booking in the database
    //         Booking::create([
    //             'name' => $validated['name'],
    //             'email' => $validated['email'],
    //             'phone' => $validated['phone'],
    //             'duration' => $validated['duration'],
    //             'date' => $validated['date'],
    //             'branch_id' => $validated['branch_id'],
    //             'floor_id' => $validated['floor_id'],
    //             'room_id' => $validated['room_id'],
    //             'table_id' => $validated['table_id'],
    //             'chair_id' => $validated['chair_id'],
    //         ]);

    //         // Redirect to the payment screen
    //         return redirect()->route('booking.stripe');
    //     } catch (\Illuminate\Validation\ValidationException $e) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => $e->validator->errors(),
    //         ], 422);
    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => $e->getMessage(),
    //         ], 500);
    //     }
    // }
    // public function stripe()
    // {
    //     return view('stripe');
    // }
    public function BookingCreate()
    {
       // return view('admin.booking.create');
       $branches = Branch::with('floors.rooms.tables.chairs')->get();
        //$branches = Branch::all();
       // dd($branches);
        return view('admin.booking.create', compact('branches'));
    }
}
