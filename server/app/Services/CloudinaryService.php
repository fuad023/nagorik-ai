<?php

namespace App\Services;

use App\Models\File;
use App\Models\Report;
use Cloudinary\Cloudinary;
use Illuminate\Support\Facades\Log;

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
                'resource_type' => $this->getResourceType($file->getMimeType()),
            ]
        );
    }

    private function getResourceType(string $mimeType): string
    {
        if (str_starts_with($mimeType, 'image/')) {
            return 'image';
        }

        if (str_starts_with($mimeType, 'video/') || str_starts_with($mimeType, 'audio/')) {
            return 'video';
        }

        return 'raw'; // PDFs, docs, zip, etc.
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

    public function deleteAllOnReport(string $folderPath) {
        try {
            // deletes resources in the path
            foreach (['image', 'video', 'raw'] as $type) {
                $this->cloudinary->adminApi()->deleteAssetsByPrefix($folderPath, [
                    'resource_type' => $type,
                ]);
            }

            // delete folder itself
            $this->cloudinary->adminApi()->deleteFolder($folderPath);
        } catch (\Exception $e) {
            Log::channel('stderr')->error('Error at CloudinaryService.deleteAllOnReport. ' . $e->getMessage());
        }
    }
}
