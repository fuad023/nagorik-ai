<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class File extends Model
{
    protected $fillable = [
        'report_id',

        'public_id',
        'url',
        'original_name',
        'type',
        'mime_type',
        'size'
    ];

    public function report() : BelongsTo {
        return $this->belongsTo(Report::class, 'report_id');
    }
}
