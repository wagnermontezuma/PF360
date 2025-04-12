<?php

namespace App\Policies;

use App\Models\User;
use App\Models\WorkoutHistory;
use Illuminate\Auth\Access\HandlesAuthorization;

class WorkoutHistoryPolicy
{
    use HandlesAuthorization;

    public function view(User $user, WorkoutHistory $history): bool
    {
        return $user->id === $history->user_id;
    }

    public function create(User $user): bool
    {
        return true; // Todos usuários autenticados podem criar histórico
    }

    public function update(User $user, WorkoutHistory $history): bool
    {
        return $user->id === $history->user_id;
    }

    public function delete(User $user, WorkoutHistory $history): bool
    {
        return $user->id === $history->user_id;
    }
} 