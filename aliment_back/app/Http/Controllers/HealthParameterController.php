<?php

namespace App\Http\Controllers;

use App\Models\HealthParameter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HealthParameterController extends Controller
{
    public function index()
    {
        $params = HealthParameter::where('utilisateur_id', Auth::id())->get();
        return response()->json($params);
    }

    public function store(Request $request)
    {
        $request->validate([
            'poids' => 'nullable|numeric',
            'tension' => 'nullable|string|max:255',
            'température' => 'nullable|numeric',
            'date_enregistrement' => 'required|date',
        ]);

        $param = HealthParameter::create([
            'utilisateur_id' => Auth::id(),
            'poids' => $request->poids,
            'tension' => $request->tension,
            'température' => $request->température,
            'date_enregistrement' => $request->date_enregistrement,
        ]);

        return response()->json($param, 201);
    }
}