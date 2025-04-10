import { ApiProperty } from '@nestjs/swagger';

export class DashboardMetrics {
  @ApiProperty({ example: 15750.00, description: 'Faturamento total do mês atual' })
  faturamentoMensal: number;

  @ApiProperty({ example: 45, description: 'Total de planos ativos' })
  planosAtivos: number;

  @ApiProperty({ example: 350.00, description: 'Ticket médio dos planos' })
  ticketMedio: number;

  @ApiProperty({ example: 12500.00, description: 'Total pago no mês atual' })
  totalPago: number;

  @ApiProperty({ example: 5, description: 'Número de alunos inadimplentes' })
  inadimplentes: number;

  @ApiProperty({ description: 'Métricas gerais' })
  metricas: {
    receitaTotal: number;
    crescimentoMensal: number;
    taxaRenovacao: number;
  };

  @ApiProperty({ description: 'Distribuição de planos por tipo' })
  planosPorTipo: {
    basic: number;
    premium: number;
    enterprise: number;
  };

  @ApiProperty({ description: 'Lista das últimas faturas' })
  ultimasFaturas: Array<{
    id: number;
    cliente: string;
    valor: number;
    status: string;
    data: string;
  }>;
} 