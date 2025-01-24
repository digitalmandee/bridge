<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\Floor;
use App\Models\Branch;
use App\Models\Chair;
use App\Models\Table;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BranchSettingController extends Controller
{
    // Floor Section
    public function floorIndex()
    {
        $floors = Floor::getFloors();

        return view('admin.branches.floors.index', compact('floors'));
    }

    public function floorCreate()
    {
        $branches = Branch::branches();

        return view('admin.branches.floors.create', compact('branches'));
    }

    public function floorStore(Request $request)
    {
        try {
            DB::beginTransaction();
            Floor::storeFloor($request);

            DB::commit();
            return redirect()->route('admin.branch.floor')->with('success', 'Floor created successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('admin.branch.floor.create')->with('error', 'There was an error creating the Floor. Please try again.');
        }
    }

    public function floorEdit($id)
    {
        $floor = Floor::editFloor($id);
        $branches = Branch::branches();

        return view('admin.branches.floors.edit', compact('floor', 'branches'));
    }

    public function floorUpdate(Request $request, $id)
    {
        try {
            DB::beginTransaction();
            Floor::updateFloor($request, $id);

            DB::commit();
            return redirect()->route('admin.branch.floor')->with('success', 'Floor updated successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('admin.branch.floor.edit')->with('error', 'There was an error updating the Floor. Please try again.');
        }
    }

    public function floorDestroy($id)
    {
        try {
            DB::beginTransaction();
            Floor::destroyFloor($id);

            DB::commit();
            return redirect()->route('admin.branch.floor')->with('success', 'Floor deleted successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('admin.branch.floor')->with('error', 'There was an error deleting the Floor. Please try again.');
        }
    }
    //Floor Section End

    //Rooms Section
    public function roomIndex()
    {
        $rooms = Room::getRooms();

        return view('admin.branches.rooms.index', compact('rooms'));
    }

    public function roomCreate()
    {
        $floors = Room::getFloors();

        return view('admin.branches.rooms.create', compact('floors'));
    }

    public function roomStore(Request $request)
    {
        try {
            DB::beginTransaction();
            Room::storeRoom($request);

            DB::commit();
            return redirect()->route('admin.branch.room')->with('success', 'Room created successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('admin.branch.room.create')->with('error', 'There was an error creating the Room. Please try again.');
        }
    }

    public function roomEdit($id)
    {
        $room = Room::editRoom($id);
        $floors = Room::getFloors();

        return view('admin.branches.rooms.edit', compact('room', 'floors'));
    }

    public function roomUpdate(Request $request, $id)
    {
        try {
            DB::beginTransaction();
            Room::updateRoom($request, $id);

            DB::commit();
            return redirect()->route('admin.branch.room')->with('success', 'Room updated successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('admin.branch.room.edit')->with('error', 'There was an error updating the Room. Please try again.');
        }
    }

    public function roomDestroy($id)
    {
        try {
            DB::beginTransaction();
            Room::destroyRoom($id);

            DB::commit();
            return redirect()->route('admin.branch.room')->with('success', 'Room deleted successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('admin.branch.room')->with('error', 'There was an error deleting the Room. Please try again.');
        }
    }
    //Rooms Section End

    //Tables Section
    public function tableIndex()
    {
        $tables = Table::getTables();

        return view('admin.branches.tables.index', compact('tables'));
    }

    public function tableCreate()
    {
        $rooms = Room::getRooms();

        return view('admin.branches.tables.create', compact('rooms'));
    }

    public function tableStore(Request $request)
    {
        try {
            DB::beginTransaction();
            Table::storeTables($request);

            DB::commit();
            return redirect()->route('admin.branch.table')->with('success', 'Table created successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('admin.branch.table.create')->with('error', 'There was an error creating the Table. Please try again.');
        }
    }

    public function tableEdit($id)
    {
        $table = Table::editTable($id);
        $rooms = Room::getRooms();

        return view('admin.branches.tables.edit', compact('table', 'rooms'));
    }

    public function tableUpdate(Request $request, $id)
    {
        try {
            DB::beginTransaction();
            Table::updateTable($request, $id);

            DB::commit();
            return redirect()->route('admin.branch.table')->with('success', 'Table updated successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('admin.branch.table.edit')->with('error', 'There was an error updating the Table. Please try again.');
        }
    }

    public function tableDestroy($id)
    {
        try {
            DB::beginTransaction();
            Table::destroyTable($id);

            DB::commit();
            return redirect()->route('admin.branch.table')->with('success', 'Table deleted successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('admin.branch.table')->with('error', 'There was an error deleting the Table. Please try again.');
        }
    }
    //Tables Section End

    //Chairs Section
    public function chairIndex()
    {
        $chairs = Chair::getChairs();

        return view('admin.branches.chairs.index', compact('chairs'));
    }

    public function chairCreate()
    {
        $tables = Table::getTables();

        return view('admin.branches.chairs.create', compact('tables'));
    }

    public function chairStore(Request $request)
    {
        try {
            DB::beginTransaction();
            Chair::storeChair($request);

            DB::commit();
            return redirect()->route('admin.branch.chair')->with('success', 'Chair created successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('admin.branch.chair.create')->with('error', 'There was an error creating the Chair. Please try again.');
        }
    }

    public function chairEdit($id)
    {
        $chair = Chair::editChair($id);
        $tables = Table::getTables();

        return view('admin.branches.chairs.edit', compact('chair', 'tables'));   
    }

    public function chairUpdate(Request $request, $id)
    {
        try {
            DB::beginTransaction();
            Chair::updateChair($request, $id);

            DB::commit();
            return redirect()->route('admin.branch.chair')->with('success', 'Chair updated successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('admin.branch.chair.edit')->with('error', 'There was an error updating the Chair. Please try again.');
        }
    }

    public function chairDestroy($id)
    {
        try {
            DB::beginTransaction();
            Chair::destroyChair($id);

            DB::commit();
            return redirect()->route('admin.branch.chair')->with('success', 'Chair created successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('admin.branch.chair')->with('error', 'There was an error creating the Chair. Please try again.');
        }
    }
    //Chairs Section End

}
