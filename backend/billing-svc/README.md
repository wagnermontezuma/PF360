# Billing Service

Serviço responsável pelo gerenciamento de cobranças e pagamentos da plataforma Fitness 360.

## Funcionalidades

- Geração de faturas
- Processamento de pagamentos via Stripe
- Histórico de pagamentos
- Integração com Kafka para eventos de pagamento
- Suporte a múltiplos métodos de pagamento (Cartão de Crédito, Débito, PIX, Boleto)

## Requisitos

- Node.js 18+
- PostgreSQL
- Kafka
- Conta Stripe

## Configuração

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```
Edite o arquivo `.env` com suas configurações

4. Execute as migrações:
```bash
npm run typeorm migration:run
```

5. Inicie o serviço:
```bash
npm run start:dev
```

## Endpoints GraphQL

O serviço expõe uma API GraphQL em `http://localhost:3002/graphql` com as seguintes operações:

- Mutations:
  - createInvoice
  - processPayment
  - cancelInvoice

- Queries:
  - getMemberPaymentHistory

## Eventos Kafka

O serviço emite e consome os seguintes eventos:

- Emitidos:
  - invoice.created
  - payment.success
  - payment.failure
  - invoice.cancelled

## Testes

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Docker

Para executar o serviço via Docker:

```bash
docker-compose up --build
```

## Licença

MIT 