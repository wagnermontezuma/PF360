#!/bin/bash

# Script de verificação de saúde dos serviços da Plataforma Fitness 360

# Cores para saída no terminal
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Função para verificar saúde de um serviço
check_service() {
  local service_name=$1
  local endpoint=$2
  local expected=$3

  echo -n "Verificando ${service_name}... "

  # Tentativas de conexão (retry)
  local max_attempts=3
  local attempt=1
  local status=false

  while [ $attempt -le $max_attempts ]; do
    response=$(curl -s -o /dev/null -w "%{http_code}" "$endpoint")
    
    if [ "$response" == "$expected" ]; then
      status=true
      break
    fi
    
    attempt=$((attempt + 1))
    [ $attempt -le $max_attempts ] && sleep 2
  done

  if [ "$status" = true ]; then
    echo -e "${GREEN}OK${NC} (Status: $response)"
    return 0
  else
    echo -e "${RED}FALHA${NC} (Status: $response, esperado: $expected)"
    return 1
  fi
}

# Função para verificar banco de dados
check_database() {
  local db_name=$1
  local db_user=$2
  local db_host=$3
  local db_port=$4
  
  echo -n "Verificando banco de dados ${db_name}... "
  
  if PGPASSWORD=$DB_PASSWORD psql -h "$db_host" -p "$db_port" -U "$db_user" -d "$db_name" -c "SELECT 1" &>/dev/null; then
    echo -e "${GREEN}OK${NC}"
    return 0
  else
    echo -e "${RED}FALHA${NC}"
    return 1
  fi
}

# Carregar variáveis de ambiente se o arquivo existir
ENV_FILE=".env"
if [ -f "$ENV_FILE" ]; then
  source "$ENV_FILE"
  echo -e "${YELLOW}Variáveis de ambiente carregadas de $ENV_FILE${NC}"
else
  echo -e "${YELLOW}Arquivo .env não encontrado. Usando valores padrão.${NC}"
  
  # Valores padrão se .env não existir
  export AUTH_API_URL="${AUTH_API_URL:-http://localhost:3001}"
  export MEMBERS_API_URL="${MEMBERS_API_URL:-http://localhost:3003}"
  export BILLING_API_URL="${BILLING_API_URL:-http://localhost:3004}"
  export FEEDBACK_API_URL="${FEEDBACK_API_URL:-http://localhost:3005}"
  export NOTIFICATIONS_API_URL="${NOTIFICATIONS_API_URL:-http://localhost:3004}"
  export FRONTEND_URL="${FRONTEND_URL:-http://localhost:3006}"
fi

echo "=== Verificação de saúde da Plataforma Fitness 360 ==="
echo "Data e hora: $(date)"
echo "Ambiente: ${STAGE:-local}"
echo "=========================================="

# Verificar serviços backend
failed_services=0

check_service "Auth Service" "${AUTH_API_URL}/api/health" "200" || ((failed_services++))
check_service "Members Service" "${MEMBERS_API_URL}/api/health" "200" || ((failed_services++))
check_service "Billing Service" "${BILLING_API_URL}/api/health" "200" || ((failed_services++))
check_service "Feedback Service" "${FEEDBACK_API_URL}/api/health" "200" || ((failed_services++))
check_service "Notifications Service" "${NOTIFICATIONS_API_URL}/api/health" "200" || ((failed_services++))

# Verificar frontend
check_service "Frontend" "${FRONTEND_URL}" "200" || ((failed_services++))

echo "=========================================="

# Resumo final
if [ $failed_services -eq 0 ]; then
  echo -e "${GREEN}Todos os serviços estão saudáveis!${NC}"
  echo '{"status":"healthy", "message":"All services are up and running"}'
  exit 0
else
  echo -e "${RED}$failed_services serviço(s) apresentam problemas!${NC}"
  echo '{"status":"unhealthy", "message":"Some services are not responding correctly"}'
  exit 1
fi 