# 📚 Referência da API

## 🔐 Autenticação

Todas as rotas privadas requerem autenticação via Bearer Token JWT.

```http
Authorization: Bearer <seu_token>
```

## 🎯 Endpoints

### 👤 Usuários

#### Criar Usuário
```http
POST /api/users
Content-Type: application/json

{
  "name": "string",
  "email": "string",
  "password": "string",
  "phone": "string"
}
```

#### Atualizar Usuário
```http
PATCH /api/users/:id
Content-Type: application/json

{
  "name?: "string",
  "email?: "string",
  "phone?: "string"
}
```

### 🏋️‍♂️ Treinos

#### Listar Treinos
```http
GET /api/workouts
```

#### Criar Treino
```http
POST /api/workouts
Content-Type: application/json

{
  "name": "string",
  "description": "string",
  "exercises": [
    {
      "id": "string",
      "sets": number,
      "reps": number
    }
  ]
}
```

### 📊 Métricas

#### Métricas do Aluno
```http
GET /api/metrics/student/:id
```

#### Métricas de Equipamento
```http
GET /api/metrics/equipment/:id
```

### 💰 Pagamentos

#### Criar Assinatura
```http
POST /api/subscriptions
Content-Type: application/json

{
  "planId": "string",
  "paymentMethod": "string",
  "studentId": "string"
}
```

#### Listar Transações
```http
GET /api/transactions
```

## 📱 Integração Wearables

### Coros

#### Autorização
```http
GET /api/wearables/coros/authorize
```

#### Webhook
```http
POST /api/wearables/coros/webhook
Content-Type: application/json

{
  "type": "string",
  "data": object
}
```

## ⚡ Respostas

### Sucesso
```json
{
  "status": "success",
  "data": {},
  "message": "Operação realizada com sucesso"
}
```

### Erro
```json
{
  "status": "error",
  "error": {
    "code": "string",
    "message": "string"
  }
}
```

## 🔄 Rate Limiting

- 100 requisições por minuto por IP
- 1000 requisições por hora por usuário autenticado

## 📦 Códigos de Status

- `200`: Sucesso
- `201`: Criado
- `400`: Requisição inválida
- `401`: Não autorizado
- `403`: Proibido
- `404`: Não encontrado
- `429`: Muitas requisições
- `500`: Erro interno

## Auth Service (3001)

### POST /auth/login
Autentica um usuário e retorna um token JWT.

**Request:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "access_token": "string",
  "user": {
    "id": "number",
    "email": "string",
    "name": "string",
    "role": "string"
  }
}
```

## Members Service (3003)

### GET /members
Retorna a lista de membros.

**Headers:**
- Authorization: Bearer {token}

**Response (200):**
```json
[
  {
    "id": "number",
    "name": "string",
    "email": "string",
    "plan": "string",
    "startDate": "string",
    "status": "string"
  }
]
```

## Billing Service (3004)

### GET /billing/dashboard-metrics
Retorna métricas do dashboard.

**Headers:**
- Authorization: Bearer {token}

**Response (200):**
```json
{
  "faturamentoMensal": "number",
  "planosAtivos": "number",
  "ticketMedio": "number",
  "metricas": {
    "receitaTotal": "number",
    "crescimentoMensal": "number",
    "taxaRenovacao": "number"
  },
  "planosPorTipo": {
    "basic": "number",
    "premium": "number",
    "enterprise": "number"
  },
  "ultimasFaturas": [
    {
      "id": "number",
      "cliente": "string",
      "valor": "number",
      "status": "string",
      "data": "string"
    }
  ]
}
```

## Feedback Service (3005)

### POST /feedback
Registra um novo feedback.

**Headers:**
- Authorization: Bearer {token}

**Request:**
```json
{
  "nota": "number (1-5)",
  "comentario": "string",
  "userId": "number"
}
```

**Response (201):**
```json
{
  "id": "number",
  "nota": "number",
  "comentario": "string",
  "userId": "number",
  "createdAt": "string"
}
```

## Códigos de Erro Comuns

- 400: Bad Request - Dados inválidos
- 401: Unauthorized - Token inválido ou expirado
- 403: Forbidden - Sem permissão para acessar o recurso
- 404: Not Found - Recurso não encontrado
- 500: Internal Server Error - Erro interno do servidor

## Observações

1. Todas as requisições devem incluir:
   - Content-Type: application/json
   - Authorization: Bearer {token} (exceto /auth/login)

2. Todas as respostas incluem:
   - Content-Type: application/json

3. CORS está habilitado para:
   - http://localhost:3002 (frontend) 