# Relatório Técnico - Plataforma Fitness 360

**Data**: 01/12/2023
**Versão**: 1.0
**Status**: Produção

## Visão Geral
A Plataforma Fitness 360 é um sistema abrangente desenvolvido para conectar alunos e profissionais de fitness, facilitando o acompanhamento de treinos, nutrição e evolução física. Este relatório documenta a arquitetura, tecnologias e integrações implementadas no projeto.

## Arquitetura
O projeto segue uma arquitetura de microserviços, permitindo desenvolvimento independente, escalabilidade e manutenção simplificada de cada componente do sistema.

### Componentes Principais:
- **Frontends**: Aplicações web desenvolvidas com Next.js e TailwindCSS
- **Backend Services**: Serviços independentes construídos com NestJS
- **Bancos de Dados**: PostgreSQL para persistência de dados
- **Message Broker**: Apache Kafka para comunicação assíncrona
- **Cache**: Redis para armazenamento em cache

### Diagrama de Arquitetura
```
+-------------------+      +-------------------+
|                   |      |                   |
|  Frontend Aluno   |      | Frontend Personal |
|                   |      |                   |
+--------+----------+      +---------+---------+
         |                           |
         v                           v
+-------------------+      +-------------------+
|                   |      |                   |
|   API Gateway     |<---->|  Auth Service     |
|                   |      |                   |
+---+-----+----+----+      +-------------------+
    |     |    |
    v     v    v
+-------+ +--------+ +------------+
|       | |        | |            |
|Treinos| |Nutrição| |Notificações|
|       | |        | |            |
+-------+ +--------+ +------------+
    |        |             |
    v        v             v
+-----------------------------------+
|                                   |
|             PostgreSQL            |
|                                   |
+-----------------------------------+
```

## Backend Services

### Auth Service
- **Tecnologias**: NestJS, Prisma, JWT
- **Funcionalidades**: 
  - Autenticação e autorização de usuários
  - Gestão de tokens JWT e refresh tokens
  - Integração com serviços de terceiros para login social

### Members Service
- **Tecnologias**: NestJS, Prisma
- **Funcionalidades**:
  - Gerenciamento de perfis de usuários
  - Controle de assinaturas e pagamentos
  - Gestão de relacionamentos entre alunos e profissionais

### Workouts Service
- **Tecnologias**: NestJS, Prisma
- **Funcionalidades**:
  - Criação e gestão de programas de treinamento
  - Acompanhamento de progresso de exercícios
  - Agendamento de treinos

### Nutrition Service
- **Tecnologias**: NestJS, Prisma
- **Funcionalidades**:
  - Planos alimentares personalizados
  - Registro de refeições e nutrientes
  - Acompanhamento de métricas nutricionais

### Notifications Service
- **Tecnologias**: NestJS, WebSockets, Nodemailer
- **Funcionalidades**:
  - Notificações em tempo real
  - Envio de e-mails transacionais
  - Push notifications para dispositivos móveis

## Frontends

### App Aluno
- **Tecnologias**: Next.js, React, TailwindCSS, TypeScript
- **Funcionalidades**:
  - Dashboard personalizado com métricas de progresso
  - Visualização e registro de treinos
  - Acompanhamento de plano nutricional
  - Comunicação com profissionais

### App Profissional
- **Tecnologias**: Next.js, React, TailwindCSS, TypeScript
- **Funcionalidades**:
  - Gestão de alunos
  - Criação de planos de treino e nutrição
  - Acompanhamento de métricas de desempenho
  - Comunicação com alunos

## Integrações

### Sistema de Autenticação
- Implementação de autenticação segura usando JWT
- Integração com provedores OAuth para login social
- Mecanismo de refresh token para experiência contínua

### APIs e Comunicação
- APIs RESTful para comunicação síncrona entre serviços e frontends
- Apache Kafka para comunicação assíncrona entre microserviços
- WebSockets para funcionalidades em tempo real

### Processamento de Pagamentos
- Integração com gateway de pagamentos para gestão de assinaturas
- Sistema de faturamento automatizado
- Relatórios financeiros para administradores e profissionais

## DevOps e Infraestrutura

### CI/CD
- Pipelines automatizadas através do GitHub Actions
- Testes automatizados para garantir qualidade do código
- Deployment contínuo para ambientes de desenvolvimento, homologação e produção

### Containerização
- Docker para encapsulamento de serviços
- Docker Compose para desenvolvimento local
- Kubernetes para orquestração em produção

