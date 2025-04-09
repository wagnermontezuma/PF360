# Feedback Service - Plataforma Fitness 360

Serviço responsável pelo gerenciamento de feedbacks dos alunos na Plataforma Fitness 360.

## 🚀 Tecnologias

- NestJS 11
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Swagger Documentation
- Docker

## 🛠️ Configuração do Ambiente

1. Clone o repositório
2. Instale as dependências:
```bash
pnpm install
```

3. Copie o arquivo .env.example para .env e configure as variáveis:
```bash
cp .env.example .env
```

4. Execute as migrações do Prisma:
```bash
pnpm prisma migrate deploy
```

5. Inicie o servidor de desenvolvimento:
```bash
pnpm dev
```

## 🐳 Docker

Build da imagem:
```bash
pnpm docker:build
```

Executar o container:
```bash
pnpm docker:run
```

## 📚 Documentação da API

A documentação Swagger está disponível em:
```
http://localhost:3005/api
```

## 🔒 Autenticação

O serviço utiliza JWT para autenticação. Todas as rotas (exceto /api) requerem um token válido no header:
```
Authorization: Bearer <seu-token>
```

## 📝 Endpoints

### GET /feedback
Lista todos os feedbacks ordenados por data

### GET /feedback?userId={uuid}
Filtra feedbacks por ID do usuário

### POST /feedback
Cria novo feedback
```json
{
  "userId": "uuid",
  "title": "Ótimo treino",
  "content": "O treino foi muito bem estruturado",
  "category": "treino"
}
```

### PUT /feedback/:id
Atualiza um feedback existente

### DELETE /feedback/:id
Remove um feedback

## 🧪 Scripts Disponíveis

- `pnpm dev`: Inicia o servidor em modo desenvolvimento
- `pnpm build`: Compila o projeto
- `pnpm start:prod`: Inicia o servidor em modo produção
- `pnpm test`: Executa os testes
- `pnpm lint`: Executa o linter
- `pnpm prisma:studio`: Abre o Prisma Studio
- `pnpm docker:build`: Constrói a imagem Docker
- `pnpm docker:run`: Executa o container Docker

## 📊 Respostas da API

### Sucesso
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "title": "Ótimo treino",
    "content": "O treino foi muito bem estruturado",
    "category": "treino",
    "createdAt": "2024-04-08T15:30:00.000Z"
  },
  "message": "Operação realizada com sucesso"
}
```

### Erro
```json
{
  "status": "error",
  "statusCode": 422,
  "message": "Erro de validação",
  "timestamp": "2024-04-08T15:44:20.000Z",
  "path": "/feedback"
}
```

## 🔍 Observabilidade

O serviço expõe métricas para Prometheus em:
```
http://localhost:9100/metrics
``` 