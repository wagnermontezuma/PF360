# Changelog

## [Sprint REST Core] - 2024-03-15

### Adicionado
- Implementação do sistema de autenticação com JWT
  - Rota POST /login funcional
  - Proteção de rotas com guard JWT
  - Armazenamento de token no frontend
  - Redirecionamento após login

- Criação de APIs REST
  - GET /members - Lista de membros
  - GET /dashboard-metrics - Métricas do dashboard
  - POST /feedback - Registro de feedbacks
  - Documentação Swagger em todos os serviços

- Frontend
  - Página de login com formulário funcional
  - Dashboard com dados mockados
  - Hook useAuth para gerenciamento de autenticação
  - Proteção de rotas no frontend

### Modificado
- Estrutura do projeto dividida em microserviços
  - auth-svc (3001)
  - members-svc (3003)
  - billing-svc (3004)
  - feedback-svc (3005)

### Documentação
- README.md atualizado com instruções de configuração
- API_REFERENCE.md criado com documentação das rotas
- Swagger UI disponível em /api em cada serviço

### Pendente
- Integração com banco de dados real
- Testes unitários e E2E
- Configuração do Kafka para eventos
- Métricas no Grafana 