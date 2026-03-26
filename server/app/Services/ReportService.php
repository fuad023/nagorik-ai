<?php

namespace App\Services;

use App\Models\Report;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ReportService
{
    public function __construct(
        protected CloudinaryService $fileService
    ) {}

    public function create($validated, $report_id = NULL)
    {
        return DB::transaction(function () use ($validated, $report_id) {
            Log::channel('stderr')->info('Transaction started!');

            $validated['reporter_id'] = Auth::id();
            $report = Report::updateOrCreate(
                ['id' => $report_id],
                $validated
            );

            $mk_files = $validated['mk_files'] ?? NULL;
            $rm_files = $validated['rm_files'] ?? NULL;
            $files = [];

            if (!empty($mk_files)) {
                Log::channel('stderr')->info('Uploading Files!');
                $files = $this->fileService->uploadAllOnReport($report, $mk_files);
            }

            if (!empty($rm_files)) {
                Log::channel('stderr')->info('Removing Files!');
                $this->fileService->deleteAnyOnReport($report, $rm_files);
            }

            return response()->json([
                'report' => $report,
                'files'  => $files, // contains two fields: uploaded and failed
            ]);
        });
    }

    public function delete($report)
    {
        return DB::transaction(function () use ($report) {
            $path = 'nagorik-ai' . '/' . Auth::id() . '/' . $report->id;

            $this->fileService->deleteAllOnReport($path);

            $report->delete();
        });
    }
}
