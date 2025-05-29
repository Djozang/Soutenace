<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Patient;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\HasApiTokens;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
            'role' => 'required|in:patient,admin',
            'état_santé' => 'nullable|required_if:role,patient|in:sain,malade',
            'maladie' => 'nullable|required_if:état_santé,malade|string|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
                'message' => 'Validation error'
            ], 422);
        }

        try {
            $user = User::create([
                'nom' => $request->nom,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role,
            ]);

            if ($request->role === 'patient') {
                Patient::create([
                    'user_id' => $user->id,
                    'état_santé' => $request->état_santé,
                    'maladie' => $request->maladie,
                ]);
            } elseif ($request->role === 'admin') {
                Admin::create(['user_id' => $user->id]);
            }

            // Création automatique du token après inscription
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Inscription réussie',
                'user' => $user,
                'token' => $token,
                'token_type' => 'Bearer'
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de l\'inscription',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);
    
        // Méthode plus robuste pour l'authentification
        $user = User::where('email', $request->email)->first();
    
        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Les identifiants sont incorrects.'],
            ]);
        }
    
        // Révoquer tous les tokens existants
        $user->tokens()->delete();
    
        // Création du token avec des capacités spécifiques
        $token = $user->createToken('auth_token', ['server:update'])->plainTextToken;
    
        return response()->json([
            'message' => 'Connexion réussie',
            'user' => $user,
            'token' => $token,
            'token_type' => 'Bearer'
        ], 200);
    }

    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'message' => 'Déconnexion réussie'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la déconnexion',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function user(Request $request)
    {
        try {
            $user = $request->user()
                          ->load(['patient', 'admin']);

            return response()->json([
                'user' => $user
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la récupération du profil',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}