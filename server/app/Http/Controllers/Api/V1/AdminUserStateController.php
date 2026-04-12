<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class AdminUserStateController extends Controller
{
    public function userStats(): JsonResponse
    {
        $totalUsers = User::count();
        $activeUsers = User::has('reports')->count();
        $newSignups = User::where('created_at', '>=', now()->subDays(7))->count();

        return response()->json([
            'success' => true,
            'message' => 'User statistics fetched successfully',
            'data' => [
                'user_statistics' => [
                    'total_users' => $totalUsers,
                    'active_users' => $activeUsers,
                    'new_signups' => $newSignups,
                ],
            ],
        ]);
    }
}