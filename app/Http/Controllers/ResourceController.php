<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ResourceController extends Controller
{
    public function index()
    {
        
    }

    public function resourceCreate()
    {
        return view('admin.resource.create');
    }

    public function resourceStore(Request $request)
    {

    }

    public function resourceEdit($id)
    {

    }

    public function resourceUpdate(Request $request, $id)
    {

    }

    public function resourceDestroy($id)
    {

    }
}
