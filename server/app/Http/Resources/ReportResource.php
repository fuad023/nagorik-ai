<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReportResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'report_type' => $this->report_type,
            'alert'       => $this->alert,
            'status'      => $this->status,
            'title'       => $this->title,
            'description' => $this->description,
            'created_at'  => $this->created_at,
            'updated_at'  => $this->updated_at,

            'files'       => FileResource::collection($this->whenLoaded('files')),
            'reporter'    => new UserResource($this->whenLoaded('reporter')),
        ];
    }
}