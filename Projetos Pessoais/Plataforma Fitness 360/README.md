# Plataforma Fitness 360 🏋️‍♂️

Sistema SaaS multitenant para gestão completa de academias e centros esportivos.

## 🎯 Visão

Transformar a gestão de academias através de uma plataforma integrada que oferece:
- Gestão de membros e contratos
- Agendamento e check-in
- Pagamentos e cobranças recorrentes
- Analytics e BI
- Controle de acesso
- App mobile para alunos

## 🚀 Stack Tecnológica

### Frontend
- Next.js (Dashboard Web)
- React Native/Flutter (App Mobile)
- TailwindCSS
- GraphQL/Apollo Client

### Backend
- NestJS/Go (Microserviços)
- GraphQL API Gateway
- PostgreSQL (Multi-tenant)
- Redis Cache
- Kafka Event Bus
- DuckDB + Apache Iceberg

### DevOps
- Kubernetes + Helm
- ArgoCD
- GitHub Actions
- Grafana + Prometheus
- Docker

## 🔒 Segurança

- TLS 1.3
- OAuth 2.1 + MFA
- AES-256 para dados em repouso
- Secret scanning
- SAST/DAST pipeline
- Política de segurança: [SECURITY.md](./SECURITY.md)

## 🤝 Guia de Contribuição

### Fluxo Git
- Trunk-based development (main)
- Feature branches curtos
- Pull Request obrigatório
- Review por 2 aprovadores

### Commits
Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: adiciona autenticação MFA
fix: corrige validação de CPF
docs: atualiza README
test: adiciona testes de integração
refactor: otimiza queries
ci: configura GitHub Actions
```

### Qualidade
- ESLint (Airbnb) + Prettier
- Jest + Supertest
- SonarQube
- Husky pre-commit hooks

## 📦 Estrutura do Monorepo

```
.
├── backend/
│   ├── core/         # Serviço principal
│   ├── payments/     # Processamento de pagamentos
│   └── scheduler/    # Agendamentos
├── frontend/
│   └── app-aluno/    # Aplicativo mobile
├── infra/
│   └── helm/         # Charts Kubernetes
└── .github/
    └── workflows/    # CI/CD pipelines
```

## 🚀 Começando

1. Clone o repositório
2. Instale as dependências: `pnpm install`
3. Configure as variáveis de ambiente
4. Execute os serviços: `docker-compose up`
5. Acesse: `http://localhost:3000`

## 📝 Licença

MIT © Plataforma Fitness 360 