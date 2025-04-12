import { Controller, Get, Header } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { register } from 'prom-client';

@ApiTags('Metrics')
@Controller('metrics')
export class MetricsController {
  @Get()
  @ApiOperation({ summary: 'Get Prometheus metrics' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns metrics in Prometheus format',
    type: String 
  })
  @Header('Content-Type', 'text/plain')
  async getMetrics(): Promise<string> {
    try {
      return await register.metrics();
    } catch (error) {
      throw new Error('Failed to collect metrics');
    }
  }

  getMetricsContentType(): string {
    return register.contentType;
  }
} 