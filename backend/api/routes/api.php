<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Controllers\Auth\VerificationController;
use App\Http\Controllers\Auth\TwoFactorAuthController;
use App\Http\Controllers\WorkoutController;
use App\Http\Controllers\MonitoringController;
use App\Http\Controllers\UploadController;

// Rotas públicas de autenticação
Route::group(['prefix' => 'auth'], function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('register', [AuthController::class, 'register']);
    Route::post('forgot-password', [PasswordResetController::class, 'sendResetLink']);
    Route::post('reset-password', [PasswordResetController::class, 'reset']);
    
    // Verificação de email
    Route::get('email/verify/{id}/{hash}', [VerificationController::class, 'verify'])
        ->name('verification.verify');
    Route::post('email/resend', [VerificationController::class, 'resend'])
        ->name('verification.resend');
});

// Rotas protegidas
Route::group(['middleware' => ['jwt.verify']], function () {
    // Rotas de autenticação que requerem token
    Route::group(['prefix' => 'auth'], function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::post('refresh', [AuthController::class, 'refresh']);
        Route::get('profile', [AuthController::class, 'userProfile']);

        // 2FA
        Route::prefix('2fa')->group(function () {
            Route::post('enable', [TwoFactorAuthController::class, 'enable']);
            Route::post('confirm', [TwoFactorAuthController::class, 'confirm']);
            Route::post('disable', [TwoFactorAuthController::class, 'disable']);
            Route::post('verify', [TwoFactorAuthController::class, 'verify']);
        });
    });

    // Outras rotas protegidas da API
    Route::group(['prefix' => 'v1'], function () {
        // Upload
        Route::prefix('upload')->group(function () {
            Route::post('presigned', [UploadController::class, 'getPresignedUrl']);
            Route::delete('{key}', [UploadController::class, 'delete']);
        });
        
        // Workouts
        Route::prefix('workouts')->group(function () {
            Route::get('/', [WorkoutController::class, 'index']);
            Route::post('/', [WorkoutController::class, 'store']);
            Route::get('/{id}', [WorkoutController::class, 'show']);
            Route::put('/{id}', [WorkoutController::class, 'update']);
            Route::delete('/{id}', [WorkoutController::class, 'destroy']);
            Route::post('/{id}/start', [WorkoutController::class, 'start']);
            Route::post('/{id}/complete', [WorkoutController::class, 'complete']);
        });
        
        // Monitoramento (apenas para admins)
        Route::middleware('can:view-monitoring')->prefix('monitoring')->group(function () {
            Route::get('/dashboard', [MonitoringController::class, 'dashboard']);
            Route::get('/health', [MonitoringController::class, 'healthCheck']);
        });
    });
}); 