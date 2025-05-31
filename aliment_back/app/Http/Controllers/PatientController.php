<?php

namespace App\Http\Controllers;

use App\Models\patient;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $patients = patient::all();
        return response()->json($patients);
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
            'état_santé' => 'required|in:sain,malade',
            'maladie' => 'nullable|required_if:état_santé,malade|string|max:255',
        ]);

        $patient = patient::create([
            'user_id' => $request->user()->id,
            'état_santé' => $request->état_santé,
            'maladie' => $request->maladie,
        ]);

        return response()->json($patient, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(patient $patient)
    {
        return response()->json($patient);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(patient $patient)
    {
        // This method is not typically used in API controllers, but you can return a view if needed.
        return response()->json(['message' => 'Edit functionality not implemented'], 405);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, patient $patient)
    {
        $request->validate([
            'état_santé' => 'required|in:sain,malade',
            'maladie' => 'nullable|required_if:état_santé,malade|string|max:255',
        ]);

        $patient->update([
            'état_santé' => $request->état_santé,
            'maladie' => $request->maladie,
        ]);

        return response()->json($patient);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(patient $patient)
    {
        $patient->delete();
        return response()->json(['message' => 'Patient deleted successfully'], 204);
    }
}
