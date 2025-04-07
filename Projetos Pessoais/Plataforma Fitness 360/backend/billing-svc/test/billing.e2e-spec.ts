import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { KafkaService } from '../src/infrastructure/messaging/kafka.service';

describe('BillingModule (e2e)', () => {
  let app: INestApplication;
  let kafkaService: KafkaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    kafkaService = moduleFixture.get<KafkaService>(KafkaService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create invoice, process payment and emit Kafka event', async () => {
    // Mock Stripe webhook event
    const mockWebhookEvent = {
      type: 'payment_intent.succeeded',
      data: {
        object: {
          id: 'pi_test',
          amount: 9990,
          status: 'succeeded',
        },
      },
    };

    // Spy on Kafka emit
    const kafkaSpy = jest.spyOn(kafkaService, 'emit');

    // Create invoice
    const createInvoiceResponse = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation {
            createInvoice(input: {
              memberId: "test-member",
              amount: 99.90,
              description: "Test Invoice",
              dueDate: "2024-03-20"
            }) {
              id
              status
            }
          }
        `,
      })
      .expect(200);

    const invoiceId = createInvoiceResponse.body.data.createInvoice.id;

    // Simulate Stripe webhook
    await request(app.getHttpServer())
      .post('/webhooks/stripe')
      .send(mockWebhookEvent)
      .expect(200);

    // Verify invoice status
    const getInvoiceResponse = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          query {
            invoice(id: "${invoiceId}") {
              status
            }
          }
        `,
      })
      .expect(200);

    expect(getInvoiceResponse.body.data.invoice.status).toBe('PAID');

    // Verify Kafka event
    expect(kafkaSpy).toHaveBeenCalledWith('payment.success', expect.objectContaining({
      invoiceId,
      amount: 99.90,
      memberId: 'test-member',
    }));
  });
}); 