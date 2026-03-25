<?php

namespace App\Services;

use App\Models\File;
use App\Models\Report;
use Cloudinary\Cloudinary;

class CloudinaryService
{
    protected Cloudinary $cloudinary;

    public function __construct()
    {
        $this->cloudinary = new Cloudinary(config('services.cloudinary.url'));
    }

    public function uploadAllOnReport(Report $report, array $files)
    {
        $uploaded = [];
        $failed   = [];

        foreach ($files as $file) {
            try {
                $result = $this->uploadToCloudinary($report, $file);

                $file_created = $this->storeMetaDataInDatabase($report['id'], $result, $file);

                $uploaded[] = $file_created;

            } catch (\Exception $e) {
                $failed[] = [
                    'file'    => $file->getClientOriginalName(),
                    'message' => $e->getMessage(),
                ];
            }
        }

        return [
            'uploaded' => $uploaded,
            'failed'   => $failed
        ];
    }

    private function uploadToCloudinary($report, $file)
    {
        $path = "nagorik-ai/{$report->reporter_id}/{$report->id}";

        return $this->cloudinary->uploadApi()->upload(
            $file->getRealPath(),
            [
                'folder' => $path,
                'resource_type' => 'auto'
            ]
        );
    }

    private function storeMetaDataInDatabase($id, $result, $file) {
        return File::create([
            'report_id'     => $id,

            'original_name' => $file->getClientOriginalName(),
            'public_id'     => $result['public_id'],
            'url'           => $result['secure_url'],
            'size'          => $result['bytes'],
            'type'          => $result['resource_type'],
            'mime_type'     => $file->getMimeType(),
        ]);
    }

    public function deleteAnyOnReport() {}
}
