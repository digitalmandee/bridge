<?php

namespace App\Http\Controllers;

use App\Models\Investor;
use Illuminate\Http\Request;

class InvestorController extends Controller
{
    public function index()
    {
        $investors = Investor::getInvestors();

        return view('admin.investor.index', compact('investors'));
    }

    public function investorCreate()
    {
        return view('admin.investor.create');
    }

    public function investorStore(Request $request)
    {
        try {
            Investor::storeInvestor($request);
            return redirect()->route('admin.investor')->with('success', 'Investor created successfully');
        } catch (\Exception $e) {
            return redirect()->route('admin.investor.create')->with('error', 'There was an error creating the Investor. Please try again.');
        }
    }

    public function investorEdit($id)
    {
        $investor = Investor::editInvestor($id);

        return view('admin.investor.edit', compact('investor'));
    }

    public function investorUpdate(Request $request, $id)
    {
        try {
            Investor::updateInvestor($request, $id);
            return redirect()->route('admin.investor')->with('success', 'Investor updated successfully');
        } catch (\Exception $e) {
            return redirect()->route('admin.investor.edit')->with('error', 'There was an error updating the Investor. Please try again.');
        }

    }

    public function investorDestroy($id)
    {
        try {
            Investor::deleteInvestor($id);

            return redirect()->route('admin.investor')->with('success', 'Investor deleted successfully!');
        } catch (\Exception $e) {
            return redirect()->route('admin.investor')->with('error', 'Investor deleted successfully');            
        }
    }
}
