import { Test, TestingModule } from '@nestjs/testing';
import { BillingService } from './billing.service';
import { KafkaService, KafkaTopics } from '../common/kafka';

// Mock para o serviço Kafka
const mockKafkaService = {
  emit: jest.fn().mockResolvedValue(undefined),
};

describe('BillingService', () => {
  let service: BillingService;
  let kafkaService: KafkaService;

  beforeEach(async () => {
    jest.clearAllMocks();
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillingService,
        {
          provide: KafkaService,
          useValue: mockKafkaService,
        },
      ],
    }).compile();

    service = module.get<BillingService>(BillingService);
    kafkaService = module.get<KafkaService>(KafkaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDashboardMetrics', () => {
    it('should return dashboard metrics object with all required fields', async () => {
      const result = await service.getDashboardMetrics();
      
      // Verificar a estrutura do objeto retornado
      expect(result).toHaveProperty('faturamentoMensal');
      expect(result).toHaveProperty('planosAtivos');
      expect(result).toHaveProperty('ticketMedio');
      expect(result).toHaveProperty('totalPago');
      expect(result).toHaveProperty('inadimplentes');
      expect(result).toHaveProperty('metricas');
      expect(result).toHaveProperty('planosPorTipo');
      expect(result).toHaveProperty('ultimasFaturas');
      
      // Verificar tipos de dados dos campos
      expect(typeof result.faturamentoMensal).toBe('number');
      expect(typeof result.planosAtivos).toBe('number');
      expect(typeof result.ticketMedio).toBe('number');
      
      // Verificar estrutura de objetos aninhados
      expect(result.metricas).toHaveProperty('receitaTotal');
      expect(result.metricas).toHaveProperty('crescimentoMensal');
      expect(result.metricas).toHaveProperty('taxaRenovacao');
      
      expect(result.planosPorTipo).toHaveProperty('basic');
      expect(result.planosPorTipo).toHaveProperty('premium');
      expect(result.planosPorTipo).toHaveProperty('enterprise');
      
      // Verificar array de faturas
      expect(Array.isArray(result.ultimasFaturas)).toBe(true);
      expect(result.ultimasFaturas.length).toBeGreaterThan(0);
      
      const fatura = result.ultimasFaturas[0];
      expect(fatura).toHaveProperty('id');
      expect(fatura).toHaveProperty('cliente');
      expect(fatura).toHaveProperty('valor');
      expect(fatura).toHaveProperty('status');
      expect(fatura).toHaveProperty('data');
    });
    
    it('should have valid values for metrics calculations', async () => {
      const result = await service.getDashboardMetrics();
      
      // Verificar se o ticket médio é calculado corretamente (aproximadamente)
      const calculatedTicket = result.faturamentoMensal / result.planosAtivos;
      expect(result.ticketMedio).toBeCloseTo(calculatedTicket, 0);
      
      // Verificar se total de planos por tipo é igual ao número de planos ativos
      const totalPlanos = result.planosPorTipo.basic + 
                         result.planosPorTipo.premium + 
                         result.planosPorTipo.enterprise;
      expect(result.planosAtivos).toBe(totalPlanos);
    });
  });

  describe('gerarFatura', () => {
    it('should generate a new invoice and emit a Kafka event', async () => {
      const userId = 'user123';
      const valor = 150.0;
      const descricao = 'Mensalidade Plano Premium';
      
      const result = await service.gerarFatura(userId, valor, descricao);
      
      // Verificar se a fatura foi criada com os dados corretos
      expect(result).toHaveProperty('id');
      expect(result.userId).toBe(userId);
      expect(result.valor).toBe(valor);
      expect(result.descricao).toBe(descricao);
      expect(result.status).toBe('Pendente');
      expect(result).toHaveProperty('dataVencimento');
      expect(result).toHaveProperty('dataCriacao');
      
      // Verificar se o evento foi emitido para o Kafka
      expect(kafkaService.emit).toHaveBeenCalledTimes(1);
      expect(kafkaService.emit).toHaveBeenCalledWith({
        topic: KafkaTopics.BILLING_CREATED,
        value: result,
      });
    });
  });
  
  describe('registrarPagamento', () => {
    it('should register a payment for an invoice and emit a Kafka event', async () => {
      const faturaId = 123;
      const valor = 150.0;
      
      const result = await service.registrarPagamento(faturaId, valor);
      
      // Verificar se o pagamento foi registrado corretamente
      expect(result).toHaveProperty('id');
      expect(result.id).toBe(faturaId);
      expect(result.valor).toBe(valor);
      expect(result.status).toBe('Pago');
      expect(result).toHaveProperty('dataPagamento');
      
      // Verificar se o evento foi emitido para o Kafka
      expect(kafkaService.emit).toHaveBeenCalledTimes(1);
      expect(kafkaService.emit).toHaveBeenCalledWith({
        topic: KafkaTopics.BILLING_CREATED,
        key: `payment-${faturaId}`,
        value: {
          ...result,
          tipo: 'pagamento',
        },
      });
    });
  });
}); 