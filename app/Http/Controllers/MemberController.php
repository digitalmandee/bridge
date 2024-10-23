<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MemberController extends Controller
{
    public function index()
    {
        return view('admin.member.index');
    }

    public function memberCreate()
    {
        return view('admin.member.create');
    }

    public function memberStore(Request $request)
    {

    }

    public function memberEdit($id)
    {

    }

    public function memberUpdate(Request $request, $id)
    {

    }

    public function memberDestroy($id)
    {

    }
}
