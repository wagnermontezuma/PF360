import { Injectable } from '@nestjs/common';

@Injectable()
export class BillingService {
  async getDashboardMetrics() {
    // Dados mockados para o dashboard
    return {
      faturamentoMensal: 15750.00,
      planosAtivos: 45,
      ticketMedio: 350.00,
      metricas: {
        receitaTotal: 189000.00,
        crescimentoMensal: 12.5,
        taxaRenovacao: 85.2
      },
      planosPorTipo: {
        basic: 15,
        premium: 25,
        enterprise: 5
      },
      ultimasFaturas: [
        {
          id: 1,
          cliente: 'João Silva',
          valor: 350.00,
          status: 'Pago',
          data: '2024-03-15'
        },
        {
          id: 2,
          cliente: 'Maria Santos',
          valor: 450.00,
          status: 'Pendente',
          data: '2024-03-14'
        },
        {
          id: 3,
          cliente: 'Pedro Oliveira',
          valor: 350.00,
          status: 'Pago',
          data: '2024-03-13'
        }
      ]
    };
  }
} 