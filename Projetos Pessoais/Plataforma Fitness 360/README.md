# Plataforma Fitness 360

> **Nota**: Este repositório é resultado da unificação dos repositórios `plataformafitness360` e `PF360`, consolidando todas as funcionalidades em uma única base de código otimizada e padronizada.

![Versão](https://img.shields.io/badge/versão-0.1.0-blue)
![Licença](https://img.shields.io/badge/licença-MIT-green)

A Plataforma Fitness 360 é uma solução completa para academias e profissionais de educação física gerenciarem treinos, nutrição e evolução de seus alunos, com experiências personalizadas tanto para profissionais quanto para alunos.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Requisitos](#requisitos)
- [Instalação](#instalação)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Uso](#uso)
- [API](#api)
- [Contribuição](#contribuição)
- [Licença](#licença)

## 🔭 Visão Geral

A Plataforma Fitness 360 foi projetada para conectar alunos e profissionais de fitness através de uma interface intuitiva e responsiva, permitindo o acompanhamento completo da jornada fitness. A plataforma é dividida em serviços especializados que trabalham em conjunto para fornecer uma experiência integrada.

## ✨ Funcionalidades

### Para Alunos
- Dashboard personalizado com métricas de progresso
- Histórico de treinos com filtros e detalhamento
- Acompanhamento de planos nutricionais
- Notificações em tempo real
- Agendamento de treinos e consultas

### Para Profissionais
- Gestão de alunos e turmas
- Criação de planos de treino personalizados
- Elaboração de dietas e recomendações nutricionais
- Análise de progresso e métricas
- Comunicação direta com alunos

## 🚀 Tecnologias

### Frontend
- React com TypeScript
- Next.js 14 para SSR e otimização
- TailwindCSS para estilização responsiva
- Context API e React Query para gerenciamento de estado

### Backend
- NestJS para APIs RESTful
- Prisma ORM para persistência de dados
- PostgreSQL como banco de dados principal
- Redis para cache e sessões
- JWT para autenticação

### DevOps
- Docker e Docker Compose
- GitHub Actions para CI/CD
- Kubernetes para orquestração em produção

## 🏗️ Arquitetura

A plataforma segue uma arquitetura de microserviços, com os seguintes componentes:

```
Fitness 360
│
├── Gateway (API Gateway)
│
├── Serviços Core
│   ├── auth-svc (Autenticação e Autorização)
│   ├── users-svc (Gestão de Usuários)
│   └── notifications-svc (Notificações e Alertas)
│
├── Serviços de Negócio
│   ├── training-svc (Gestão de Treinos)
│   ├── nutrition-svc (Planos Nutricionais)
│   ├── metrics-svc (Métricas e Analytics)
│   └── schedule-svc (Agendamentos)
│
└── Aplicações Frontend
    ├── app-aluno (Experiência do Aluno)
    └── app-profissional (Painel do Profissional)
```

## 📋 Requisitos

- Node.js 16.x ou superior
- Docker e Docker Compose
- PostgreSQL 14 ou superior
- Redis 6 ou superior

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/sua-organizacao/plataforma-fitness-360.git
cd plataforma-fitness-360
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

3. Inicie os containers com Docker Compose:
```bash
docker-compose up -d
```

4. Instale as dependências e execute as migrações:
```bash
# Instalar dependências em todos os serviços
npm run install:all

# Executar migrações do Prisma
npm run prisma:migrate
```

5. Inicie a aplicação em modo de desenvolvimento:
```bash
npm run dev
```

A aplicação estará disponível em:
- Frontend do Aluno: http://localhost:3000
- Frontend do Profissional: http://localhost:3001
- APIs: http://localhost:8000/api

## 📁 Estrutura do Projeto

```
.
├── backend/
│   ├── auth-svc/
│   ├── users-svc/
│   ├── training-svc/
│   ├── nutrition-svc/
│   ├── notifications-svc/
│   └── gateway/
│
├── frontend/
│   ├── app-aluno/
│   └── app-profissional/
│
├── shared/
│   ├── types/
│   └── utils/
│
├── scripts/
│   ├── setup.sh
│   └── deploy.sh
│
├── docker-compose.yml
├── package.json
├── README.md
└── CHANGELOG.md
```

## 🖥️ Uso

### Executando em Desenvolvimento

```bash
# Inicia todos os serviços em modo de desenvolvimento
npm run dev

# Inicia apenas o frontend do aluno
npm run dev:app-aluno

# Inicia apenas os serviços de backend
npm run dev:backend
```

### Executando Testes

```bash
# Executa todos os testes
npm run test

# Executa testes com cobertura
npm run test:coverage
```

### Builds de Produção

```bash
# Gera build de produção de todos os serviços
npm run build

# Inicia a aplicação em modo de produção
npm run start
```

## 📚 API

A documentação completa da API está disponível via Swagger UI em cada serviço:

- Auth Service: http://localhost:3001/api
- Users Service: http://localhost:3002/api
- Training Service: http://localhost:3003/api
- Nutrition Service: http://localhost:3004/api
- Notifications Service: http://localhost:3005/api

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

Desenvolvido com ❤️ pelo Time Fitness 360 