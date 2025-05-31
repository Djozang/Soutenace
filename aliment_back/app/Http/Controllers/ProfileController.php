<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\HealthCondition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class ProfileController extends Controller
{
    public function update(Request $request)
    {
        DB::beginTransaction();
        
        try {
            $user = Auth::user();
            
            // Validation de base
            $baseRules = [
                'nom' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email,'.$user->id,
            ];

            // Règles spécifiques
            $roleRules = [];
            if ($user->role === 'patient') {
                $roleRules = [
                    'etat_sante' => 'nullable|in:sain,malade',
                    'maladie' => 'nullable|string|max:255|required_if:etat_sante,malade',
                    'health_conditions' => 'nullable|array',
                    'health_conditions.*' => 'exists:health_conditions,id'
                ];
            } elseif ($user->role === 'nutritionniste') {
                $roleRules = [
                    'specialite' => 'nullable|string|max:255',
                ];
            }

            $validatedData = $request->validate(array_merge($baseRules, $roleRules));

            // Mise à jour de l'utilisateur
            $user->update([
                'nom' => $validatedData['nom'],
                'email' => $validatedData['email'],
                'etat_sante' => $validatedData['etat_sante'] ?? $user->etat_sante,
                'specialite' => $validatedData['specialite'] ?? $user->specialite,
            ]);

            // Gestion spécifique patient
            if ($user->role === 'patient') {
                // Mise à jour de la maladie si nécessaire
                if (isset($validatedData['maladie'])) {
                    HealthCondition::updateOrCreate(
                        ['user_id' => $user->id],
                        ['maladie' => $validatedData['maladie']]
                    );
                }

                // Synchronisation des conditions de santé
                if (isset($validatedData['health_conditions'])) {
                    $user->healthConditions()->sync($validatedData['health_conditions']);
                }
            }

            DB::commit();

            // Chargement des relations fraîches
            $user->load(['healthCondition', 'healthConditions']);

            return response()->json([
                'success' => true,
                'message' => 'Profil mis à jour avec succès',
                'user' => $user
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);
            
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur mise à jour profil: '.$e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur serveur',
                'error' => env('APP_DEBUG') ? $e->getMessage() : null
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'health_conditions' => 'required|array|min:1',
            'health_conditions.*' => 'exists:health_conditions,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();
        
        try {
            $user = User::findOrFail($request->user_id);
            
            if ($user->role !== 'patient') {
                throw new \Exception('Seuls les patients peuvent avoir des conditions de santé');
            }

            $user->healthConditions()->sync($request->health_conditions);
            $user->touch();

            DB::commit();

            return response()->json([
                'success' => true,
                'user' => $user->load('healthConditions')
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur store profile: '.$e->getMessage());
            return response()->json([
                'success' => false,
                'message' => env('APP_DEBUG') ? $e->getMessage() : 'Erreur serveur'
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $user = User::with(['healthCondition', 'healthConditions'])
                      ->findOrFail($id);
            
            return response()->json([
                'success' => true,
                'user' => $user
            ]);
            
        } catch (\Exception $e) {
            Log::error('Erreur récupération profil: '.$e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non trouvé'
            ], 404);
        }
    }

    public function destroy($id)
    {
        DB::beginTransaction();
        
        try {
            $user = User::findOrFail($id);
            
            // Suppression des relations
            if ($user->role === 'patient') {
                $user->healthConditions()->detach();
                $user->healthCondition()->delete();
            }
            
            $user->delete();
            
            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => 'Utilisateur supprimé'
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur suppression utilisateur: '.$e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression'
            ], 500);
        }
    }
}