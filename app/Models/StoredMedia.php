<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StoredMedia extends Model
{
    protected $table = 'stored_media';

    protected $fillable = [
        'path',
        'mime_type',
        'size',
        'contents_base64',
    ];
}
