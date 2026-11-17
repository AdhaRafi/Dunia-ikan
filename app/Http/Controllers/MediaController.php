<?php

namespace App\Http\Controllers;

use App\Models\StoredMedia;
use App\Support\MediaStorage;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;

class MediaController extends Controller
{
    /**
     * Serve uploaded public images from local disk or persistent DB storage fallback.
     */
    public function show(string $path): Response
    {
        if (str_contains($path, '..') || str_contains($path, '\\')) {
            abort(404);
        }

        $normalized = MediaStorage::normalizePath($path);
        if ($normalized === '' || str_starts_with($normalized, 'http')) {
            abort(404);
        }

        if (Storage::disk('public')->exists($normalized)) {
            $bytes = Storage::disk('public')->get($normalized);
            $mime = MediaStorage::sanitizeMime(Storage::disk('public')->mimeType($normalized) ?: null);

            return response($bytes, 200, $this->cacheHeaders($mime));
        }

        if (! Schema::hasTable('stored_media')) {
            abort(404);
        }

        $media = StoredMedia::where('path', $normalized)->first();
        if (! $media) {
            abort(404);
        }

        $decoded = base64_decode($media->contents_base64, true);
        if ($decoded === false) {
            abort(404);
        }

        return response(
            $decoded,
            200,
            $this->cacheHeaders(MediaStorage::sanitizeMime($media->mime_type))
        );
    }

    /**
     * Build immutable browser/CDN cache headers for uploaded media assets.
     *
     * @return array<string, string>
     */
    private function cacheHeaders(string $mimeType): array
    {
        return [
            'Content-Type' => $mimeType,
            'Cache-Control' => 'public, max-age=31536000, immutable',
            'X-Content-Type-Options' => 'nosniff',
        ];
    }
}
