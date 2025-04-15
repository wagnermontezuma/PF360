# Documentação do Ambiente Beta

## Visão Geral

O ambiente beta da Plataforma Fitness 360 permite o lançamento gradual de novas funcionalidades para grupos específicos de usuários. Este documento descreve os principais componentes e como utilizá-los.

## Componentes Principais

### Scripts

- **setup-beta-env.sh**: Configura o ambiente beta (bancos de dados, variáveis de ambiente, etc.)
- **launch-beta-group.sh**: Lança features beta para grupos específicos de usuários
- **beta-healthcheck.sh**: Verifica a saúde do ambiente beta

### Frontend

- **Seção Beta para Alunos**: Interface dedicada para usuários do programa beta
- **Painel de Administração**: Interface para gerenciar feature flags e analisar métricas

### Backend

- **API de Feature Flags**: Endpoints para gerenciar recursos beta
- **Sistema de Monitoramento**: Métricas específicas para o ambiente beta

## Comandos Make

\`\`\`
make beta-env              # Configura o ambiente beta
make beta-launch grupo=X   # Lança recursos beta para um grupo específico
make beta-healthcheck      # Verifica a saúde do ambiente beta
\`\`\`

## Grupos Beta

- **Grupo A**: Usuários com foco em treino e monitoramento
- **Grupo B**: Usuários com foco em nutrição e dieta
- **Grupo C**: Usuários experientes com plataformas fitness
- **Grupo D**: Usuários iniciantes em tecnologia fitness
