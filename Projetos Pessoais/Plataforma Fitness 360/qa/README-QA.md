# Testes do Módulo de Billing

Este documento descreve como executar e monitorar os testes do módulo de billing.

## Postman Collection

### Importação
1. Abra o Postman
2. Clique em "Import" > "File" > Selecione `qa/postman/Billing-MVP.postman_collection.json`
3. Importe também o ambiente em `qa/postman/billing.environment.json`

### Variáveis de Ambiente
Configure as seguintes variáveis:
- `gateway_url`: URL do gateway GraphQL (ex: https://api.staging.fit360.com)
- `admin_password`: Senha do usuário admin
- `tenant_id`: ID do tenant para testes
- `stripe_test_card_id`: ID do cartão de teste do Stripe

## Testes de Carga (k6)

### Execução Local
```bash
# Instalar k6
brew install k6  # macOS
sudo apt install k6  # Ubuntu

# Executar teste
k6 run \
  -e GATEWAY_URL=https://api.staging.fit360.com \
  -e JWT_TOKEN=seu_token_jwt \
  -e TENANT_ID=seu_tenant_id \
  qa/k6/billing-load.js
```

### GitHub Actions
O workflow `.github/workflows/k6.yaml` executa automaticamente os testes de carga:
- Em cada PR para main
- Diariamente às 03:00 UTC
- Manualmente via workflow_dispatch

## Testes E2E

### Pré-requisitos
- Docker e Docker Compose instalados
- Node.js 18+
- pnpm instalado globalmente

### Execução
```bash
# Na raiz do projeto
cd backend/billing-svc

# Instalar dependências
pnpm install

# Iniciar containers
docker-compose up -d stripe-mock postgres redis kafka

# Executar testes
pnpm test:e2e
```

## Métricas no Grafana

O dashboard "Billing" está disponível em:
https://grafana.staging.fit360.com/d/billing

Principais métricas:
- `billing_invoice_total`: Total de faturas por status
- `stripe_charge_latency_seconds`: Latência das requisições ao Stripe
- `payment_success_rate`: Taxa de sucesso dos pagamentos

## Checklist de Aceitação

- [ ] Todos testes Postman passam (≥ 95% assertions)
- [ ] k6 p95 latency < 400ms, erros < 1%
- [ ] Cobertura e2e ≥ 85%
- [ ] ZAP scan sem vulnerabilidades de alta severidade
- [ ] Métricas billing_invoice_total e stripe_charge_latency_seconds aparecem em Grafana
- [ ] No topic Kafka payment.success, mensagem contém invoiceId, amount, memberId 