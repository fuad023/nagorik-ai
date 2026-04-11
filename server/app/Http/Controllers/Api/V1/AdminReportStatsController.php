<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\JsonResponse;

class AdminReportStatsController extends Controller
{
    public function reportStats(): JsonResponse
    {
        $todaySubmitted = Report::whereDate('created_at', today())->count();

        $thisWeekSubmitted = Report::whereBetween('created_at', [
            now()->startOfWeek(),
            now()->endOfWeek(),
        ])->count();

        $thisMonthSubmitted = Report::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        return response()->json([
            'success' => true,
            'message' => 'Report statistics fetched successfully',
            'data' => [
                'reports_submitted' => [
                    'today_submitted' => $todaySubmitted,
                    'this_week' => $thisWeekSubmitted,
                    'this_month' => $thisMonthSubmitted,
                ],
            ],
        ]);
    }
}