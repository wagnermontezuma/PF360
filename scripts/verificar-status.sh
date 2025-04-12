#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}==================================================${NC}"
echo -e "${BLUE}    Verificando o status do ambiente Fitness 360   ${NC}"
echo -e "${BLUE}==================================================${NC}"

# Verifica se o Docker está rodando
if ! docker info > /dev/null 2>&1; then
  echo -e "${RED}[ERRO] Docker não está rodando. Por favor, inicie o Docker primeiro.${NC}"
  exit 1
fi

# Verifica a disponibilidade do arquivo docker-compose de desenvolvimento
if [ ! -f "docker-compose.dev.yml" ]; then
  echo -e "${RED}[ERRO] O arquivo docker-compose.dev.yml não foi encontrado.${NC}"
  exit 1
fi

# Verificar o status dos serviços
echo -e "${YELLOW}Status dos serviços:${NC}"
docker-compose -f docker-compose.dev.yml ps

# Verificar uso de recursos
echo -e "\n${YELLOW}Uso de recursos:${NC}"
docker stats --no-stream $(docker-compose -f docker-compose.dev.yml ps -q)

# Verificar portas em uso
echo -e "\n${YELLOW}Portas em uso:${NC}"
echo -e "Frontend Aluno (3006): $(nc -z localhost 3006 && echo -e "${GREEN}Disponível${NC}" || echo -e "${RED}Indisponível${NC}")"
echo -e "Frontend Staff (3007): $(nc -z localhost 3007 && echo -e "${GREEN}Disponível${NC}" || echo -e "${RED}Indisponível${NC}")"
echo -e "API Gateway (3000): $(nc -z localhost 3000 && echo -e "${GREEN}Disponível${NC}" || echo -e "${RED}Indisponível${NC}")"
echo -e "Auth Service (3001): $(nc -z localhost 3001 && echo -e "${GREEN}Disponível${NC}" || echo -e "${RED}Indisponível${NC}")"
echo -e "Members Service (3003): $(nc -z localhost 3003 && echo -e "${GREEN}Disponível${NC}" || echo -e "${RED}Indisponível${NC}")"
echo -e "Billing Service (3004): $(nc -z localhost 3004 && echo -e "${GREEN}Disponível${NC}" || echo -e "${RED}Indisponível${NC}")"
echo -e "Feedback Service (3005): $(nc -z localhost 3005 && echo -e "${GREEN}Disponível${NC}" || echo -e "${RED}Indisponível${NC}")"
echo -e "Workouts Service (3007): $(nc -z localhost 3007 && echo -e "${GREEN}Disponível${NC}" || echo -e "${RED}Indisponível${NC}")"
echo -e "Nutrition Service (3008): $(nc -z localhost 3008 && echo -e "${GREEN}Disponível${NC}" || echo -e "${RED}Indisponível${NC}")"
echo -e "Notifications Service (3009): $(nc -z localhost 3009 && echo -e "${GREEN}Disponível${NC}" || echo -e "${RED}Indisponível${NC}")"
echo -e "Kafka UI (8080): $(nc -z localhost 8080 && echo -e "${GREEN}Disponível${NC}" || echo -e "${RED}Indisponível${NC}")"

echo -e "\n${BLUE}==================================================${NC}"
echo -e "${YELLOW}Para iniciar os serviços:${NC} ./scripts/iniciar-ambiente.sh"
echo -e "${YELLOW}Para parar os serviços:${NC} ./scripts/parar-ambiente.sh"
echo -e "${YELLOW}Para monitorar logs:${NC} ./scripts/monitorar-logs.sh [serviço]"
echo -e "${BLUE}==================================================${NC}" 