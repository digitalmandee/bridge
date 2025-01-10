<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use app\Models\Member;

class MemberController extends Controller
{
    public function index()
    {
        $members = Member::getMembers();

        return reponse()->json([
            'success' => true,
            'message' => 'Get All Members Successfully',
            'data' => $members,
        ],201);
    }
}
