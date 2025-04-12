import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BillingService } from './billing.service';
import { DashboardMetrics } from './interfaces/dashboard-metrics.interface';

@ApiTags('billing')
@ApiBearerAuth()
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @UseGuards(JwtAuthGuard)
  @Get('dashboard')
  @ApiOperation({ summary: 'Obter métricas do dashboard de faturamento' })
  @ApiResponse({ status: 200, description: 'Métricas obtidas com sucesso' })
  getDashboardMetrics() {
    return this.billingService.getDashboardMetrics();
  }

  @UseGuards(JwtAuthGuard)
  @Post('invoices')
  @ApiOperation({ summary: 'Gerar nova fatura' })
  @ApiResponse({ status: 201, description: 'Fatura gerada com sucesso' })
  gerarFatura(
    @Body() faturaDto: { userId: string; valor: number; descricao: string }
  ) {
    return this.billingService.gerarFatura(
      faturaDto.userId, 
      faturaDto.valor, 
      faturaDto.descricao
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('invoices/:id/payment')
  @ApiOperation({ summary: 'Registrar pagamento de uma fatura' })
  @ApiParam({ name: 'id', description: 'ID da fatura' })
  @ApiResponse({ status: 200, description: 'Pagamento registrado com sucesso' })
  registrarPagamento(
    @Param('id') id: string,
    @Body() pagamentoDto: { valor: number }
  ) {
    return this.billingService.registrarPagamento(
      Number(id), 
      pagamentoDto.valor
    );
  }
} 