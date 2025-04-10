# Changelog - Plataforma Fitness 360

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [1.1.0] - 2024-04-10

### Added
- Unificação dos repositórios plataformafitness360 e PF360
- Migração do histórico de commits relevantes
- Atualização da estrutura de diretórios
- Melhorias na documentação

### Changed
- Consolidação da arquitetura do projeto
- Otimização da estrutura de monorepo
- Padronização de nomenclatura em todos os módulos

## [1.0.0-beta.1] - 2025-04-09

### Alterações

#### Frontend
- Removida dependência do ChakraUI da aplicação
- Substituído ChakraProvider no _app.tsx
- Removido arquivo de tema do ChakraUI
- Corrigida configuração em next.config.ts
- Implementadas páginas usando o Pages Router do Next.js
- Resolvido erro 500 de renderização na página de nutrição
- Mantidos estilos com Tailwind CSS
- Otimizada a estrutura de componentes

### Correções de Bugs
- Corrigido erro "Cannot read properties of undefined (reading '_config')" no ChakraProvider
- Resolvido problema de rota 404 em /dashboard/nutrition
- Corrigido conflito entre App Router e Pages Router

## [0.1.0] - 2023-11-15

### Adicionado

#### Geral
- Estrutura inicial do projeto monolítico
- Configuração de ambiente de desenvolvimento com Docker
- Setup inicial de CI/CD com GitHub Actions

#### Backend
- Serviço de autenticação com JWT e refresh tokens
- Serviço de notificações (e-mail, push e em tempo real via WebSockets)
- Serviço de treinos com gerenciamento de exercícios e rotinas
- Serviço de nutrição com planos alimentares e acompanhamento
- API RESTful documentada com Swagger
- Integração com Prisma ORM para acesso ao banco de dados

#### Frontend
- Aplicação mobile-first responsiva para alunos
- Tela de login e autenticação
- Dashboard com métricas e resumo de atividades
- Página de perfil do usuário com edição de informações
- Histórico de treinos com filtros e detalhamento
- Layout padronizado com navegação intuitiva

#### Segurança
- Autenticação JWT com rotação de refresh tokens
- Proteção contra ataques CSRF
- Rate limiting nas APIs
- Validação e sanitização de dados de entrada
- Rollback automático em caso de falhas no deploy

#### DevOps
- Pipeline de CI/CD completo (testes, build, deploy)
- Verificação de saúde automática pós-deploy
- Sistema de rollback automático em caso de falhas
- Backup automático pré-deploy
- Documentação técnica e de segurança

### Modificado
- Transição de MVP para versão beta com funcionalidades completas

### Corrigido
- Otimização de desempenho no carregamento de histórico de treinos
- Correção na exibição de gráficos em dispositivos móveis
- Melhorias na validação de campos do formulário de perfil

## [0.0.1] - 2023-10-15

### Adicionado
- Configuração inicial do projeto
- Prova de conceito para serviços de autenticação e treinos
- Protótipo de interface do aluno 