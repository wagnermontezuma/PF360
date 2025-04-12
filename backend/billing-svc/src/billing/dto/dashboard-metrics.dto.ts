import { ApiProperty } from '@nestjs/swagger';

export class DashboardMetricsDto {
  @ApiProperty({ description: 'Faturamento mensal total' })
  faturamentoMensal: number;

  @ApiProperty({ description: 'Número de planos ativos' })
  planosAtivos: number;

  @ApiProperty({ description: 'Ticket médio por aluno' })
  ticketMedio: number;

  @ApiProperty({ description: 'Taxa de sucesso nos pagamentos (%)' })
  taxaSucessoPagamentos: number;

  @ApiProperty({ description: 'Número de pagamentos pendentes' })
  pagamentosPendentes: number;

  @ApiProperty({ description: 'Previsão de faturamento para o próximo mês' })
  previsaoProximoMes: number;

  @ApiProperty({ description: 'Total pago no mês atual' })
  totalPago: number;

  @ApiProperty({ description: 'Número de alunos inadimplentes' })
  inadimplentes: number;

  @ApiProperty({
    description: 'Métricas gerais do negócio',
    type: 'object',
    properties: {
      receitaTotal: { type: 'number' },
      crescimentoMensal: { type: 'number' },
      taxaRenovacao: { type: 'number' }
    }
  })
  metricas: {
    receitaTotal: number;
    crescimentoMensal: number;
    taxaRenovacao: number;
  };

  @ApiProperty({
    description: 'Distribuição de planos por tipo',
    type: 'object',
    properties: {
      basic: { type: 'number' },
      premium: { type: 'number' },
      enterprise: { type: 'number' }
    }
  })
  planosPorTipo: {
    basic: number;
    premium: number;
    enterprise: number;
  };

  @ApiProperty({
    description: 'Últimas faturas geradas',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        valor: { type: 'number' },
        status: { type: 'string' },
        dataVencimento: { type: 'string', format: 'date-time' }
      }
    }
  })
  ultimasFaturas: Array<{
    id: string;
    valor: number;
    status: string;
    dataVencimento: Date;
  }>;
} 