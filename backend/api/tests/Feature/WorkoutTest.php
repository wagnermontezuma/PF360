<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Workout;
use App\Models\WorkoutHistory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

class WorkoutTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private Workout $workout;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::factory()->create();
        $this->workout = Workout::factory()->create([
            'name' => 'Treino Teste',
            'description' => 'Descrição do treino teste',
            'difficulty' => 'moderate',
            'estimated_duration' => 45
        ]);
    }

    public function test_user_can_list_workouts(): void
    {
        Sanctum::actingAs($this->user);
        
        $response = $this->getJson('/api/workouts');
        
        $response->assertStatus(200)
                ->assertJsonStructure(['data' => [
                    '*' => ['id', 'name', 'description', 'difficulty', 'estimated_duration']
                ]]);
    }

    public function test_user_can_view_workout_details(): void
    {
        Sanctum::actingAs($this->user);
        
        $response = $this->getJson("/api/workouts/{$this->workout->id}");
        
        $response->assertStatus(200)
                ->assertJson([
                    'data' => [
                        'name' => 'Treino Teste',
                        'description' => 'Descrição do treino teste',
                        'difficulty' => 'moderate',
                        'estimated_duration' => 45
                    ]
                ]);
    }

    public function test_user_can_start_workout(): void
    {
        Sanctum::actingAs($this->user);
        
        $response = $this->postJson("/api/workouts/{$this->workout->id}/start");
        
        $response->assertStatus(201)
                ->assertJsonStructure([
                    'data' => [
                        'id',
                        'workout_id',
                        'started_at',
                        'exercise_progress'
                    ]
                ]);
                
        $this->assertDatabaseHas('workout_history', [
            'user_id' => $this->user->id,
            'workout_id' => $this->workout->id,
            'completed' => false
        ]);
    }

    public function test_user_can_complete_workout(): void
    {
        Sanctum::actingAs($this->user);
        
        // Inicia o treino
        $history = WorkoutHistory::factory()->create([
            'user_id' => $this->user->id,
            'workout_id' => $this->workout->id,
            'completed' => false
        ]);
        
        $response = $this->postJson("/api/workouts/{$this->workout->id}/complete", [
            'duration_seconds' => 2700,
            'calories_burned' => 300,
            'difficulty_rating' => 'moderate',
            'notes' => 'Treino concluído com sucesso',
            'exercise_progress' => [
                [
                    'exercise_id' => 1,
                    'sets_completed' => 3,
                    'reps_completed' => 12,
                    'weight_used' => 20
                ]
            ]
        ]);
        
        $response->assertStatus(200)
                ->assertJson([
                    'message' => 'Treino finalizado com sucesso'
                ]);
                
        $this->assertDatabaseHas('workout_history', [
            'id' => $history->id,
            'completed' => true,
            'duration_seconds' => 2700,
            'calories_burned' => 300
        ]);
    }

    public function test_unauthorized_user_cannot_access_workouts(): void
    {
        $response = $this->getJson('/api/workouts');
        $response->assertStatus(401);
    }
} 