<?php

namespace App\Http\Controllers\Api;

use App\Helpers\FileHelper;
use App\Http\Controllers\Controller;
use App\Models\Kitchen;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class KitchenController extends Controller
{
    public function index(Request $request)
    {
        $page = $request->query('page', 1);
        $limit = $request->query('limit', 10);
        $kitchens = Kitchen::paginate($limit, ['*'], 'page', $page);
        return response()->json(['success' => true, 'kitchens' => $kitchens], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'error' => $validator->errors()->first()], 422);
        }

        $data = $request->only('name', 'price');

        if ($request->hasFile('photo')) {
            $path = FileHelper::saveImage($request->file('photo'), 'kitchens');
            $data['photo'] = $path;
        }

        $kitchen = Kitchen::create($data);

        return response()->json(['success' => true, 'kitchen' => $kitchen], 201);
    }

    public function update(Request $request, $id)
    {
        $kitchen = Kitchen::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'error' => $validator->errors()->first()], 422);
        }

        $data = $request->only('name', 'price');

        if ($request->hasFile('photo')) {
            $path = FileHelper::saveImage($request->file('photo'), 'kitchens');
            $data['photo'] = $path;
        }

        $kitchen->update($data);

        return response()->json(['success' => true, 'kitchen' => $kitchen], 200);
    }

    public function destroy($id)
    {
        $kitchen = Kitchen::findOrFail($id);
        $kitchen->delete();
        return response()->json(['success' => true, 'message' => 'Kitchen deleted successfully'], 200);
    }
}
