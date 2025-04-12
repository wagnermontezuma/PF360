<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

class UploadTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('s3');
        $this->user = User::factory()->create();
    }

    public function test_can_get_presigned_url_for_image(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson('/api/upload/presigned', [
            'fileName' => 'test.jpg',
            'fileType' => 'image/jpeg'
        ]);

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'url',
                    'fields' => [
                        'key',
                        'acl',
                        'Content-Type'
                    ]
                ]);

        $this->assertStringContainsString('images/', $response->json('fields.key'));
    }

    public function test_can_get_presigned_url_for_video(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson('/api/upload/presigned', [
            'fileName' => 'workout.mp4',
            'fileType' => 'video/mp4'
        ]);

        $response->assertStatus(200);
        $this->assertStringContainsString('videos/', $response->json('fields.key'));
    }

    public function test_rejects_invalid_file_type(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson('/api/upload/presigned', [
            'fileName' => 'malicious.exe',
            'fileType' => 'application/exe'
        ]);

        $response->assertStatus(422);
    }

    public function test_can_delete_uploaded_file(): void
    {
        Sanctum::actingAs($this->user);
        
        // Simula um arquivo existente
        $path = 'images/test-image.jpg';
        Storage::disk('s3')->put($path, 'test content');

        $response = $this->deleteJson("/api/upload/{$path}");

        $response->assertStatus(200)
                ->assertJson(['message' => 'Arquivo deletado com sucesso']);

        Storage::disk('s3')->assertMissing($path);
    }

    public function test_unauthorized_user_cannot_upload(): void
    {
        $response = $this->postJson('/api/upload/presigned', [
            'fileName' => 'test.jpg',
            'fileType' => 'image/jpeg'
        ]);

        $response->assertStatus(401);
    }

    public function test_validates_required_fields(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson('/api/upload/presigned', []);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['fileName', 'fileType']);
    }
} 