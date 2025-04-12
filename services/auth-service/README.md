# Serviço de Autenticação - Fitness 360

Este é o serviço de autenticação da plataforma Fitness 360, responsável por gerenciar usuários, autenticação e autorização.

## Tecnologias

- NestJS
- Prisma
- PostgreSQL
- JWT
- Passport

## Configuração

1. Clone o repositório
2. Instale as dependências:
```bash
pnpm install
```

3. Copie o arquivo `.env.example` para `.env` e configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Execute as migrações do banco de dados:
```bash
pnpm prisma:migrate
```

5. Gere o cliente Prisma:
```bash
pnpm prisma:generate
```

## Desenvolvimento

Para iniciar o servidor em modo de desenvolvimento:

```bash
pnpm start:dev
```

## Testes

Para executar os testes:

```bash
# Testes unitários
pnpm test

# Testes e2e
pnpm test:e2e

# Cobertura de testes
pnpm test:cov
```

## API

### Endpoints

- `POST /auth/signup` - Registrar novo usuário
- `POST /auth/signin` - Login
- `POST /auth/refresh` - Renovar token de acesso

### Exemplos de Requisições

#### Registro
```bash
curl -X POST http://localhost:3001/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@exemplo.com",
    "password": "senha123",
    "name": "Usuário Exemplo"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3001/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@exemplo.com",
    "password": "senha123"
  }'
```

#### Renovar Token
```bash
curl -X POST http://localhost:3001/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "seu_refresh_token"
  }'
```

## Licença

Este projeto é privado e de propriedade da Fitness 360.