### Monitoramento
- Prometheus para coleta de métricas
- Grafana para visualização de dashboards
- ELK Stack (Elasticsearch, Logstash, Kibana) para análise de logs

## Segurança

### Proteção de Dados
- Criptografia de dados sensíveis
- Conformidade com LGPD (Lei Geral de Proteção de Dados)
- Auditorias de segurança periódicas

### Controle de Acesso
- Implementação de RBAC (Role-Based Access Control)
- Proteção contra ataques comuns (CSRF, XSS, SQL Injection)
- Rate limiting para prevenção de ataques de força bruta

## Escalabilidade

### Estratégias Implementadas
- Arquitetura horizontal escalável
- Balanceamento de carga
- Caching estratégico com Redis
- Otimização de consultas ao banco de dados

### Performance
- Lazy loading e code splitting no frontend
- Otimização de imagens e assets
- CDN para distribuição de conteúdo estático

## Melhorias Futuras

### Novas Funcionalidades
- Integração com dispositivos wearables
- Sistema de gamificação para engajamento
- Análise avançada de dados com machine learning

### Expansões Planejadas
- Desenvolvimento de aplicativos nativos (iOS/Android)
- Integração com nutricionistas e outros profissionais de saúde
- Marketplace para planos e produtos fitness

## Conclusão
A Plataforma Fitness 360 representa uma solução tecnológica robusta e escalável para o mercado fitness, conectando alunos e profissionais através de uma experiência digital integrada. A arquitetura de microserviços adotada permite flexibilidade para crescimento e adaptações futuras, enquanto as tecnologias modernas garantem performance e usabilidade de alta qualidade.

---

## Guia de Ambiente de Desenvolvimento

### Pré-requisitos
- Docker (20.10+)
- Docker Compose (2.0+)
- Pelo menos 8GB de RAM disponível
- 20GB de espaço em disco

### Configuração do Ambiente
Foram criados scripts para facilitar a gestão do ambiente de desenvolvimento:

1. **Iniciar o ambiente completo**:
   ```bash
   ./scripts/iniciar-ambiente.sh
   ```
   Este script inicia:
   - Todos os bancos de dados PostgreSQL
   - Kafka e Zookeeper
   - Redis para cache
   - Todos os serviços de backend
   - API Gateway
   - Frontends (aluno e profissional)

2. **Parar o ambiente**:
   ```bash
   ./scripts/parar-ambiente.sh
   ```

3. **Monitorar logs**:
   ```bash
   # Ver logs de um serviço específico
   ./scripts/monitorar-logs.sh frontend

   # Ver logs de todos os serviços
   ./scripts/monitorar-logs.sh all
   ```

### Endpoints Disponíveis
Após iniciar o ambiente, os seguintes endpoints estarão disponíveis:

- **Frontend Aluno**: http://localhost:3006
- **Frontend Profissional**: http://localhost:3007
- **API Gateway**: http://localhost:3000
- **Serviço de Autenticação**: http://localhost:3001
- **Serviço de Membros**: http://localhost:3003
- **Serviço de Faturamento**: http://localhost:3004
- **Serviço de Feedback**: http://localhost:3005
- **Serviço de Treinos**: http://localhost:3007
- **Serviço de Nutrição**: http://localhost:3008
- **Serviço de Notificações**: http://localhost:3009
- **Kafka UI**: http://localhost:8080

### Usuários para Teste
Para facilitar os testes, os seguintes usuários são criados automaticamente:

1. **Aluno**:
   - Email: aluno@fitness360.com
   - Senha: senha123

2. **Profissional**:
   - Email: personal@fitness360.com
   - Senha: senha123

### Resolução de Problemas Comuns

1. **Docker não está em execução**:
   Certifique-se de que o Docker está em execução antes de iniciar os scripts.

2. **Portas em uso**:
   Verifique se não há outros serviços usando as mesmas portas.

3. **Falha na comunicação entre serviços**:
   Verifique os logs para identificar erros específicos:
   ```bash
   ./scripts/monitorar-logs.sh [serviço]
   ```

4. **Reiniciar um serviço específico**:
   ```bash
   docker-compose -f docker-compose.dev.yml restart [serviço]
   ```

5. **Visualizar status dos serviços**:
   ```bash
   docker-compose -f docker-compose.dev.yml ps
   ```

*Relatório elaborado pela Equipe de Desenvolvimento Fitness 360* 