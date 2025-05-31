<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Models\Patient;
use App\Models\Nutritionniste;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function getStats()
    {
        $stats = [
            'total_users' => User::count(),
            'total_patients' => Patient::count(),
            'total_nutritionnistes' => Nutritionniste::count(),
            'total_admins' => Admin::count(),
        ];

        return response()->json($stats);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function getUsers()
    {
        $users = User::with(['patient', 'nutritionniste', 'admin'])->get();

        return response()->json($users);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function getActivities()
    {
       
        // Assuming you have an Activity model to track user activities
        // $activities = Activity::with('user')->get();

        // For demonstration, returning a static response
        $activities = [
            ['user_id' => 1, 'action' => 'Logged in', 'timestamp' => now()],
            ['user_id' => 2, 'action' => 'Updated profile', 'timestamp' => now()->subMinutes(10)],
            // Add more activities as needed
        ];

        return response()->json($activities);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
            'role' => 'required|in:patient,admin,nutritionniste',
        ]);
        $user = User::create([
            'nom' => $request->nom,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => $request->role,
        ]);
        if ($request->role === 'patient') {
            Patient::create(['user_id' => $user->id]);
        } elseif ($request->role === 'nutritionniste') {
            Nutritionniste::create(['user_id' => $user->id]);
        } elseif ($request->role === 'admin') {
            Admin::create(['user_id' => $user->id]);
        }
        return response()->json(['message' => 'User created successfully', 'user' => $user], 201);
       
    }

    public function show($id)
    {
        $user = User::with(['patient', 'nutritionniste', 'admin'])->findOrFail($id);

        return response()->json($user);
    }
    public function edit($id)
    {
        // This method is not typically used in API controllers, but you can return a view if needed.
        return response()->json(['message' => 'Edit functionality not implemented'], 405);
    }
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $request->validate([
            'nom' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users,email,' . $user->id,
            'role' => 'required|in:patient,admin,nutritionniste',
        ]);
        $user->update([
            'nom' => $request->nom,
            'email' => $request->email,
            'role' => $request->role,
        ]);
        if ($request->role === 'patient') {
            Patient::updateOrCreate(['user_id' => $user->id]);
        } elseif ($request->role === 'nutritionniste') {
            Nutritionniste::updateOrCreate(['user_id' => $user->id]);
        } elseif ($request->role === 'admin') {
            Admin::updateOrCreate(['user_id' => $user->id]);
        }
        return response()->json(['message' => 'User updated successfully', 'user' => $user], 200);
    }
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        
        // Optionally, delete related models
        if ($user->role === 'patient') {
            Patient::where('user_id', $user->id)->delete();
        } elseif ($user->role === 'nutritionniste') {
            Nutritionniste::where('user_id', $user->id)->delete();
        } elseif ($user->role === 'admin') {
            Admin::where('user_id', $user->id)->delete();
        }

        return response()->json(['message' => 'User deleted successfully'], 204);
    }
   
   
    public function getSystemInfo()
    {
        $systemInfo = [
            'php_version' => phpversion(),
            'laravel_version' => app()->version(),
            'database_connection' => config('database.default'),
            'database_name' => config('database.connections.' . config('database.default') . '.database'),
            'app_environment' => app()->environment(),
        ];

        return response()->json($systemInfo);
    }
    public function getSecurityInfo()
    {
        $securityInfo = [
            'encryption_key' => config('app.key'),
            'debug_mode' => config('app.debug') ? 'enabled' : 'disabled',
            'csrf_protection' => config('session.driver') !== 'array' ? 'enabled' : 'disabled',
            'auth_guard' => config('auth.defaults.guard'),
            'password_hashing' => config('hashing.default'),
            'middleware' => [
                'web' => in_array('web', app()->middleware->getMiddlewareGroups()),
                'api' => in_array('api', app()->middleware->getMiddlewareGroups()),
            ],
        ];
        return response()->json($securityInfo);
    }
    public function getNutritionnistes()
    {
        $nutritionnistes = Nutritionniste::with('user')->get();

        return response()->json($nutritionnistes);
    }

}
