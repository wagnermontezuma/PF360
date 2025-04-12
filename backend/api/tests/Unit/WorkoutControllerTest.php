<?php

namespace Tests\Unit;

use App\Models\User;
use App\Models\Workout;
use App\Models\WorkoutSession;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WorkoutControllerTest extends TestCase
{
    use RefreshDatabase;

    private $user;
    private $workout;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::factory()->create();
        
        $this->workout = Workout::create([
            'name' => 'Test Workout',
            'description' => 'Test Description',
            'difficulty_level' => 3,
            'estimated_time' => 45
        ]);
    }

    public function test_index_returns_workouts_list()
    {
        $response = $this->actingAs($this->user)->getJson('/api/workouts');

        $response->assertStatus(200)
                ->assertJsonStructure(['workouts']);
    }

    public function test_store_creates_new_workout()
    {
        $workoutData = [
            'name' => 'New Workout',
            'description' => 'New Description',
            'difficulty_level' => 4,
            'estimated_time' => 60,
            'exercises' => [
                [
                    'name' => 'Push-ups',
                    'sets' => 3,
                    'reps' => 12,
                    'weight' => 0,
                    'rest_time' => 60
                ]
            ]
        ];

        $response = $this->actingAs($this->user)
                        ->postJson('/api/workouts', $workoutData);

        $response->assertStatus(201)
                ->assertJsonStructure(['workout' => ['id', 'name', 'exercises']]);
    }

    public function test_show_returns_workout_details()
    {
        $response = $this->actingAs($this->user)
                        ->getJson("/api/workouts/{$this->workout->id}");

        $response->assertStatus(200)
                ->assertJsonStructure(['workout']);
    }

    public function test_update_modifies_workout()
    {
        $updateData = [
            'name' => 'Updated Workout',
            'description' => 'Updated Description',
            'difficulty_level' => 5,
            'estimated_time' => 75,
            'exercises' => [
                [
                    'name' => 'Squats',
                    'sets' => 4,
                    'reps' => 15,
                    'weight' => 20,
                    'rest_time' => 90
                ]
            ]
        ];

        $response = $this->actingAs($this->user)
                        ->putJson("/api/workouts/{$this->workout->id}", $updateData);

        $response->assertStatus(200)
                ->assertJsonFragment(['name' => 'Updated Workout']);
    }

    public function test_destroy_deletes_workout()
    {
        $response = $this->actingAs($this->user)
                        ->deleteJson("/api/workouts/{$this->workout->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('workouts', ['id' => $this->workout->id]);
    }

    public function test_start_creates_workout_session()
    {
        $response = $this->actingAs($this->user)
                        ->postJson("/api/workouts/{$this->workout->id}/start");

        $response->assertStatus(201)
                ->assertJsonStructure(['session' => ['id', 'started_at']]);
    }

    public function test_complete_updates_workout_session()
    {
        $session = WorkoutSession::create([
            'user_id' => $this->user->id,
            'workout_id' => $this->workout->id,
            'started_at' => now()
        ]);

        $completionData = [
            'performance_rating' => 4,
            'notes' => 'Great workout!'
        ];

        $response = $this->actingAs($this->user)
                        ->postJson("/api/workouts/{$this->workout->id}/complete", $completionData);

        $response->assertStatus(200)
                ->assertJsonStructure(['session' => ['completed_at', 'performance_rating']]);
    }

    public function test_validation_fails_with_invalid_data()
    {
        $invalidData = [
            'name' => '',
            'difficulty_level' => 10,
            'exercises' => []
        ];

        $response = $this->actingAs($this->user)
                        ->postJson('/api/workouts', $invalidData);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['name', 'difficulty_level', 'exercises']);
    }
} 