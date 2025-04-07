import { Test, TestingModule } from '@nestjs/testing';
import { BillingResolver } from '../billing.resolver';
import { BillingService } from '../billing.service';
import { PrometheusService } from '../../../infrastructure/metrics/prometheus.service';
import { CreateInvoiceInput, ProcessPaymentInput } from '../dto/billing.input';
import { BillingError } from '../errors/billing.error';

describe('BillingResolver', () => {
  let resolver: BillingResolver;
  let billingService: BillingService;
  let metricsService: PrometheusService;

  const mockBillingService = {
    getInvoicesByMember: jest.fn(),
    getInvoiceById: jest.fn(),
    getMemberPaymentHistory: jest.fn(),
    createInvoice: jest.fn(),
    processPayment: jest.fn(),
    cancelInvoice: jest.fn(),
  };

  const mockMetricsService = {
    recordStripeLatency: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillingResolver,
        {
          provide: BillingService,
          useValue: mockBillingService,
        },
        {
          provide: PrometheusService,
          useValue: mockMetricsService,
        },
      ],
    }).compile();

    resolver = module.get<BillingResolver>(BillingResolver);
    billingService = module.get<BillingService>(BillingService);
    metricsService = module.get<PrometheusService>(PrometheusService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('invoices', () => {
    it('deve retornar lista de faturas do membro', async () => {
      const memberId = 'member-123';
      const mockInvoices = [{ id: 'invoice-1' }, { id: 'invoice-2' }];
      mockBillingService.getInvoicesByMember.mockResolvedValue(mockInvoices);

      const result = await resolver.invoices(memberId);

      expect(result).toEqual(mockInvoices);
      expect(billingService.getInvoicesByMember).toHaveBeenCalledWith(memberId);
      expect(metricsService.recordStripeLatency).toHaveBeenCalled();
    });

    it('deve lançar BillingError em caso de erro', async () => {
      const memberId = 'member-123';
      mockBillingService.getInvoicesByMember.mockRejectedValue(new Error('Database error'));

      await expect(resolver.invoices(memberId)).rejects.toThrow(BillingError);
    });
  });

  describe('createInvoice', () => {
    it('deve criar uma nova fatura', async () => {
      const input: CreateInvoiceInput = {
        memberId: 'member-123',
        contractId: 'contract-123',
        amount: 100,
        description: 'Mensalidade',
        dueDate: '2024-03-20',
      };
      const mockInvoice = { id: 'invoice-1', ...input };
      mockBillingService.createInvoice.mockResolvedValue(mockInvoice);

      const result = await resolver.createInvoice(input);

      expect(result).toEqual(mockInvoice);
      expect(billingService.createInvoice).toHaveBeenCalledWith(input);
      expect(metricsService.recordStripeLatency).toHaveBeenCalled();
    });
  });

  describe('processPayment', () => {
    it('deve processar um pagamento', async () => {
      const input: ProcessPaymentInput = {
        invoiceId: 'invoice-123',
        paymentMethodId: 'pm-123',
      };
      const mockPaymentAttempt = { id: 'attempt-1', status: 'PROCESSING' };
      mockBillingService.processPayment.mockResolvedValue(mockPaymentAttempt);

      const result = await resolver.processPayment(input);

      expect(result).toEqual(mockPaymentAttempt);
      expect(billingService.processPayment).toHaveBeenCalledWith(input);
      expect(metricsService.recordStripeLatency).toHaveBeenCalled();
    });
  });
}); 