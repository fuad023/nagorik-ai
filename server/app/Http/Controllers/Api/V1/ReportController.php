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
        $user = request()->user();
        $reports = $user->reports()->paginate(10);        

        return ReportResource::collection($reports->load('files'));
    }

    public function store(ReportRequest $request, ReportService $service)
    {
        $validated = $request->validated();
        $validated['reporter_id'] = $request->user()->id;

        $report = $service->create($validated);
        return $report;
    }

    public function show(Report $report)
    {
        abort_if(Auth::id() != $report->reporter_id, 403, 'Access Forbidden!');
        return new ReportResource($report->load('files'));
    }

    public function update(ReportRequest $request, Report $report)
    {
        abort_if(Auth::id() != $report->reporter_id, 403, 'Access Forbidden!');

        $validated = $request->validated();

        # TODO: update actual files on cloudinary

        $report->update($validated);
        return new ReportResource($report->load('files'));
    }

    public function destroy(Report $report)
    {
        abort_if(Auth::id() != $report->reporter_id, 403, 'Access Forbidden!');

        # TODO: delete actual files from cloudinary

        $report->delete();
        return response()->noContent();
    }
}
