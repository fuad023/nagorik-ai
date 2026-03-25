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
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = request()->user();
        $reports = $user->reports()->paginate();
        
        return ReportResource::collection($reports);
    }

    public function store(ReportRequest $request, ReportService $service)
    {
        $validated = $request->validated();
        $validated['reporter_id'] = $request->user()->id;

        $report = $service->create($validated);
        return $report;
    }

    /**
     * Display the specified resource.
     */
    public function show(Report $report)
    {
        // $user = request()->user();
        // if ($user->id != $report->author->id) {
        //     abort(403, 'Access forbidden!');
        // }

        abort_if(Auth::id() != $report->reporter_id, 403, 'Access Forbidden!');
        return new ReportResource($report);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ReportRequest $request, Report $report)
    {
        abort_if(Auth::id() != $report->reporter_id, 403, 'Access Forbidden!');

        $data = $request->validated();
        $report->update($data);
        return new ReportResource($report);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Report $report)
    {
        abort_if(Auth::id() != $report->reporter_id, 403, 'Access Forbidden!');

        $report->delete();
        return response()->noContent();
    }
}
