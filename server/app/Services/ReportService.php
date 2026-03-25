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

    public function create($validated)
    {
        return DB::transaction(function () use ($validated) {
            $report = Report::create($validated);
            $mk_files = $validated['mk_files'] ?? NULL;
            $rm_files = $validated['rm_files'] ?? NULL;
            $files = [];

            if (!empty($mk_files)) {
                $files = $this->fileService->uploadAllOnReport($report, $mk_files);
            }

            if (!empty($rm_files)) {
                # TODO: delete entries from db and cloudinary
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
