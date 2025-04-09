# Plataforma Fitness 360

## Monitoramento e Observabilidade

### Grafana
- URL: http://localhost:3006
- Usuário: admin
- Senha: fitness360admin
- Dashboard principal: Feedback Dashboard

### Prometheus
- URL: http://localhost:9091
- Métricas disponíveis:
  - feedback_total
  - feedback_avg_score
  - http_requests_total

### AlertManager
- URL: http://localhost:9094
- Alertas configurados:
  - HighErrorRate: Taxa de erros 500 > 10%
  - LowFeedbackScore: Média de feedback < 3.5
  - HighLoginFailureRate: Muitas falhas de login

## Testes

Para executar os testes:

```bash
# Testes unitários
pnpm test

# Cobertura de testes
pnpm test:cov

# Testes E2E
pnpm test:e2e
```

Cobertura atual: ~35%

## Banco de Dados

PostgreSQL está rodando na porta 5433

Credenciais:
- Usuário: fitness360
- Senha: fitness360pass
- Banco: fitness360db

## Serviços

- Auth Service: http://localhost:3001
- Members Service: http://localhost:3003
- Billing Service: http://localhost:3004
- Feedback Service: http://localhost:3005

Documentação Swagger disponível em /api em cada serviço. 