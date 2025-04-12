<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class MonitoringPolicy
{
    use HandlesAuthorization;

    public function viewMonitoring(User $user): bool
    {
        return $user->is_admin || $user->hasRole('admin');
    }
} 