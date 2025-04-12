<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class PerformanceMonitoring
{
    public function handle(Request $request, Closure $next): Response
    {
        // Marca o início da requisição
        $startTime = microtime(true);
        $startMemory = memory_get_usage();

        // Processa a requisição
        $response = $next($request);

        // Calcula métricas
        $endTime = microtime(true);
        $endMemory = memory_get_usage();
        
        $metrics = [
            'path' => $request->path(),
            'method' => $request->method(),
            'duration_ms' => round(($endTime - $startTime) * 1000, 2),
            'memory_usage_mb' => round(($endMemory - $startMemory) / 1024 / 1024, 2),
            'status_code' => $response->getStatusCode(),
            'user_id' => $request->user()?->id ?? 'guest',
            'timestamp' => now()->toIso8601String()
        ];

        // Registra métricas no cache para dashboard
        $this->updateMetrics($metrics);

        // Adiciona headers de performance
        $response->headers->add([
            'X-Response-Time-MS' => $metrics['duration_ms'],
            'X-Memory-Usage-MB' => $metrics['memory_usage_mb']
        ]);

        // Registra log se a requisição for lenta (> 1s)
        if ($metrics['duration_ms'] > 1000) {
            Log::warning('Requisição lenta detectada', $metrics);
        }

        return $response;
    }

    private function updateMetrics(array $metrics): void
    {
        $key = 'performance_metrics:' . date('Y-m-d');
        
        // Atualiza métricas do endpoint
        $endpointKey = $metrics['method'] . ':' . $metrics['path'];
        $endpointMetrics = Cache::get($key . ':endpoints', []);
        
        if (!isset($endpointMetrics[$endpointKey])) {
            $endpointMetrics[$endpointKey] = [
                'count' => 0,
                'total_duration' => 0,
                'max_duration' => 0,
                'errors' => 0
            ];
        }

        $endpointMetrics[$endpointKey]['count']++;
        $endpointMetrics[$endpointKey]['total_duration'] += $metrics['duration_ms'];
        $endpointMetrics[$endpointKey]['max_duration'] = max(
            $endpointMetrics[$endpointKey]['max_duration'],
            $metrics['duration_ms']
        );
        
        if ($metrics['status_code'] >= 400) {
            $endpointMetrics[$endpointKey]['errors']++;
        }

        Cache::put($key . ':endpoints', $endpointMetrics, now()->addDays(7));

        // Atualiza métricas gerais
        $generalMetrics = Cache::get($key . ':general', [
            'total_requests' => 0,
            'total_errors' => 0,
            'avg_duration' => 0,
            'peak_memory' => 0
        ]);

        $generalMetrics['total_requests']++;
        if ($metrics['status_code'] >= 400) {
            $generalMetrics['total_errors']++;
        }
        
        $generalMetrics['avg_duration'] = (
            ($generalMetrics['avg_duration'] * ($generalMetrics['total_requests'] - 1)) +
            $metrics['duration_ms']
        ) / $generalMetrics['total_requests'];
        
        $generalMetrics['peak_memory'] = max(
            $generalMetrics['peak_memory'],
            $metrics['memory_usage_mb']
        );

        Cache::put($key . ':general', $generalMetrics, now()->addDays(7));
    }
} 