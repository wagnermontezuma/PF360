<?php

use Laravel\Telescope\Http\Middleware\Authorize;
use Laravel\Telescope\Watchers;

return [
    'enabled' => env('TELESCOPE_ENABLED', true),

    'middleware' => ['web'],

    'only_paths' => [
        'api/*',
    ],

    'ignore_paths' => [
        'nova-api*',
    ],

    'ignore_commands' => [
        //
    ],

    'storage' => [
        'database' => [
            'connection' => env('DB_CONNECTION', 'mysql'),
            'chunk' => 1000,
        ],
    ],

    'entries' => [
        'db_query' => [
            'enabled' => true,
            'slow' => 100,
        ],

        'queries' => [
            'enabled' => true,
            'slow' => 100,
            'ignore_packages' => true,
            'ignore_paths' => [],
        ],

        'redis' => [
            'enabled' => true,
            'slow' => 100,
        ],

        'commands' => [
            'enabled' => true,
        ],

        'schedule' => [
            'enabled' => true,
        ],

        'http_client' => [
            'enabled' => true,
        ],

        'events' => [
            'enabled' => true,
            'ignore_events' => [
                // Laravel events to ignore
            ],
        ],

        'logs' => [
            'enabled' => true,
            'level' => 'error',
        ],

        'notifications' => [
            'enabled' => true,
        ],

        'jobs' => [
            'enabled' => true,
        ],

        'exceptions' => [
            'enabled' => true,
        ],

        'views' => [
            'enabled' => true,
        ],

        'cache' => [
            'enabled' => true,
        ],

        'models' => [
            'enabled' => true,
        ],

        'gates' => [
            'enabled' => true,
        ],

        'requests' => [
            'enabled' => true,
        ],
    ],

    'batch_watcher' => env('TELESCOPE_BATCH_WATCHER', true),

    'pruning' => [
        'enabled' => true,
        'hours' => 24,
        'chunk' => 1000,
    ],

    'dashboard' => [
        'path' => 'telescope',
    ],
]; 