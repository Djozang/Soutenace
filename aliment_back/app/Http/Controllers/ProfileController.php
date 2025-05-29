<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\HealthCondition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;


class ProfileController extends Controller
{
    public function update(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users,email,' . Auth::id(),
            'état_santé' => 'nullable|in:sain,malade',
            'maladie' => 'nullable|string|max:255',
        ]);

        $user = Auth::user();
        $user->update([
            'nom' => $request->nom,
            'email' => $request->email,
            'état_santé' => $request->état_santé,
        ]);

        if ($request->état_santé === 'malade' && $request->maladie) {
            HealthCondition::updateOrCreate(
                ['utilisateur_id' => $user->id],
                ['maladie' => $request->maladie]
            );
        }

        return response()->json(['message' => 'Profil mis à jour']);
    }
    public function store(Request $request)
    {
        // 1. Validation des données
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'health_conditions' => 'required|array',
            'health_conditions.*' => 'exists:health_conditions,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // 2. Récupération de l'utilisateur
            $user = User::findOrFail($request->user_id);

            // 3. Synchronisation des conditions (relation many-to-many)
            $user->healthConditions()->sync($request->health_conditions);

            // 4. Mise à jour du timestamp
            $user->touch();

            // 5. Réponse de succès
            return response()->json([
                'success' => true,
                'message' => 'Profil mis à jour avec succès',
                'data' => [
                    'user' => $user,
                    'health_conditions' => $user->healthConditions
                ]
            ]);

        } catch (\Exception $e) {
            // Journalisation de l'erreur
            Log::error('Erreur sauvegarde profil: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Erreur serveur',
                'error' => env('APP_DEBUG') ? $e->getMessage() : null
            ], 500);
        }
    }

    public function show($id)
    {
        $user = User::with('healthCondition')->findOrFail($id);
        return response()->json($user);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'Utilisateur supprimé avec succès']);
    }
}