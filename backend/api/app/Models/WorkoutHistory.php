<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkoutHistory extends Model
{
    protected $table = 'workout_history';
    
    protected $fillable = [
        'user_id',
        'workout_id',
        'started_at',
        'completed_at',
        'duration_seconds',
        'calories_burned',
        'exercise_progress',
        'notes',
        'difficulty_rating',
        'completed'
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'exercise_progress' => 'array',
        'completed' => 'boolean',
        'duration_seconds' => 'integer',
        'calories_burned' => 'integer'
    ];

    // Relações
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function workout(): BelongsTo
    {
        return $this->belongsTo(Workout::class);
    }

    // Scopes
    public function scopeCompleted($query)
    {
        return $query->where('completed', true);
    }

    public function scopeInProgress($query)
    {
        return $query->where('completed', false);
    }

    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    // Métodos auxiliares
    public function getDurationInMinutes(): float
    {
        return round($this->duration_seconds / 60, 1);
    }

    public function calculateProgress(): array
    {
        if (!$this->exercise_progress) {
            return [
                'total_exercises' => 0,
                'completed_exercises' => 0,
                'percentage' => 0
            ];
        }

        $progress = collect($this->exercise_progress);
        $totalExercises = $progress->count();
        $completedExercises = $progress->where('sets_completed', '>', 0)->count();

        return [
            'total_exercises' => $totalExercises,
            'completed_exercises' => $completedExercises,
            'percentage' => $totalExercises > 0 
                ? round(($completedExercises / $totalExercises) * 100)
                : 0
        ];
    }
} 