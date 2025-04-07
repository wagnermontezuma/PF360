import { Controller, Post, Headers, Body, Logger } from '@nestjs/common';
import { BillingService } from './billing.service';
import { StripeService } from '../payments/stripe.service';
import { BillingError } from './errors/billing.error';

@Controller('stripe')
export class BillingController {
  private readonly logger = new Logger(BillingController.name);

  constructor(
    private readonly billingService: BillingService,
    private readonly stripeService: StripeService,
  ) {}

  @Post('webhook')
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Body() payload: any,
  ) {
    try {
      const isValid = await this.stripeService.verifyWebhookSignature(
        JSON.stringify(payload),
        signature,
      );

      if (!isValid) {
        throw new BillingError('Assinatura do webhook inválida');
      }

      const event = payload;

      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.billingService.handlePaymentSuccess(
            event.data.object.id,
          );
          break;

        case 'payment_intent.payment_failed':
          await this.billingService.handlePaymentFailure(
            event.data.object.id,
            event.data.object.last_payment_error,
          );
          break;

        default:
          this.logger.log(`Evento não tratado: ${event.type}`);
      }

      return { received: true };
    } catch (error) {
      this.logger.error(`Erro ao processar webhook: ${error.message}`, error.stack);
      throw error;
    }
  }
} 