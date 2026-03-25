<?php

namespace App\Services;

use App\Models\Report;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ReportService
{
    public function __construct(
        protected CloudinaryService $fileService
    ) {}

    public function create($validated, $report_id = NULL)
    {
        return DB::transaction(function () use ($validated, $report_id) {
            $validated['reporter_id'] = Auth::id();
            $report = Report::updateOrCreate(
                ['id' => $report_id],
                $validated
            );

            $mk_files = $validated['mk_files'] ?? NULL;
            $rm_files = $validated['rm_files'] ?? NULL;
            $files = [];

            $rm_ids = [];
            foreach ($rm_files as $file) {
                $rm_ids[] = $file['public_id'];
            }

            if (!empty($mk_files)) {
                $files = $this->fileService->uploadAllOnReport($report, $mk_files);
            }

            if (!empty($rm_files)) {
                $this->fileService->deleteAnyOnReport($rm_files);
                $report->files()->whereIn('public_id', $rm_ids)->delete();
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
