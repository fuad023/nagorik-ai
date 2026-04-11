<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Report;

class AdminDashboardStatsController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'message' => 'Dashboard statistics fetched successfully',
            'data' => [
                'total_reports' => Report::count(),
                'flood_reports' => Report::where('report_type', 'flood')->count(),
                'dust_reports' => Report::where('report_type', 'dust')->count(),
                'narrow_road_reports' => Report::where('report_type', 'narrow_road')->count(),
                'pending_reports' => Report::where('status', 'pending')->count(),
            ],
        ]);
    }
}