import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { PaymentMethod } from '../../domain/entities/payment.entity';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
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
      console.error('Error processing payment:', error);
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