<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    public function index()
    {
        return view('admin.invoice.index');
    }

    public function invoiceCreate()
    {
        return view('admin.invoice.create');
    }

    public function invoiceStore(Request $request)
    {

    }

    public function invoiceShow()
    {
        return view('admin.invoice.show');
    }

    public function invoiceEdit($id)
    {

    }

    public function invoiceUpdate(Request $request, $id)
    {

    }

    public function invoiceDestroy($id)
    {

    }
}
