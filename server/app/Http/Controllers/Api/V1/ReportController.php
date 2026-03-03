<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReportRequest;
use App\Http\Resources\ReportResource;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReportController extends Controller
{
    public function index()
    {
        $user = request()->user();
        $reports = $user->reports()->paginate();
        return $reports;
    }

    public function store(StoreReportRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = $request->user()->id;

        $report = Report::create($data);
        return new ReportResource($report);
    }

    public function show(Report $report)
    {
        abort_if(Auth::id() != $report->reporter_id, 403, 'Access Forbidden!');
        return new ReportResource($report);
    }

    public function update(StoreReportRequest $request, Report $report)
    {
        abort_if(Auth::id() != $report->reporter_id, 403, 'Access Forbidden!');

        $data = $request->validated();
        $report->update($data);
        return new ReportResource($report);
    }

    public function destroy(Report $report)
    {
        abort_if(Auth::id() != $report->reporter_id, 403, 'Access Forbidden!');

        $report->delete();
        return response()->noContent();
    }
}
