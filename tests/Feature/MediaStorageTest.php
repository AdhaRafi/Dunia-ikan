<?php

namespace Tests\Feature;

use App\Models\StoredMedia;
use App\Support\MediaStorage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class MediaStorageTest extends TestCase
{
    use RefreshDatabase;

    public function test_uploaded_image_persists_to_database_and_serves_when_disk_is_cleared(): void
    {
        Storage::fake('public');

        $file = UploadedFile::fake()->image('fish-preview.png', 16, 16);
        $path = MediaStorage::store($file, 'products');

        $this->assertNotSame('', $path);
        Storage::disk('public')->assertExists($path);

        $record = StoredMedia::where('path', $path)->first();
        $this->assertNotNull($record);
        $this->assertSame('image/png', $record->mime_type);
        $this->assertGreaterThan(0, $record->size);

        $expectedBytes = Storage::disk('public')->get($path);

        // Simulate a serverless cold start where /tmp/storage files have been wiped.
        Storage::disk('public')->delete($path);
        Storage::disk('public')->assertMissing($path);

        $response = $this->get('/storage/'.$path);

        $response->assertOk();
        $response->assertHeader('Content-Type', 'image/png');
        $response->assertHeader('X-Content-Type-Options', 'nosniff');
        $this->assertStringContainsString('immutable', (string) $response->headers->get('Cache-Control'));
        $this->assertSame($expectedBytes, $response->getContent());
    }

    public function test_deleting_media_removes_both_disk_file_and_database_record(): void
    {
        Storage::fake('public');

        $path = MediaStorage::store(UploadedFile::fake()->image('store-logo.jpg'), 'stores');
        $this->assertNotNull(StoredMedia::where('path', $path)->first());

        MediaStorage::delete('/storage/'.$path);

        Storage::disk('public')->assertMissing($path);
        $this->assertNull(StoredMedia::where('path', $path)->first());
        $this->get('/storage/'.$path)->assertNotFound();
    }

    public function test_storage_route_returns_not_found_for_missing_or_traversal_paths(): void
    {
        Storage::fake('public');

        $this->get('/storage/products/missing-file.jpg')->assertNotFound();
        $this->get('/storage/..%2F.env')->assertNotFound();
        $this->get('/storage/stores/../secret.png')->assertNotFound();
    }
}
