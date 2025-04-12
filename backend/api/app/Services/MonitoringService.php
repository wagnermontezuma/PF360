<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Exception;

class MonitoringService
{
    private const PERFORMANCE_THRESHOLD = 1000; // 1 segundo em ms
    private const MEMORY_THRESHOLD = 128; // 128MB
    private const ERROR_THRESHOLD = 5; // 5 erros em 5 minutos
    
    public function logPerformanceMetrics(array $metrics): void
    {
        Log::channel('performance')->info('Performance Metrics', $metrics);
        
        // Alerta se o tempo de execução exceder o limite
        if (isset($metrics['execution_time']) && 
            (float)$metrics['execution_time'] > self::PERFORMANCE_THRESHOLD) {
            $this->triggerAlert('performance', [
                'message' => 'Alto tempo de execução detectado',
                'metrics' => $metrics
            ]);
        }
        
        // Alerta se o uso de memória exceder o limite
        if (isset($metrics['memory_usage']) && 
            (float)$metrics['memory_usage'] > self::MEMORY_THRESHOLD) {
            $this->triggerAlert('performance', [
                'message' => 'Alto uso de memória detectado',
                'metrics' => $metrics
            ]);
        }
    }
    
    public function logSecurityEvent(string $type, array $data): void
    {
        Log::channel('security')->info("Security Event: {$type}", $data);
        
        // Sempre alerta eventos de segurança
        $this->triggerAlert('security', [
            'type' => $type,
            'data' => $data
        ]);
    }
    
    public function logError(Exception $exception, array $context = []): void
    {
        Log::channel('daily')->error($exception->getMessage(), [
            'exception' => get_class($exception),
            'file' => $exception->getFile(),
            'line' => $exception->getLine(),
            'trace' => $exception->getTraceAsString(),
            'context' => $context
        ]);
        
        // Contagem de erros nos últimos 5 minutos
        $errorCount = Cache::increment('error_count', 1);
        Cache::put('error_count', $errorCount, now()->addMinutes(5));
        
        if ($errorCount >= self::ERROR_THRESHOLD) {
            $this->triggerAlert('error', [
                'message' => 'Alta frequência de erros detectada',
                'count' => $errorCount,
                'last_error' => [
                    'message' => $exception->getMessage(),
                    'type' => get_class($exception)
                ]
            ]);
            Cache::delete('error_count');
        }
    }
    
    private function triggerAlert(string $type, array $data): void
    {
        // Log do alerta
        Log::channel('slack')->critical("Alert: {$type}", $data);
        
        // Armazena alerta no cache para o dashboard
        $alerts = Cache::get('monitoring_alerts', []);
        $alerts[] = [
            'type' => $type,
            'data' => $data,
            'timestamp' => now()->toIso8601String()
        ];
        
        // Mantém apenas os últimos 100 alertas
        if (count($alerts) > 100) {
            array_shift($alerts);
        }
        
        Cache::put('monitoring_alerts', $alerts, now()->addDays(1));
    }
    
    public function getRecentAlerts(): array
    {
        return Cache::get('monitoring_alerts', []);
    }
    
    public function getPerformanceMetrics(): array
    {
        // Métricas dos últimos 15 minutos
        $logs = Log::channel('performance')
            ->getLogger()
            ->getHandlers()[0]
            ->getRecords();
            
        $metrics = [
            'average_response_time' => 0,
            'peak_memory_usage' => 0,
            'total_requests' => 0,
            'slow_requests' => 0
        ];
        
        foreach ($logs as $log) {
            if (isset($log['context']['execution_time'])) {
                $metrics['average_response_time'] += (float)$log['context']['execution_time'];
                $metrics['total_requests']++;
                
                if ((float)$log['context']['execution_time'] > self::PERFORMANCE_THRESHOLD) {
                    $metrics['slow_requests']++;
                }
            }
            
            if (isset($log['context']['memory_usage'])) {
                $metrics['peak_memory_usage'] = max(
                    $metrics['peak_memory_usage'],
                    (float)$log['context']['memory_usage']
                );
            }
        }
        
        if ($metrics['total_requests'] > 0) {
            $metrics['average_response_time'] /= $metrics['total_requests'];
        }
        
        return $metrics;
    }
} 