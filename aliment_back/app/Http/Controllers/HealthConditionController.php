<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\HealthCondition;

class HealthConditionController extends Controller
{
    public function index()
    {
        // Retrieve and return all health conditions
        return response()->json([
            'data' => HealthCondition::all()
        ]);
    }

    public function store(Request $request)
    {
        // Validate and create a new health condition
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        // Assuming HealthCondition is a model
        $healthCondition = HealthCondition::create($validatedData);

        return response()->json(['message' => 'Health condition created', 'data' => $healthCondition], 201);
    }

    public function update(Request $request, $id)
    {
        // Validate and update an existing health condition
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $healthCondition = HealthCondition::findOrFail($id);
        $healthCondition->update($validatedData);

        return response()->json(['message' => 'Health condition updated', 'data' => $healthCondition]);
    }

    public function destroy($id)
    {
        // Delete a health condition
        $healthCondition = HealthCondition::findOrFail($id);
        $healthCondition->delete();

        return response()->json(['message' => 'Health condition deleted']);
    }
}
