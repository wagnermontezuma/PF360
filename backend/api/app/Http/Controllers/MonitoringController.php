<?php

namespace App\Http\Controllers;

use App\Services\MonitoringService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\DB;

class MonitoringController extends Controller
{
    private $monitoringService;
    
    public function __construct(MonitoringService $monitoringService)
    {
        $this->monitoringService = $monitoringService;
        $this->middleware('auth:api');
        $this->middleware('can:view-monitoring');
    }
    
    public function dashboard(): JsonResponse
    {
        $today = date('Y-m-d');
        $key = 'performance_metrics:' . $today;

        $metrics = [
            'general' => Cache::get($key . ':general', [
                'total_requests' => 0,
                'total_errors' => 0,
                'avg_duration' => 0,
                'peak_memory' => 0
            ]),
            'endpoints' => Cache::get($key . ':endpoints', []),
            'system' => $this->getSystemMetrics(),
            'database' => $this->getDatabaseMetrics(),
            'cache' => $this->getCacheMetrics()
        ];

        return response()->json($metrics);
    }
    
    public function health(): JsonResponse
    {
        $health = [
            'status' => 'healthy',
            'timestamp' => now()->toIso8601String(),
            'services' => [
                'database' => $this->checkDatabase(),
                'redis' => $this->checkRedis(),
                'storage' => $this->checkStorage()
            ]
        ];

        // Se algum serviço estiver com problema, marca como unhealthy
        foreach ($health['services'] as $service) {
            if ($service['status'] === 'error') {
                $health['status'] = 'unhealthy';
                break;
            }
        }

        return response()->json($health);
    }
    
    private function getSystemMetrics(): array
    {
        return [
            'memory' => [
                'total' => memory_get_peak_usage(true),
                'real' => memory_get_peak_usage(),
            ],
            'cpu' => [
                'load' => sys_getloadavg(),
            ],
            'disk' => [
                'free' => disk_free_space('/'),
                'total' => disk_total_space('/'),
            ]
        ];
    }
    
    private function getDatabaseMetrics(): array
    {
        try {
            $metrics = [
                'connections' => DB::select('SHOW STATUS WHERE Variable_name = "Threads_connected"')[0]->Value,
                'max_connections' => DB::select('SHOW VARIABLES LIKE "max_connections"')[0]->Value,
                'slow_queries' => DB::select('SHOW GLOBAL STATUS WHERE Variable_name = "Slow_queries"')[0]->Value,
            ];

            // Calcula uso de conexões em porcentagem
            $metrics['connection_usage'] = ($metrics['connections'] / $metrics['max_connections']) * 100;

            return $metrics;
        } catch (\Exception $e) {
            return ['error' => $e->getMessage()];
        }
    }
    
    private function getCacheMetrics(): array
    {
        try {
            $info = Redis::info();
            return [
                'connected_clients' => $info['connected_clients'],
                'used_memory' => $info['used_memory'],
                'hits' => $info['keyspace_hits'],
                'misses' => $info['keyspace_misses'],
                'hit_rate' => $info['keyspace_hits'] / ($info['keyspace_hits'] + $info['keyspace_misses']) * 100
            ];
        } catch (\Exception $e) {
            return ['error' => $e->getMessage()];
        }
    }
    
    private function checkDatabase(): array
    {
        try {
            DB::connection()->getPdo();
            return [
                'status' => 'healthy',
                'message' => 'Database connection successful'
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'message' => 'Database connection failed: ' . $e->getMessage()
            ];
        }
    }
    
    private function checkRedis(): array
    {
        try {
            Redis::ping();
            return [
                'status' => 'healthy',
                'message' => 'Redis connection successful'
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'message' => 'Redis connection failed: ' . $e->getMessage()
            ];
        }
    }
    
    private function checkStorage(): array
    {
        $uploadPath = storage_path('app/public');
        
        if (!is_writable($uploadPath)) {
            return [
                'status' => 'error',
                'message' => 'Storage directory is not writable'
            ];
        }

        return [
            'status' => 'healthy',
            'message' => 'Storage is writable'
        ];
    }
} 