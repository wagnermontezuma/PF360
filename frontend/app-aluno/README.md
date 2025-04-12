# Fitness 360 - Frontend

Frontend da plataforma Fitness 360 desenvolvido com Next.js 14.

## Configuração do Ambiente

1. Instale as dependências:
```bash
pnpm install
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```

3. Inicie o servidor de desenvolvimento:
```bash
pnpm dev
```

O aplicativo estará disponível em `http://localhost:3002`.

## Fluxo de Login

1. Acesse a página de login em `/login`
2. Insira suas credenciais:
   - Email: aluno@exemplo.com
   - Senha: senha123
3. Após autenticação bem-sucedida, você será redirecionado para `/dashboard`

## Serviços Disponíveis

- **Auth Service**: `http://localhost:3001`
  - POST /login - Autenticação de usuários
  - GET /profile - Perfil do usuário autenticado

- **Members Service**: `http://localhost:3003`
  - GET /members - Lista de membros

- **Billing Service**: `http://localhost:3004`
  - GET /billing/dashboard-metrics - Métricas do dashboard

- **Feedback Service**: `http://localhost:3005`
  - POST /feedback - Envio de feedback

## Documentação

- Swagger UI disponível em `/api` em cada serviço
- Autenticação via Bearer Token JWT
- CORS configurado para `http://localhost:3002`

## Scripts Disponíveis

- `pnpm dev` - Inicia o servidor de desenvolvimento
- `pnpm build` - Gera build de produção
- `pnpm start` - Inicia o servidor de produção
- `pnpm lint` - Executa verificação de linting
- `pnpm test` - Executa testes unitários
