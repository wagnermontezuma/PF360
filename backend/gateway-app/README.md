# Gateway App

API Gateway para a plataforma Fitness 360, responsável por unificar e gerenciar o acesso aos microserviços.

## Funcionalidades

- Unificação das APIs GraphQL dos microserviços
- Gerenciamento de CORS
- Playground GraphQL para testes
- Roteamento inteligente para os serviços

## Serviços Integrados

- Members Service (http://members-svc:3001/graphql)
- Billing Service (http://billing-svc:3002/graphql)

## Requisitos

- Node.js 18+

## Configuração

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Inicie o serviço:
```bash
npm run start:dev
```

## Endpoints

- GraphQL Playground: http://localhost:3000/graphql

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