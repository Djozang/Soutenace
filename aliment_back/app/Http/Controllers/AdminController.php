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
