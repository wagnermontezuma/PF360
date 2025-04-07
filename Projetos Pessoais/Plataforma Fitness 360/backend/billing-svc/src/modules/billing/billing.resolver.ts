import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards, Logger } from '@nestjs/common';
import { BillingService } from './billing.service';
import { AuthGuard } from '../../infrastructure/guards/auth.guard';
import { RolesGuard } from '../../infrastructure/guards/roles.guard';
import { Roles } from '../../infrastructure/decorators/roles.decorator';
import { CreateInvoiceInput, ProcessPaymentInput } from './dto/billing.input';
import { BillingError } from './errors/billing.error';
import { PrometheusService } from '../../infrastructure/metrics/prometheus.service';

@Resolver()
export class BillingResolver {
  private readonly logger = new Logger(BillingResolver.name);

  constructor(
    private readonly billingService: BillingService,
    private readonly metricsService: PrometheusService,
  ) {}

  @Query()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  async invoices(@Args('memberId', { type: () => ID }) memberId: string) {
    try {
      const startTime = Date.now();
      const invoices = await this.billingService.getInvoicesByMember(memberId);
      this.metricsService.recordStripeLatency('get_invoices', Date.now() - startTime);
      return invoices;
    } catch (error) {
      this.logger.error(`Erro ao buscar faturas: ${error.message}`, error.stack);
      throw new BillingError('Erro ao buscar faturas', error);
    }
  }

  @Query()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'MANAGER', 'MEMBER')
  async invoice(@Args('id', { type: () => ID }) id: string) {
    try {
      return await this.billingService.getInvoiceById(id);
    } catch (error) {
      this.logger.error(`Erro ao buscar fatura: ${error.message}`, error.stack);
      throw new BillingError('Erro ao buscar fatura', error);
    }
  }

  @Query()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'MANAGER', 'MEMBER')
  async memberPaymentHistory(@Args('memberId', { type: () => ID }) memberId: string) {
    try {
      return await this.billingService.getMemberPaymentHistory(memberId);
    } catch (error) {
      this.logger.error(`Erro ao buscar histórico de pagamentos: ${error.message}`, error.stack);
      throw new BillingError('Erro ao buscar histórico de pagamentos', error);
    }
  }

  @Mutation()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  async createInvoice(@Args('input') input: CreateInvoiceInput) {
    try {
      const startTime = Date.now();
      const invoice = await this.billingService.createInvoice({
        ...input,
        dueDate: new Date(input.dueDate),
        tenantId: 'default', // TODO: Obter do contexto
      });
      this.metricsService.recordStripeLatency('create_invoice', Date.now() - startTime);
      return invoice;
    } catch (error) {
      this.logger.error(`Erro ao criar fatura: ${error.message}`, error.stack);
      throw new BillingError('Erro ao criar fatura', error);
    }
  }

  @Mutation()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'MANAGER', 'MEMBER')
  async processPayment(@Args('input') input: ProcessPaymentInput) {
    try {
      const startTime = Date.now();
      const paymentAttempt = await this.billingService.processPayment(
        input.invoiceId,
        input.paymentMethodId,
      );
      this.metricsService.recordStripeLatency('process_payment', Date.now() - startTime);
      return paymentAttempt;
    } catch (error) {
      this.logger.error(`Erro ao processar pagamento: ${error.message}`, error.stack);
      throw new BillingError('Erro ao processar pagamento', error);
    }
  }

  @Mutation()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  async cancelInvoice(@Args('id', { type: () => ID }) id: string) {
    try {
      return await this.billingService.cancelInvoice(id);
    } catch (error) {
      this.logger.error(`Erro ao cancelar fatura: ${error.message}`, error.stack);
      throw new BillingError('Erro ao cancelar fatura', error);
    }
  }
} 