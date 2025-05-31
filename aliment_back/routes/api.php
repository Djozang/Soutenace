<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\FoodRecommendationsController;
use App\Http\Controllers\MealController;
use App\Http\Controllers\MealPlanController;
use App\Http\Controllers\HealthParameterController;
use App\Http\Controllers\NutritionnisteController;
use App\Http\Controllers\RecipeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\RepasController;
use App\Http\Controllers\HealthProgress;
use App\Http\Controllers\PlannificationController;
use App\Http\Controllers\HealthConditionController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\AdminController;
use App\Models\Nutritionniste;
use Illuminate\Http\Request;


use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
      Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::get('/user-with-profile', [AuthController::class, 'getUserWithProfile']);

    Route::get('/meals', [MealController::class, 'index']);
    Route::apiResource('meal-plans', MealPlanController::class)->only(['index', 'store']);
    Route::apiResource('health-parameters', HealthParameterController::class)->only(['index', 'store']);
    Route::apiResource('recipes', RecipeController::class)->only(['index', 'store']);
    Route::post('/recipes/{id}/like', [RecipeController::class, 'like']);
    Route::post('/recipes/{id}/comment', [RecipeController::class, 'comment']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::post('/profil', [ProfileController::class, 'store']);

    Route::get('/notifications', [NotificationController::class, 'index']);
    
    // Repas routes
    Route::post('/ajouter/repas', [RepasController::class, 'store']);
    Route::get('/recuperer/repas', [RepasController::class, 'index']);
    Route::get('/recuperer/repas/{id}', [RepasController::class, 'show']);
    Route::put('/modifier/repas/{id}', [RepasController::class, 'update']);
    Route::delete('/supprimer/repas/{id}', [RepasController::class, 'destroy']);
    //planification routes
    Route::post('/ajouter/plannification', [PlannificationController::class, 'store']);
    Route::get('/recuperer/plannification', [PlannificationController::class, 'index']);
    Route::get('/recuperer/plannification/{id}', [PlannificationController::class, 'show']);
    Route::put('/modifier/plannification/{id}', [PlannificationController::class, 'update']);
    Route::delete('/supprimer/plannification/{id}', [PlannificationController::class, 'destroy']);
    //recettes routes
    Route::post('/ajouter/recette', [RecipeController::class, 'store']);
    Route::get('/recuperer/recette', [RecipeController::class, 'index']);
    Route::get('/recuperer/recette/{id}', [RecipeController::class, 'show']);
    Route::put('/modifier/recette/{id}', [RecipeController::class, 'update']);
    Route::delete('/supprimer/recette/{id}', [RecipeController::class, 'destroy']);
    // Routes pour les maladies
    Route::get('/health-conditions', [HealthConditionController::class,'index']);

   // Routes pour les recommandations alimentaires
   Route::get('/food-recommendations/{conditionId}', [FoodRecommendationsController::class, 'show']);

   // Routes pour le suivi santé
   Route::post('/health-parameters', [HealthParameterController::class, 'store']);
   Route::get('/health-parameters', [HealthParameterController::class,'index']);

  //routes pour la progression sante
   Route::get('/health-progress', [HealthProgress::class,'progress']);

    // Routes pour la planification des repas
    Route::post('/meal-plans', [MealPlanController::class, 'store']);
    Route::get('/meal-plans', [MealPlanController::class, 'index']);
    Route::get('/meal-plans/{id}', [MealPlanController::class, 'show']);
    Route::put('/meal-plans/{id}', [MealPlanController::class, 'update']);
    Route::delete('/meal-plans/{id}', [MealPlanController::class, 'destroy']);
    // Routes pour les patients
    Route::apiResource('patients', PatientController::class)->only(['index', 'store', 'show', 'update', 'destroy']);

    //Routes pour 
    Route::get('/admins', [AuthController::class, 'getAdmins']);
    Route::get('/patients', [PatientController::class, 'index']);
    Route::get('/patients/{id}', [PatientController::class, 'show']);
    Route::put('/patients/{id}', [PatientController::class, 'update']);
    Route::delete('/patients/{id}', [PatientController::class, 'destroy']);
    // Routes pour les nutritionnistes
    Route::get('/nutritionists', [NutritionnisteController::class, 'index']);
    Route::post('/nutritionists', [NutritionnisteController::class, 'store']);
    Route::get('/nutritionists/{id}', [NutritionnisteController::class, 'show']);
    Route::put('/nutritionists/{id}', [NutritionnisteController::class, 'update']);
    Route::delete('/nutritionists/{id}', [NutritionnisteController::class, 'destroy']);
    
    //Routes pour les administrateurs

    Route::get('/admin/stats', [AdminController::class, 'getStats']);
    Route::get('/admin/users', [AdminController::class, 'getUsers']);
    Route::get('/admin/nutritionists', [AdminController::class, 'getNutritionnistes']);

    Route::get('/admin/activities', [AdminController::class, 'getActivities']);
    Route::get('/admin/system', [AdminController::class, 'getSystemInfo']);
    Route::get('/admin/security', [AdminController::class, 'getSecurityInfo']);
});