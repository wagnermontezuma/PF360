#!/bin/bash

# Script para executar prisma migrate deploy em ambiente de staging
# Plataforma Fitness 360

set -e

SERVICES=("auth-svc" "members-svc" "billing-svc" "feedback-svc" "notifications-svc" "workouts-svc" "nutrition-svc")

# Cores para saída no terminal
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Função para verificar se prisma está instalado
check_prisma() {
  if ! command -v npx &> /dev/null; then
    echo -e "${RED}Erro: npx não encontrado. Instale o Node.js primeiro.${NC}"
    exit 1
  fi
}

# Verificar argumento de ambiente
if [ -z "$1" ]; then
  ENVIRONMENT="staging"
  echo -e "${YELLOW}Ambiente não especificado. Usando 'staging' como padrão.${NC}"
else
  ENVIRONMENT="$1"
fi

echo "=== Executando prisma migrate deploy em ambiente: $ENVIRONMENT ==="

# Verificar prisma
check_prisma

# Para cada serviço
for service in "${SERVICES[@]}"; do
  echo -e "\n${YELLOW}Migrando banco de dados para:${NC} $service"
  
  # Verificar se o diretório do serviço existe
  if [ ! -d "backend/$service" ]; then
    echo -e "${RED}Diretório backend/$service não encontrado. Pulando...${NC}"
    continue
  fi
  
  # Verificar se o schema do Prisma existe
  if [ ! -f "backend/$service/prisma/schema.prisma" ]; then
    echo -e "${YELLOW}Schema Prisma não encontrado em backend/$service/prisma/schema.prisma. Pulando...${NC}"
    continue
  fi
  
  # Carregar arquivo .env específico do ambiente
  ENV_FILE="backend/$service/.env.$ENVIRONMENT"
  if [ ! -f "$ENV_FILE" ]; then
    echo -e "${YELLOW}Arquivo .env.$ENVIRONMENT não encontrado para $service.${NC}"
    echo -e "${YELLOW}Tentando usar o arquivo .env padrão...${NC}"
    ENV_FILE="backend/$service/.env"
    
    if [ ! -f "$ENV_FILE" ]; then
      echo -e "${RED}Nenhum arquivo .env encontrado para $service. Pulando...${NC}"
      continue
    fi
  fi
  
  echo "Usando arquivo de ambiente: $ENV_FILE"
  
  # Executar prisma migrate deploy
  echo "Executando prisma migrate deploy..."
  (
    cd "backend/$service"
    
    # Verificar se existem migrações
    if [ ! -d "prisma/migrations" ] || [ -z "$(ls -A prisma/migrations 2>/dev/null)" ]; then
      echo -e "${YELLOW}Nenhuma migração encontrada. Criando migração inicial...${NC}"
      # Ao invés de fazer migrate dev, apenas alertamos
      echo -e "${RED}ATENÇÃO: É necessário executar manualmente 'npx prisma migrate dev --name init'${NC}"
      echo -e "${RED}para criar a migração inicial. Pulando este serviço.${NC}"
      continue
    fi
    
    # Carregar variáveis de ambiente e executar migrate deploy
    if [ -f "$ENV_FILE" ]; then
      export $(grep -v '^#' "$ENV_FILE" | xargs)
    fi
    
    npx prisma migrate deploy
    
    # Gerar prisma client
    echo "Gerando Prisma Client..."
    npx prisma generate
    
    echo -e "${GREEN}Migração do banco de dados concluída para $service${NC}"
  )
done

echo -e "\n${GREEN}Processo de migração finalizado!${NC}"
echo "Todos os bancos de dados foram migrados para o ambiente: $ENVIRONMENT" 