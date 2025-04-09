import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { PaymentMethod } from '../../domain/entities/payment.entity';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2022-11-15',
    });
  }

  async processPayment(params: {
    amount: number;
    currency: string;
    paymentMethod: string;
  }): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(params.amount * 100), // Stripe trabalha com centavos
        currency: params.currency.toLowerCase(),
        payment_method_types: [this.getPaymentMethodTypes(params.paymentMethod)],
      });

      return paymentIntent;
    } catch (error) {
      console.error('Erro ao processar pagamento no Stripe:', error);
      throw new Error('Falha ao processar pagamento');
    }
  }

  private getPaymentMethodTypes(paymentMethod: string): string {
    const paymentMethodMap = {
      [PaymentMethod.CREDIT_CARD]: 'card',
      [PaymentMethod.DEBIT_CARD]: 'card',
      [PaymentMethod.PIX]: 'pix',
      [PaymentMethod.BOLETO]: 'boleto',
    };

    return paymentMethodMap[paymentMethod] || 'card';
  }
} 