<?php

namespace App\Http\Controllers;

use App\Models\MealPlan;
use App\Models\Meal;
use App\Models\HealthCondition;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MealPlanController extends Controller
{
    public function index()
    {
        $plans = MealPlan::where('utilisateur_id', Auth::id())
            ->with('meal')
            ->get();
        return response()->json($plans);
    }

    public function store(Request $request)
    {
        $request->validate([
            'meal_id' => 'required|exists:meals,id',
            'date' => 'required|date',
            'type_repas' => 'required|in:petit_dejeuner,dejeuner,diner',
        ]);

        $meal = Meal::find($request->meal_id);
        $userConditions = HealthCondition::where('utilisateur_id', Auth::id())->pluck('maladie')->toArray();
        $restrictions = $meal->restrictions ? $meal->restrictions : [];

        foreach ($userConditions as $condition) {
            if (in_array($condition, $restrictions)) {
                Notification::create([
                    'utilisateur_id' => Auth::id(),
                    'type' => 'alerte',
                    'message' => "Le repas {$meal->nom} est interdit pour {$condition}.",
                    'lu' => false,
                ]);
                return response()->json(['message' => 'Repas interdit pour votre pathologie'], 400);
            }
        }

        $plan = MealPlan::create([
            'utilisateur_id' => Auth::id(),
            'meal_id' => $request->meal_id,
            'date' => $request->date,
            'type_repas' => $request->type_repas,
        ]);

        Notification::create([
            'utilisateur_id' => Auth::id(),
            'type' => 'rappel',
            'message' => "Rappel : {$meal->nom} prévu pour le {$request->date}.",
            'lu' => false,
        ]);

        return response()->json($plan->load('meal'), 201);
    }
}