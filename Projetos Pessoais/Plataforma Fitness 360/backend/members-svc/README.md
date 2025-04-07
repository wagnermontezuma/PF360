# Members Service

Microserviço responsável pela gestão de membros e contratos da Plataforma Fitness 360.

## 🚀 Funcionalidades

- Cadastro e gestão de membros
- Gestão de contratos e planos
- Integração com sistema de pagamentos
- Eventos Kafka para integrações

## 🛠️ Tecnologias

- NestJS
- GraphQL (Federation)
- TypeORM
- PostgreSQL
- Kafka
- Jest

## 📦 Instalação

```bash
# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cp .env.example .env

# Executar migrations
pnpm migration:run

# Iniciar em desenvolvimento
pnpm start:dev
```

## 🧪 Testes

```bash
# Testes unitários
pnpm test

# Testes e2e
pnpm test:e2e

# Coverage
pnpm test:cov
```

## 📊 Endpoints GraphQL

### Queries
- `members`: Lista todos os membros
- `member(id: ID!)`: Busca membro por ID
- `memberContracts(memberId: ID!)`: Lista contratos do membro

### Mutations
- `createMember(input: CreateMemberInput!)`: Cria novo membro
- `updateMember(id: ID!, input: CreateMemberInput!)`: Atualiza membro
- `createContract(input: CreateContractInput!)`: Cria novo contrato
- `cancelContract(id: ID!)`: Cancela contrato

## 🔄 Eventos Kafka

- `member.created`: Novo membro criado
- `member.updated`: Membro atualizado
- `contract.created`: Novo contrato criado
- `contract.cancelled`: Contrato cancelado

## 🔐 Segurança

- Autenticação via JWT
- RBAC por tipo de usuário
- Validação de tenant
- Rate limiting

## 📝 Convenções

- Commits seguem [Conventional Commits](https://www.conventionalcommits.org/)
- Código segue [ESLint Airbnb](https://github.com/airbnb/javascript)
- Documentação em português BR 