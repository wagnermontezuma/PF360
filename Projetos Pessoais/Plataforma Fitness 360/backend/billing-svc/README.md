# Serviço de Faturamento - Fitness 360

Microserviço responsável pelo gerenciamento de faturamento e pagamentos da plataforma Fitness 360.

## Funcionalidades

- Geração e gerenciamento de faturas
- Processamento de pagamentos via Stripe
- Histórico de tentativas de pagamento
- Métricas de monitoramento com Prometheus

## Pré-requisitos

- Node.js 18+
- PostgreSQL 14+
- Conta Stripe (para processamento de pagamentos)

## Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. Execute as migrações do banco de dados:
```bash
npm run migration:run
```

5. Inicie o serviço:
```bash
npm run start:dev
```

## Endpoints GraphQL

O serviço expõe uma API GraphQL com os seguintes endpoints principais:

### Queries

#### Listar faturas de um membro
```graphql
query GetMemberInvoices($memberId: ID!) {
  invoices(memberId: $memberId) {
    id
    amount
    description
    status
    dueDate
    createdAt
    paymentAttempts {
      id
      status
      createdAt
    }
  }
}
```

#### Obter detalhes de uma fatura
```graphql
query GetInvoice($id: ID!) {
  invoice(id: $id) {
    id
    memberId
    contractId
    amount
    description
    status
    dueDate
    stripeInvoiceId
    paymentAttempts {
      id
      status
      stripePaymentIntentId
      errorDetails {
        code
        message
        declinedCode
      }
      createdAt
    }
    createdAt
    updatedAt
  }
}
```

### Mutations

#### Criar nova fatura
```graphql
mutation CreateInvoice($input: CreateInvoiceInput!) {
  createInvoice(input: $input) {
    id
    memberId
    amount
    description
    status
    dueDate
    createdAt
  }
}

# Variáveis
{
  "input": {
    "memberId": "123",
    "contractId": "456",
    "amount": 99.90,
    "description": "Mensalidade Academia - Março/2024",
    "dueDate": "2024-03-10"
  }
}
```

#### Processar pagamento
```graphql
mutation ProcessPayment($input: ProcessPaymentInput!) {
  processPayment(input: $input) {
    id
    status
    stripePaymentIntentId
    errorDetails {
      code
      message
      declinedCode
    }
    createdAt
  }
}

# Variáveis
{
  "input": {
    "invoiceId": "789",
    "paymentMethodId": "pm_card_visa"
  }
}
```

## Webhook Stripe

O serviço expõe um endpoint REST para receber eventos do Stripe:

```bash
POST /stripe/webhook
Content-Type: application/json
Stripe-Signature: t=timestamp,v1=signature

{
  "type": "payment_intent.succeeded",
  "data": {
    "object": {
      "id": "pi_123",
      "status": "succeeded",
      "amount": 9990
    }
  }
}
```

## Monitoramento

O serviço expõe métricas Prometheus em `/metrics` com:

### Métricas Stripe
- `stripe_request_latency_seconds`: Histograma de latência das requisições
  - Labels: operation (create_payment_intent, process_webhook)
- `stripe_errors_total`: Contador de erros nas requisições
  - Labels: operation, error_type

### Visualização no Grafana

1. Adicione o datasource Prometheus no Grafana
2. Importe o dashboard do diretório `grafana/dashboards/billing.json`
3. As métricas estarão disponíveis nos painéis:
   - Latência de Pagamentos
   - Taxa de Erro
   - Volume de Transações

## Testes

```bash
# Testes unitários
npm test

# Cobertura de testes
npm run test:cov

# Testes E2E
npm run test:e2e
```

## Segurança

- Todas as requisições requerem autenticação JWT
- RBAC implementado via decorators @Roles
- Secrets gerenciados via Vault
- Scanning de vulnerabilidades com Trivy
- Análise estática com CodeQL

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes. 