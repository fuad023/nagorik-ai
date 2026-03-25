<?php

namespace App\Services;

use App\Models\Report;
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
            $files = $validated['files'] ?? NULL;
            $media = [];

            if (!empty($files)) {
                $media = $this->fileService->uploadFiles($report, $files);
            }

            return response()->json([
                'report' => $report,
                'media'  => $media, // contains two fields: uploaded and failed
            ], count($media['uploaded']) > 0 ? 207 : 500);
            // 207 - some may have succeeded, some may have failed
        });
    }
}
