import { Injectable } from '@nestjs/common';
import { KafkaService, KafkaTopics } from '../common/kafka';

@Injectable()
export class BillingService {
  constructor(private readonly kafkaService: KafkaService) {}

  async getDashboardMetrics() {
    // Dados mockados para o dashboard
    return {
      faturamentoMensal: 15750.00,
      planosAtivos: 45,
      ticketMedio: 350.00,
      totalPago: 12500.00,
      inadimplentes: 5,
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

  async gerarFatura(userId: string, valor: number, descricao: string) {
    // Em um cenário real, criaria a fatura no banco de dados
    const fatura = {
      id: Math.floor(Math.random() * 10000),
      userId,
      valor,
      descricao,
      status: 'Pendente',
      dataVencimento: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 dias a partir de hoje
      dataCriacao: new Date(),
    };

    // Emitir evento para notificar sobre a nova fatura
    await this.kafkaService.emit({
      topic: KafkaTopics.BILLING_CREATED,
      value: fatura
    });

    return fatura;
  }

  async registrarPagamento(faturaId: number, valor: number) {
    // Em um cenário real, atualizaria o status da fatura no banco de dados
    const fatura = {
      id: faturaId,
      valor,
      status: 'Pago',
      dataPagamento: new Date(),
    };

    // Emitir evento para notificar sobre o pagamento
    await this.kafkaService.emit({
      topic: KafkaTopics.BILLING_CREATED,
      key: `payment-${faturaId}`,
      value: {
        ...fatura,
        tipo: 'pagamento',
      }
    });

    return fatura;
  }
} 