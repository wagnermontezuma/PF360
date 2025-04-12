<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('workout_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('workout_id')->constrained()->onDelete('cascade');
            $table->timestamp('started_at');
            $table->timestamp('completed_at')->nullable();
            $table->integer('duration_seconds')->nullable();
            $table->integer('calories_burned')->nullable();
            $table->json('exercise_progress')->nullable(); // [{exercise_id, sets_completed, reps_completed, weight_used}]
            $table->text('notes')->nullable();
            $table->enum('difficulty_rating', ['easy', 'moderate', 'hard'])->nullable();
            $table->boolean('completed')->default(false);
            $table->timestamps();
            
            // Índices para performance
            $table->index(['user_id', 'created_at']);
            $table->index('workout_id');
            $table->index('completed');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('workout_history');
    }
}; 