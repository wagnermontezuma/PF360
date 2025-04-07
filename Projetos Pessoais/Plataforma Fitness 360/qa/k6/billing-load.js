import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export const options = {
  vus: 50,
  duration: '3m',
  thresholds: {
    http_req_duration: ['p(95)<400'],
    errors: ['rate<0.01'],
  },
};

const BASE_URL = __ENV.GATEWAY_URL || 'https://api.staging.fit360.com';
const JWT_TOKEN = __ENV.JWT_TOKEN;
const TENANT_ID = __ENV.TENANT_ID;

export default function() {
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${JWT_TOKEN}`,
      'x-tenant-id': TENANT_ID,
    },
  };

  // Criar fatura
  const createInvoiceQuery = JSON.stringify({
    query: `mutation CreateInvoice($input: CreateInvoiceInput!) {
      createInvoice(input: $input) { id }
    }`,
    variables: {
      input: {
        memberId: "test-member-id",
        amount: 99.90,
        description: "Mensalidade Academia",
        dueDate: "2024-03-20"
      }
    }
  });

  const createInvoiceRes = http.post(`${BASE_URL}/graphql`, createInvoiceQuery, params);
  const success1 = check(createInvoiceRes, {
    'invoice created': (r) => r.status === 200 && r.json('data.createInvoice.id') !== null,
  });
  errorRate.add(!success1);

  if (success1) {
    const invoiceId = createInvoiceRes.json('data.createInvoice.id');

    // Processar pagamento
    const processPaymentQuery = JSON.stringify({
      query: `mutation ProcessPayment($input: ProcessPaymentInput!) {
        processPayment(input: $input) { id status }
      }`,
      variables: {
        input: {
          invoiceId: invoiceId,
          paymentMethodId: "pm_test_card"
        }
      }
    });

    const processPaymentRes = http.post(`${BASE_URL}/graphql`, processPaymentQuery, params);
    const success2 = check(processPaymentRes, {
      'payment processed': (r) => r.status === 200 && r.json('data.processPayment.status') === 'SUCCESS',
    });
    errorRate.add(!success2);

    // Consultar fatura
    const getInvoiceQuery = JSON.stringify({
      query: `query GetInvoice($id: ID!) {
        invoice(id: $id) { id status }
      }`,
      variables: { id: invoiceId }
    });

    const getInvoiceRes = http.post(`${BASE_URL}/graphql`, getInvoiceQuery, params);
    const success3 = check(getInvoiceRes, {
      'invoice retrieved': (r) => r.status === 200 && r.json('data.invoice.status') === 'PAID',
    });
    errorRate.add(!success3);
  }

  sleep(1);
} 