<?php

namespace App\Http\Controllers;

use App\Models\Member;
use Illuminate\Http\Request;

class MemberController extends Controller
{
    public function index()
    {
        $members = Member::getMembers();

        return view('admin.member.index', compact('members'));
    }

    public function memberCreate()
    {
        return view('admin.member.create');
    }

    public function memberStore(Request $request)
    {
        try {
            Member::storeMember($request);

            return redirect()->route('admin.members')->with('success', 'Member created successfully');
        } catch (\Exception $e) {
            return redirect()->route('admin.members.create')->with('error', 'There was an error creating the member. Please try again.');
        } 
    }

    public function memberEdit($id)
    {
        $member = Member::editMember($id);

        return view('admin.member.edit', compact('member'));
    }

    public function memberUpdate(Request $request, $id)
    {
        try {
            Member::updateMember($request, $id);

            return redirect()->route('admin.members')->with('success', 'Member updated successfully');
        } catch (\Exception $e) {
            return redirect()->route('admin.members.edit')->with('error', 'There was an error updating the member. Please try again.');
        } 
    }

    public function memberDestroy($id)
    {
        try {
            Member::deleteMember($id);

            return redirect()->route('admin.members')->with('success', 'Member deleted successfully');
        } catch (\Exception $e) {
            return redirect()->route('admin.members')->with('error', 'There was an error deleting the member. Please try again.');
        } 
    }
}
