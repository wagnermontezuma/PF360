import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { BillingModule } from '../billing.module';
import { BillingService } from '../billing.service';
import { StripeService } from '../../payments/stripe.service';

describe('BillingController (Integration)', () => {
  let app: INestApplication;
  let billingService: BillingService;
  let stripeService: StripeService;

  const mockBillingService = {
    handlePaymentSuccess: jest.fn(),
    handlePaymentFailure: jest.fn(),
  };

  const mockStripeService = {
    verifyWebhookSignature: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [BillingModule],
    })
      .overrideProvider(BillingService)
      .useValue(mockBillingService)
      .overrideProvider(StripeService)
      .useValue(mockStripeService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    billingService = moduleFixture.get<BillingService>(BillingService);
    stripeService = moduleFixture.get<StripeService>(StripeService);
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /stripe/webhook', () => {
    it('deve processar evento de pagamento bem-sucedido', async () => {
      const mockPayload = {
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_123',
          },
        },
      };

      mockStripeService.verifyWebhookSignature.mockResolvedValue(true);
      mockBillingService.handlePaymentSuccess.mockResolvedValue(undefined);

      await request(app.getHttpServer())
        .post('/stripe/webhook')
        .set('stripe-signature', 'test-signature')
        .send(mockPayload)
        .expect(201)
        .expect({ received: true });

      expect(stripeService.verifyWebhookSignature).toHaveBeenCalled();
      expect(billingService.handlePaymentSuccess).toHaveBeenCalledWith('pi_123');
    });

    it('deve processar evento de falha no pagamento', async () => {
      const mockPayload = {
        type: 'payment_intent.payment_failed',
        data: {
          object: {
            id: 'pi_123',
            last_payment_error: {
              code: 'card_declined',
              message: 'Your card was declined',
              decline_code: 'insufficient_funds',
            },
          },
        },
      };

      mockStripeService.verifyWebhookSignature.mockResolvedValue(true);
      mockBillingService.handlePaymentFailure.mockResolvedValue(undefined);

      await request(app.getHttpServer())
        .post('/stripe/webhook')
        .set('stripe-signature', 'test-signature')
        .send(mockPayload)
        .expect(201)
        .expect({ received: true });

      expect(stripeService.verifyWebhookSignature).toHaveBeenCalled();
      expect(billingService.handlePaymentFailure).toHaveBeenCalledWith(
        'pi_123',
        mockPayload.data.object.last_payment_error,
      );
    });

    it('deve rejeitar webhook com assinatura inválida', async () => {
      mockStripeService.verifyWebhookSignature.mockResolvedValue(false);

      await request(app.getHttpServer())
        .post('/stripe/webhook')
        .set('stripe-signature', 'invalid-signature')
        .send({})
        .expect(400);

      expect(stripeService.verifyWebhookSignature).toHaveBeenCalled();
      expect(billingService.handlePaymentSuccess).not.toHaveBeenCalled();
      expect(billingService.handlePaymentFailure).not.toHaveBeenCalled();
    });
  });
}); 