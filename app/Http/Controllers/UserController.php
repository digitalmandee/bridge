<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        $users = User::where('type', 'user')->get();
        return response()->json(['success' => true, 'message' => 'Users retrieved successfully', 'data' => $users], 200);
    }
}
