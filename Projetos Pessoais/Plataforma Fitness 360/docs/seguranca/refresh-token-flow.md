# Fluxo de Refresh Token entre Serviços

**Autor**: Equipe de Segurança - Fitness 360  
**Versão**: 1.0  
**Data**: 2023-11-15  
**Status**: Aprovado

## Contexto

Em uma arquitetura de microsserviços, a autenticação e autorização entre os diferentes serviços é essencial para manter a segurança do sistema. No Fitness 360, utilizamos tokens JWT (JSON Web Tokens) para autenticação, complementados por um sistema de refresh tokens para proporcionar uma experiência fluida ao usuário sem comprometer a segurança.

## Visão Geral

O fluxo de refresh token empregado na plataforma Fitness 360 segue as melhores práticas de segurança, utilizando:

1. **Access Tokens**: Tokens JWT de curta duração para autorização.
2. **Refresh Tokens**: Tokens de longa duração armazenados de forma segura para obtenção de novos access tokens.
3. **Revogação de Tokens**: Mecanismo para invalidar tokens comprometidos.
4. **Rotação de Tokens**: Sistema que gera um novo refresh token a cada uso.

## Arquitetura de Autenticação

```
┌────────────┐      ┌────────────┐      ┌────────────┐
│  Frontend  │◄────►│  API       │◄────►│  Serviço   │
│  App       │      │  Gateway   │      │  de Auth   │
└────────────┘      └────────────┘      └────────────┘
                           ▲                   ▲
                           │                   │
                           ▼                   │
                    ┌────────────┐            │
                    │  Serviços  │◄───────────┘
                    │  da API    │
                    └────────────┘
```

## Fluxo de Refresh Token

### 1. Autenticação Inicial

1. O usuário fornece credenciais (email/senha) através do Frontend.
2. O Frontend envia essas credenciais para o API Gateway.
3. O API Gateway encaminha a solicitação para o Serviço de Autenticação.
4. O Serviço de Autenticação valida as credenciais e:
   - Gera um access token de curta duração (15 minutos).
   - Gera um refresh token de longa duração (7 dias).
   - Armazena o refresh token no banco de dados com hash seguro.
   - Retorna ambos os tokens para o cliente.

### 2. Comunicação Autenticada

1. O Frontend inclui o access token no cabeçalho `Authorization` em todas as requisições.
2. O API Gateway valida o token antes de encaminhar requisições aos serviços internos.
3. Os serviços internos também validam o token antes de processar as requisições.

### 3. Renovação do Access Token

1. Quando o access token expira, o Frontend detecta o erro 401 (Unauthorized).
2. O Frontend envia uma solicitação de refresh com o refresh token para o endpoint `/auth/refresh-token`.
3. O Serviço de Autenticação:
   - Valida o refresh token contra o armazenado no banco de dados.
   - Verifica se o token não foi revogado ou expirado.
   - Gera um novo access token.
   - Gera um novo refresh token (rotação).
   - Invalida o refresh token antigo.
   - Retorna os novos tokens.

### 4. Invalidação de Tokens

1. Quando um usuário faz logout:
   - O Frontend envia o refresh token para o endpoint `/auth/logout`.
   - O Serviço de Autenticação marca o refresh token como revogado no banco de dados.
   - O Frontend descarta os tokens.

2. Mecanismo de segurança adicional:
   - Cada refresh token está vinculado ao dispositivo/IP de origem.
   - Tentativas de uso de refresh token de um dispositivo/IP diferente são registradas e invalidam o token.

## Implementação Técnica

### Estrutura dos Tokens

**Access Token**:
```json
{
  "sub": "user_id",
  "email": "usuario@exemplo.com",
  "roles": ["STUDENT", "FREE"],
  "iat": 1636976211,
  "exp": 1636977111,
  "jti": "unique_token_id"
}
```

**Refresh Token**: Gerado usando uma função criptográfica segura, armazenado como hash no banco.

### Banco de Dados de Refresh Tokens

Tabela `refresh_tokens` no banco de dados Auth:

```sql
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  token_hash VARCHAR(100) NOT NULL,
  device_info TEXT,
  ip_address VARCHAR(45),
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  revoked BOOLEAN DEFAULT FALSE,
  replaced_by UUID,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## Validação entre Serviços

### Serviço de Autenticação (auth-svc)

- Responsável pela geração, validação e renovação de tokens.
- Mantém um registro de todos os refresh tokens válidos.
- Expõe endpoint para verificação de tokens a outros serviços.

### API Gateway

- Valida tokens para todas as requisições.
- Rejeita tokens expirados ou inválidos.
- Adiciona informações do usuário autenticado ao cabeçalho da requisição antes de encaminhar para serviços internos.

### Microsserviços

- Aceitam requisições do API Gateway com tokens já validados.
- Realizam validação local do token para verificação adicional.
- Para chamadas entre serviços, utilizam tokens de serviço (client credentials) com escopo limitado.

## Segurança e Considerações

1. **Armazenamento Seguro**: Refresh tokens são armazenados com hash no banco de dados.
2. **HTTPS em Todas as Comunicações**: Todos os tokens são transmitidos exclusivamente por HTTPS.
3. **Tokens JWT Assinados**: Usamos o algoritmo HS256 para assinatura dos tokens.
4. **Chaves de Assinatura Rotativas**: As chaves de assinatura são rotacionadas periodicamente.
5. **Validação de Origem**: Os tokens estão vinculados à origem da requisição.
6. **Logs de Auditoria**: Todas as operações de autenticação são registradas para auditoria.
7. **Limite de Tentativas**: Há um limite para tentativas de uso de refresh token inválido.

## Testes Automatizados

A validação do fluxo de refresh token é verificada através de:

1. **Testes Unitários**: Verificam a lógica de validação e geração de tokens.
2. **Testes de Integração**: Testam o fluxo completo entre serviços.
3. **Testes End-to-End**: Simulam o fluxo do usuário real.

## Considerações Futuras

1. **Implementação OAuth 2.1**: Plano para migração para OAuth 2.1 no futuro.
2. **Suporte a PKCE**: Para melhorar a segurança em aplicativos móveis.
3. **Tokens Setoriais**: Implementação de tokens com escopos mais granulares para diferentes partes da aplicação.

---

## Checklist de Segurança

- [x] Refresh tokens são armazenados com hash
- [x] Tokens têm tempo de expiração adequado
- [x] Implementada a rotação de refresh tokens
- [x] CSRF protegido pela implementação de tokens
- [x] Logs de auditoria para operações de refresh
- [x] Verificação de dispositivo/IP
- [x] Revogação de tokens em logout
- [x] Limites de tentativas implementados
- [x] Comunicação exclusivamente por HTTPS
- [x] Testes automatizados para o fluxo 