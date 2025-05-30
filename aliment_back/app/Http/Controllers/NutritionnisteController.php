<?php

namespace App\Http\Controllers;

use App\Models\Nutritionniste;
use Illuminate\Http\Request;

class NutritionnisteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $nutritionnistes = Nutritionniste::with('user')->get();
        return response()->json($nutritionnistes);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'spécialité' => 'nullable|string|max:255',
        ]);

        $nutritionniste = Nutritionniste::create([
            'user_id' => $request->user_id,
            'spécialité' => $request->spécialité,
        ]);

        return response()->json($nutritionniste, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Nutritionniste $nutritionniste)
    {
        return response()->json($nutritionniste->load('user'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Nutritionniste $nutritionniste)
    {
        // This method is not typically used in API controllers, but you can implement it if needed.
        return response()->json($nutritionniste);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Nutritionniste $nutritionniste)
    {
        $request->validate([
            'spécialité' => 'nullable|string|max:255',
        ]);

        $nutritionniste->update([
            'spécialité' => $request->spécialité,
        ]);

        return response()->json($nutritionniste);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Nutritionniste $nutritionniste)
    {
        $nutritionniste->delete();
        return response()->json(['message' => 'Nutritionniste deleted successfully'], 204);
    }
}
