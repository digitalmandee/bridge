<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Floor;
use App\Models\Room;

class RoomController extends Controller
{
    //
    public function store(Request $request)
    {
        try
        {

        }catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching users: ' . $e->getMessage(),
            ], 500);
        }
    }

}
