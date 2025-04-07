import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { v4 as uuidv4 } from 'uuid';
import { PrometheusService } from '../../infrastructure/metrics/prometheus.service';
import { PaymentMethod } from '../../domain/entities/payment.entity';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  private readonly logger = new Logger(StripeService.name);

  constructor(
    private configService: ConfigService,
    private metricsService: PrometheusService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  }

  async createPaymentIntent(amount: number, currency: string = 'BRL'): Promise<Stripe.PaymentIntent> {
    const idempotencyKey = uuidv4();
    
    try {
      const startTime = Date.now();
      const paymentIntent = await this.stripe.paymentIntents.create(
        {
          amount: Math.round(amount * 100), // Stripe trabalha com centavos
          currency,
          payment_method_types: ['card'],
        },
        { idempotencyKey }
      );

      this.metricsService.recordStripeLatency('payment_intent_create', Date.now() - startTime);
      return paymentIntent;
    } catch (error) {
      this.logger.error(`Erro ao criar PaymentIntent: ${error.message}`, error.stack);
      this.metricsService.incrementStripeErrors('payment_intent_create');
      throw error;
    }
  }

  async verifyWebhookSignature(payload: string, signature: string): Promise<boolean> {
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        this.configService.get('STRIPE_WEBHOOK_SECRET')
      );
      return !!event;
    } catch (error) {
      this.logger.error(`Erro na verificação de assinatura webhook: ${error.message}`);
      return false;
    }
  }

  async processPayment(params: {
    amount: number;
    currency: string;
    paymentMethod: string;
  }): Promise<{ id: string; status: string }> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(params.amount * 100), // Stripe works with cents
        currency: params.currency.toLowerCase(),
        payment_method_types: [this.getPaymentMethodType(params.paymentMethod)],
      });

      return {
        id: paymentIntent.id,
        status: paymentIntent.status,
      };
    } catch (error) {
      this.logger.error('Error processing payment:', error);
      throw new Error('Failed to process payment');
    }
  }

  private getPaymentMethodType(paymentMethod: string): string {
    const paymentMethodMap = {
      [PaymentMethod.CREDIT_CARD]: 'card',
      [PaymentMethod.DEBIT_CARD]: 'card',
      [PaymentMethod.PIX]: 'pix',
      [PaymentMethod.BOLETO]: 'boleto',
    };

    return paymentMethodMap[paymentMethod] || 'card';
  }
} 