<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'content',
    ];

    public function reporter()
    {
        return $this->belongsTo(User::class);
    }
}
