<?php

namespace App\Http\Controllers;

use App\Models\plannification;
use Illuminate\Http\Request;

class PlannificationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $plannifications = plannification::all();

        return response()->json([
            'plannifications' => $plannifications
        ], 200);
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
            'repas_id' => 'required|exists:repas,id',
            'type_de_repas' => 'required|string|max:255',
            'date' => 'required|date',
        ]);

        $plannification = plannification::create([
            'repas_id' => $request->repas_id,
            'type_de_repas' => $request->type_de_repas,
            'date' => $request->date,
        ]);

        return response()->json([
            'message' => 'Plannification créée avec succès',
            'plannification' => $plannification
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(plannification $plannification)
    {
        return response()->json([
            'plannification' => $plannification
        ], 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(plannification $plannification)
    {
        // Cette méthode n'est pas nécessaire pour une API RESTful
        return response()->json([
            'message' => 'Cette méthode n\'est pas implémentée pour les API RESTful'
        ], 405);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, plannification $plannification)
    {
        $request->validate([
            'repas_id' => 'sometimes|required|exists:repas,id',
            'type_de_repas' => 'sometimes|required|string|max:255',
            'date' => 'sometimes|required|date',
        ]);

        if ($request->has('repas_id')) {
            $plannification->repas_id = $request->repas_id;
        }
        if ($request->has('type_de_repas')) {
            $plannification->type_de_repas = $request->type_de_repas;
        }
        if ($request->has('date')) {
            $plannification->date = $request->date;
        }

        $plannification->save();

        return response()->json([
            'message' => 'Plannification mise à jour avec succès',
            'plannification' => $plannification
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(plannification $plannification)
    {
        $plannification->delete();

        return response()->json([
            'message' => 'Plannification supprimée avec succès'
        ], 200);
    }
}
