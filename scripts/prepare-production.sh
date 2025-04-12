#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🚀 Preparando ambiente de produção..."

# Verifica dependências
command -v docker >/dev/null 2>&1 || { 
    echo "${RED}Docker não encontrado. Por favor, instale o Docker primeiro.${NC}" >&2
    exit 1
}

command -v docker-compose >/dev/null 2>&1 || {
    echo "${RED}Docker Compose não encontrado. Por favor, instale o Docker Compose primeiro.${NC}" >&2
    exit 1
}

# Frontend
echo "${YELLOW}📦 Preparando frontend...${NC}"
cd frontend/app-aluno

# Instala dependências de produção
npm ci --production

# Build otimizado
echo "🔨 Gerando build otimizado..."
npm run build

# Testes
echo "🧪 Executando testes..."
npm test
npm run test:e2e

# Backend
echo "${YELLOW}📦 Preparando backend...${NC}"
cd ../../backend/api

# Instala dependências de produção
composer install --no-dev --optimize-autoloader

# Otimiza Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Testes
echo "🧪 Executando testes..."
php artisan test

# Verifica variáveis de ambiente
echo "${YELLOW}🔍 Verificando variáveis de ambiente...${NC}"

ENV_VARS=(
    "APP_KEY"
    "DB_HOST"
    "DB_DATABASE"
    "DB_USERNAME"
    "DB_PASSWORD"
    "REDIS_HOST"
    "AWS_ACCESS_KEY_ID"
    "AWS_SECRET_ACCESS_KEY"
    "AWS_DEFAULT_REGION"
    "AWS_BUCKET"
)

for var in "${ENV_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        echo "${RED}⚠️  Variável de ambiente $var não definida${NC}"
        exit 1
    fi
done

# Verifica conexões
echo "${YELLOW}🔌 Verificando conexões...${NC}"

# Banco de dados
php artisan db:monitor || {
    echo "${RED}❌ Erro na conexão com o banco de dados${NC}"
    exit 1
}

# Redis
php artisan redis:monitor || {
    echo "${RED}❌ Erro na conexão com Redis${NC}"
    exit 1
}

# AWS S3
php artisan storage:check || {
    echo "${RED}❌ Erro na conexão com AWS S3${NC}"
    exit 1
}

# Build dos containers
echo "${YELLOW}🐳 Construindo containers de produção...${NC}"
docker-compose -f docker-compose.prod.yml build

# Verifica saúde dos serviços
echo "${YELLOW}🏥 Verificando saúde dos serviços...${NC}"
curl -s http://localhost/api/monitoring/health | grep -q '"status":"healthy"' || {
    echo "${RED}❌ Verificação de saúde falhou${NC}"
    exit 1
}

echo "${GREEN}✅ Ambiente de produção preparado com sucesso!${NC}"
echo "
📝 Próximos passos:
1. Revise as configurações de segurança
2. Configure os domínios e certificados SSL
3. Configure monitoramento e alertas
4. Faça backup do banco de dados
5. Atualize a documentação da API
" 