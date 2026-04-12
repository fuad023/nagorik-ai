<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\ReportRequest;
use App\Http\Resources\ReportResource;
use App\Models\Report;
use App\Services\ReportService;
use Illuminate\Support\Facades\Auth;

class ReportController extends Controller
{
    public function index()
    {
        $query = Report::with('files')->latest();

        if (request()->boolean('mine')) {
            $query->where('reporter_id', request()->user()->id);
        }

        $reports = $query->paginate(10);        
        return ReportResource::collection($reports);
    }

    public function store(ReportRequest $request, ReportService $service)
    {
        $validated = $request->validated();
        $report = $service->create($validated);
        return $report;
    }

    public function show(Report $report)
    {
        abort_if(Auth::id() != $report->reporter_id, 403, 'Access Forbidden!');
        return new ReportResource($report->load('files'));
    }

    public function update(ReportRequest $request, Report $report, ReportService $service)
    {
        abort_if(Auth::id() != $report->reporter_id, 403, 'Access Forbidden!');

        $validated = $request->validated();
        $report = $service->create($validated, $report->id);
        return $report;
    }

    public function destroy(Report $report, ReportService $service)
    {
        abort_if(Auth::id() != $report->reporter_id, 403, 'Access Forbidden!');
        $service->delete($report);
        return response()->noContent();
    }
}
