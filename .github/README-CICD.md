# CI/CD da Plataforma Fitness 360

Este documento descreve a configuração de Integração Contínua (CI) e Entrega Contínua (CD) da Plataforma Fitness 360.

## Visão Geral

A plataforma utiliza GitHub Actions para automação de build, testes, publicação de imagens Docker e deploy. O sistema está configurado para os seguintes ambientes:

- **Desenvolvimento**: Build e testes locais
- **Staging**: Ambiente de teste integrado
- **Produção**: Ambiente de produção com aprovação manual

## Workflows

### 1. CI Pipeline (`ci.yml`)

Executado em pushes para as branches `main` e `develop` e em pull requests.

**Funcionalidades:**
- Lint e testes para todos os serviços backend
- Lint e testes para o frontend
- Geração de clientes Prisma
- Verificação de tipos com TypeScript

### 2. Docker Build & Publish (`docker-publish.yml`)

Executado em pushes para a branch `develop` e em tags de versão.

**Funcionalidades:**
- Build e publicação de imagens Docker
- Tagging automático:
  - `latest`: última versão estável
  - `vX.Y.Z`: versões específicas
  - `develop-COMMIT_SHA`: versões de desenvolvimento
  - `dev`: tag para ambiente de staging

### 3. Deploy to Staging (`deploy-staging.yml`)

Executado após a conclusão bem-sucedida do workflow "Docker Build & Publish" ou em pushes diretos para `develop`.

**Funcionalidades:**
- Deploy automático para ambiente de staging
- Configuração de variáveis de ambiente seguras
- Notificações via Slack

### 4. Deploy to Production (`deploy-production.yml`)

Executado em tags de versão ou manualmente via interface do GitHub.

**Funcionalidades:**
- Deploy para produção com aprovação manual
- Backup automático antes da implantação
- Verificação de saúde após deploy
- Rollback automático em caso de falha
- Notificações via Slack e email

## Secrets Necessários

Os seguintes secrets devem ser configurados no repositório:

### AWS
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `STAGING_CONFIG_BUCKET`
- `PRODUCTION_CONFIG_BUCKET`
- `STAGING_INSTANCE_ID`
- `PRODUCTION_INSTANCE_ID`

### Ambiente de Staging
- `STAGING_FRONTEND_URL`
- `STAGING_AUTH_DB_URL`
- `STAGING_MEMBERS_DB_URL`
- `STAGING_BILLING_DB_URL`
- `STAGING_FEEDBACK_DB_URL`
- `STAGING_JWT_SECRET`
- `STAGING_REFRESH_TOKEN_SECRET`
- `STAGING_AUTH_API_URL`
- `STAGING_MEMBERS_API_URL`
- `STAGING_BILLING_API_URL`
- `STAGING_FEEDBACK_API_URL`
- `STAGING_NOTIFICATIONS_API_URL`

### Ambiente de Produção
- `PRODUCTION_FRONTEND_URL`
- `PRODUCTION_AUTH_DB_URL`
- `PRODUCTION_MEMBERS_DB_URL`
- `PRODUCTION_BILLING_DB_URL`
- `PRODUCTION_FEEDBACK_DB_URL`
- `PRODUCTION_JWT_SECRET`
- `PRODUCTION_REFRESH_TOKEN_SECRET`
- `PRODUCTION_AUTH_API_URL`
- `PRODUCTION_MEMBERS_API_URL`
- `PRODUCTION_BILLING_API_URL`
- `PRODUCTION_FEEDBACK_API_URL`
- `PRODUCTION_NOTIFICATIONS_API_URL`
- `PRODUCTION_HEALTH_CHECK_URL`

### Notificações
- `SLACK_WEBHOOK_URL`

## Scripts de Automação

### Backup Antes do Deploy
O script `scripts/backup-before-deploy.sh` realiza backup de:
- Dumps dos bancos de dados
- Arquivos de configuração
- Docker Compose e variáveis de ambiente
- Upload automático para S3

### Verificação de Saúde
O script `scripts/healthcheck.sh` verifica:
- Status de todos os serviços
- Conexão com bancos de dados
- Disponibilidade do frontend
- Retorna status JSON para integração com monitoramento

## Usando o CI/CD

### Desenvolvimento

1. Crie branches a partir de `develop`
2. Faça commits seguindo o padrão [Conventional Commits](https://www.conventionalcommits.org/)
3. Envie Pull Requests para `develop`
4. Os testes serão executados automaticamente

### Release

1. Faça merge de `develop` para `main`
2. Crie uma tag de versão: `git tag v1.0.0 && git push --tags`
3. O processo de release será iniciado automaticamente
4. Aprove o deploy para produção pela interface do GitHub

## Monitorando Deploys

Todos os deploys podem ser monitorados:
- Na aba "Actions" do GitHub
- Via notificações no Slack
- Através da API de status (acessando `/api/health` em cada serviço) 