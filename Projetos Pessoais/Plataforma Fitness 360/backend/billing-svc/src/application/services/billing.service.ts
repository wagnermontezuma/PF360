import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice, InvoiceStatus } from '../../domain/entities/invoice.entity';
import { Payment, PaymentStatus, PaymentMethod } from '../../domain/entities/payment.entity';
import { KafkaService } from '../../infrastructure/kafka/kafka.service';
import { StripeService } from '../../infrastructure/stripe/stripe.service';

@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly kafkaService: KafkaService,
    private readonly stripeService: StripeService,
  ) {}

  async createInvoice(data: {
    memberId: string;
    description: string;
    amount: number;
    dueDate: Date;
    tenantId: string;
  }): Promise<Invoice> {
    const invoice = this.invoiceRepository.create({
      ...data,
      status: InvoiceStatus.PENDING,
    });

    const savedInvoice = await this.invoiceRepository.save(invoice);

    await this.kafkaService.emit('invoice.created', {
      invoiceId: savedInvoice.id,
      memberId: savedInvoice.memberId,
      amount: savedInvoice.amount,
    });

    return savedInvoice;
  }

  async processPayment(data: {
    invoiceId: string;
    amount: number;
    method: PaymentMethod;
    tenantId: string;
  }): Promise<Payment> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id: data.invoiceId },
    });

    if (!invoice) {
      throw new Error('Fatura não encontrada');
    }

    if (invoice.status === InvoiceStatus.PAID) {
      throw new Error('Fatura já foi paga');
    }

    const payment = this.paymentRepository.create({
      ...data,
      invoice,
      status: PaymentStatus.PENDING,
    });

    const savedPayment = await this.paymentRepository.save(payment);

    try {
      const stripePayment = await this.stripeService.processPayment({
        amount: data.amount,
        currency: 'brl',
        paymentMethod: data.method,
      });

      await this.handlePaymentSuccess({
        paymentId: savedPayment.id,
        transactionId: stripePayment.id,
      });

      return savedPayment;
    } catch (error) {
      await this.handlePaymentFailure({
        paymentId: savedPayment.id,
        error: error.message,
      });
      throw error;
    }
  }

  async handlePaymentSuccess(data: { paymentId: string; transactionId: string }): Promise<void> {
    const payment = await this.paymentRepository.findOne({
      where: { id: data.paymentId },
      relations: ['invoice'],
    });

    if (!payment) {
      throw new Error('Pagamento não encontrado');
    }

    payment.status = PaymentStatus.COMPLETED;
    payment.transactionId = data.transactionId;
    await this.paymentRepository.save(payment);

    payment.invoice.status = InvoiceStatus.PAID;
    await this.invoiceRepository.save(payment.invoice);

    await this.kafkaService.emit('payment.success', {
      paymentId: payment.id,
      invoiceId: payment.invoice.id,
      memberId: payment.invoice.memberId,
    });
  }

  async handlePaymentFailure(data: { paymentId: string; error: string }): Promise<void> {
    const payment = await this.paymentRepository.findOne({
      where: { id: data.paymentId },
      relations: ['invoice'],
    });

    if (!payment) {
      throw new Error('Pagamento não encontrado');
    }

    payment.status = PaymentStatus.FAILED;
    await this.paymentRepository.save(payment);

    payment.invoice.status = InvoiceStatus.FAILED;
    await this.invoiceRepository.save(payment.invoice);

    await this.kafkaService.emit('payment.failure', {
      paymentId: payment.id,
      invoiceId: payment.invoice.id,
      memberId: payment.invoice.memberId,
      error: data.error,
    });
  }

  async getMemberPaymentHistory(memberId: string): Promise<Payment[]> {
    return await this.paymentRepository.find({
      where: { invoice: { memberId } },
      relations: ['invoice'],
      order: { createdAt: 'DESC' },
    });
  }

  async cancelInvoice(invoiceId: string): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id: invoiceId },
    });

    if (!invoice) {
      throw new Error('Fatura não encontrada');
    }

    if (invoice.status === InvoiceStatus.PAID) {
      throw new Error('Não é possível cancelar uma fatura já paga');
    }

    invoice.status = InvoiceStatus.CANCELLED;
    const savedInvoice = await this.invoiceRepository.save(invoice);

    await this.kafkaService.emit('invoice.cancelled', {
      invoiceId: savedInvoice.id,
      memberId: savedInvoice.memberId,
    });

    return savedInvoice;
  }
} 