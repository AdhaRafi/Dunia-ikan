<?php

namespace App\Support;

use App\Models\StoredMedia;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Throwable;

class MediaStorage
{
    private const ALLOWED_IMAGE_MIMES = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
    ];

    /**
     * Persist an uploaded image both on the public disk and in PostgreSQL/SQLite media storage
     * so serverless containers retain uploaded files across cold starts.
     */
    public static function store(UploadedFile $file, string $directory): string
    {
        $path = $file->store($directory, 'public');

        if (! $path) {
            return '';
        }

        try {
            if (! Schema::hasTable('stored_media')) {
                return $path;
            }

            $rawBytes = @file_get_contents($file->getRealPath());
            if ($rawBytes === false) {
                $rawBytes = Storage::disk('public')->get($path);
            }

            $mimeType = self::sanitizeMime($file->getMimeType());

            if (is_string($rawBytes) && $rawBytes !== '') {
                StoredMedia::updateOrCreate(
                    ['path' => self::normalizePath($path)],
                    [
                        'mime_type' => $mimeType,
                        'size' => strlen($rawBytes),
                        'contents_base64' => base64_encode($rawBytes),
                    ]
                );
            }
        } catch (Throwable) {
            // Fall back to local public disk cleanly if media table isn't migrated yet.
        }

        return $path;
    }

    /**
     * Remove an image path from both the public disk and persistent media storage.
     */
    public static function delete(?string $path): void
    {
        $normalized = self::normalizePath($path);
        if ($normalized === '') {
            return;
        }

        if (Storage::disk('public')->exists($normalized)) {
            Storage::disk('public')->delete($normalized);
        }

        try {
            if (Schema::hasTable('stored_media')) {
                StoredMedia::where('path', $normalized)->delete();
            }
        } catch (Throwable) {
            // Ignore cleanup failure when table hasn't been created yet.
        }
    }

    /**
     * Normalize storage paths stored either with or without a leading '/storage/' prefix.
     */
    public static function normalizePath(?string $path): string
    {
        if (! is_string($path)) {
            return '';
        }

        $trimmed = ltrim(trim($path), '/');
        if (str_starts_with($trimmed, 'storage/')) {
            $trimmed = substr($trimmed, 8);
        }

        return ltrim($trimmed, '/');
    }

    /**
     * Restrict served and persisted media MIME types to safe raster image formats.
     */
    public static function sanitizeMime(?string $mime): string
    {
        return is_string($mime) && in_array($mime, self::ALLOWED_IMAGE_MIMES, true)
            ? $mime
            : 'image/jpeg';
    }
}
