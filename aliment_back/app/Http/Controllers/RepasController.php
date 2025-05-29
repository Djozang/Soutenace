<?php

namespace App\Http\Controllers;

use App\Models\repas;
use Illuminate\Http\Request;

class RepasController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $repas = repas::all();

        return response()->json([
            'repas' => $repas
        ], 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {


    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
        ]);

        $repas = repas::create([
            'nom' => $request->nom,
        ]);

        return response()->json([
            'message' => 'Repas créé avec succès',
            'repas' => $repas
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(repas $repas)
    {
        return response()->json([
            'repas' => $repas
        ], 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(repas $repas)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, repas $repas)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
        ]);

        $repas->update([
            'nom' => $request->nom,
        ]);

        return response()->json([
            'message' => 'Repas mis à jour avec succès',
            'repas' => $repas
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(repas $repas)
    {
        $repas->delete();

        return response()->json([
            'message' => 'Repas supprimé avec succès'
        ], 200);
    }
}
