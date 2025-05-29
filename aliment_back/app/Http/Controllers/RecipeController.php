<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
use App\Models\Like;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RecipeController extends Controller
{
    public function index()
    {
        $recipes = Recipe::with(['repas', 'likes', 'comments'])->get();

        return response()->json($recipes);
    }

    public function store(Request $request)
    {
        $request->validate([
            'repas_id' => 'required|exists:repas,id',
            'type_contenu' => 'required|string|max:255',
            'contenu' => 'required|string',
            'url_média' => 'nullable|url',
        ]);

        $recipe = Recipe::create([
            'repas_id' => $request->repas_id,
            'type_contenu' => $request->type_contenu,
            'contenu' => $request->contenu,
            'url_média' => $request->url_média,
            'validé' => false, // Par défaut, la recette n'est pas validée
        ]);

        return response()->json($recipe, 201);
    }

    public function like($id)
    {
        $existingLike = Like::where('user_id', Auth::id())->where('recipe_id', $id)->first();
        if ($existingLike) {
            $existingLike->delete();
        } else {
            Like::create([
                'user_id' => Auth::id(),
                'recipe_id' => $id,
            ]);
        }

        return response()->json(['message' => 'Like mis à jour']);
    }

    public function comment(Request $request, $id)
    {
        $request->validate(['comment' => 'required|string']);

        $comment = Comment::create([
            'user_id' => Auth::id(),
            'recipe_id' => $id,
            'comment' => $request->comment,
        ]);

        return response()->json($comment, 201);
    }
    public function show($id)
    {
        $recipe = Recipe::with(['repas', 'likes', 'comments'])->findOrFail($id);

        return response()->json($recipe);
    }

    public function update(Request $request, $id)
    {
        $recipe = Recipe::findOrFail($id);

        $request->validate([
            'repas_id' => 'sometimes|exists:repas,id',
            'type_contenu' => 'sometimes|string|max:255',
            'contenu' => 'sometimes|string',
            'url_média' => 'nullable|url',
        ]);

        $recipe->update($request->only(['repas_id', 'type_contenu', 'contenu', 'url_média']));

        return response()->json($recipe);
    }
    public function destroy($id)
    {
        $recipe = Recipe::findOrFail($id);
        $recipe->delete();

        return response()->json(['message' => 'Recette supprimée avec succès']);
    }
}