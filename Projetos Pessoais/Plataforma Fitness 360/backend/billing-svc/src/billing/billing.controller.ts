import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BillingService } from './billing.service';
import { DashboardMetrics } from './interfaces/dashboard-metrics.interface';

@ApiTags('billing')
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('dashboard-metrics')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retorna métricas do dashboard' })
  @ApiResponse({ 
    status: 200, 
    description: 'Métricas retornadas com sucesso',
    type: DashboardMetrics
  })
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    return this.billingService.getDashboardMetrics();
  }
} 