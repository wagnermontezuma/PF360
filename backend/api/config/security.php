<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Configurações de Segurança
    |--------------------------------------------------------------------------
    */
    
    'headers' => [
        'X-Frame-Options' => 'SAMEORIGIN',
        'X-XSS-Protection' => '1; mode=block',
        'X-Content-Type-Options' => 'nosniff',
        'Referrer-Policy' => 'strict-origin-when-cross-origin',
        'Content-Security-Policy' => "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.fitness360.com",
        'Permissions-Policy' => 'camera=(), microphone=(), geolocation=()'
    ],

    'rate_limiting' => [
        'enabled' => env('RATE_LIMITING_ENABLED', true),
        'max_attempts' => env('RATE_LIMITING_MAX_ATTEMPTS', 60),
        'decay_minutes' => env('RATE_LIMITING_DECAY_MINUTES', 1),
    ],

    'auth' => [
        'password_timeout' => 10800, // 3 horas
        'session_lifetime' => 120, // 2 horas
        'password_history' => 5, // últimas 5 senhas
        'max_login_attempts' => 5,
        'lockout_duration' => 15, // minutos
    ],

    'cors' => [
        'allowed_origins' => [
            env('FRONTEND_URL', 'https://app.fitness360.com'),
        ],
        'allowed_methods' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        'allowed_headers' => ['Content-Type', 'Authorization', 'X-Requested-With'],
        'exposed_headers' => ['X-RateLimit-Limit', 'X-RateLimit-Remaining'],
        'max_age' => 86400, // 24 horas
    ],

    'sanitization' => [
        'escape_html' => true,
        'strip_tags' => true,
        'allowed_tags' => '<p><br><strong><em><ul><li><ol>',
    ],

    'file_uploads' => [
        'max_size' => 10240, // 10MB
        'allowed_types' => [
            'image/jpeg',
            'image/png',
            'image/webp',
            'application/pdf'
        ],
        'scan_virus' => env('VIRUS_SCAN_ENABLED', true),
    ],
]; 