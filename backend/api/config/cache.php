<?php

use Illuminate\Support\Str;

return [
    'default' => env('CACHE_DRIVER', 'redis'),

    'stores' => [
        'redis' => [
            'driver' => 'redis',
            'connection' => 'cache',
            'lock_connection' => 'default',
        ],
        
        'file' => [
            'driver' => 'file',
            'path' => storage_path('framework/cache/data'),
        ],
    ],

    'prefix' => env('CACHE_PREFIX', Str::slug(env('APP_NAME', 'fitness360'), '_').'_cache_'),

    // TTL padrão para cache (24 horas)
    'ttl' => 60 * 60 * 24,
    
    // TTLs específicos por tipo de conteúdo
    'ttls' => [
        'workouts' => 60 * 60, // 1 hora
        'exercises' => 60 * 60 * 24, // 24 horas
        'user_profile' => 60 * 30, // 30 minutos
        'workout_history' => 60 * 15, // 15 minutos
        'metrics' => 60 * 5, // 5 minutos
    ],

    // Tags para invalidação seletiva
    'tags' => [
        'workouts',
        'exercises',
        'users',
        'history',
        'metrics'
    ],
]; 