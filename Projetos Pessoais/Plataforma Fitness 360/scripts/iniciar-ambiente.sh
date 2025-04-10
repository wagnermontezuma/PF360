#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}==================================================${NC}"
echo -e "${BLUE}      Iniciando o ambiente Fitness 360            ${NC}"
echo -e "${BLUE}==================================================${NC}"

# Verifica se o Docker está rodando
if ! docker info > /dev/null 2>&1; then
  echo -e "${RED}[ERRO] Docker não está rodando. Por favor, inicie o Docker primeiro.${NC}"
  exit 1
fi

# Função para verificar se os serviços estão prontos
check_service() {
  local service=$1
  local port=$2
  local max_attempts=30
  local attempt=1

  echo -e "${YELLOW}Verificando se o serviço $service está pronto na porta $port...${NC}"
  
  while [ $attempt -le $max_attempts ]; do
    if curl -s http://localhost:$port/health > /dev/null 2>&1; then
      echo -e "${GREEN}Serviço $service está pronto na porta $port!${NC}"
      return 0
    fi
    echo -e "${YELLOW}Tentativa $attempt/$max_attempts - Aguardando serviço $service iniciar...${NC}"
    sleep 3
    ((attempt++))
  done
  
  echo -e "${RED}[ERRO] Serviço $service não respondeu após múltiplas tentativas.${NC}"
  return 1
}

# Verifica a disponibilidade do arquivo docker-compose de desenvolvimento
if [ ! -f "docker-compose.dev.yml" ]; then
  echo -e "${RED}[ERRO] O arquivo docker-compose.dev.yml não foi encontrado.${NC}"
  exit 1
fi

# Parar serviços antigos, se existirem
echo -e "${YELLOW}Parando serviços antigos, se existirem...${NC}"
docker-compose -f docker-compose.dev.yml down

# Iniciar todos os serviços de backend e bancos de dados
echo -e "${YELLOW}Iniciando serviços de backend, bancos de dados e infraestrutura...${NC}"
docker-compose -f docker-compose.dev.yml up -d kafka zookeeper redis auth-db members-db billing-db feedback-db workouts-db nutrition-db notifications-db

# Aguardar a inicialização dos bancos de dados
echo -e "${YELLOW}Aguardando a inicialização dos bancos de dados...${NC}"
sleep 10

# Inicializar configurações do Kafka
echo -e "${YELLOW}Inicializando configurações do Kafka...${NC}"
docker-compose -f docker-compose.dev.yml up -d kafka-setup

# Iniciar os serviços de backend
echo -e "${YELLOW}Iniciando os serviços de backend...${NC}"
docker-compose -f docker-compose.dev.yml up -d auth-api members-api billing-api feedback-api workouts-api nutrition-api notifications-api

# Aguardar a inicialização dos serviços de backend
echo -e "${YELLOW}Aguardando a inicialização dos serviços de backend (isso pode levar alguns minutos)...${NC}"
sleep 15

# Verificar se os serviços estão respondendo
check_service "Auth Service" 3001
check_service "Members Service" 3003
check_service "Billing Service" 3004
check_service "Feedback Service" 3005
check_service "Workouts Service" 3007
check_service "Nutrition Service" 3008
check_service "Notifications Service" 3009

# Iniciar o API Gateway
echo -e "${YELLOW}Iniciando o API Gateway...${NC}"
docker-compose -f docker-compose.dev.yml up -d api-gateway

# Aguardar a inicialização do API Gateway
echo -e "${YELLOW}Aguardando a inicialização do API Gateway...${NC}"
sleep 5
check_service "API Gateway" 3000

# Iniciar os frontends
echo -e "${YELLOW}Iniciando os frontends...${NC}"
docker-compose -f docker-compose.dev.yml up -d frontend frontend-staff

echo -e "${GREEN}==================================================${NC}"
echo -e "${GREEN}      Ambiente iniciado com sucesso!              ${NC}"
echo -e "${GREEN}==================================================${NC}"
echo -e "${BLUE}Frontend Aluno: ${NC}http://localhost:3006"
echo -e "${BLUE}Frontend Staff: ${NC}http://localhost:3007"
echo -e "${BLUE}API Gateway: ${NC}http://localhost:3000"
echo -e "${BLUE}Kafka UI: ${NC}http://localhost:8080"
echo -e "${GREEN}==================================================${NC}"
echo -e "${YELLOW}Para monitorar os logs dos serviços:${NC}"
echo -e "docker-compose -f docker-compose.dev.yml logs -f [serviço]"
echo -e "${YELLOW}Para parar todos os serviços:${NC}"
echo -e "docker-compose -f docker-compose.dev.yml down"
echo -e "${GREEN}==================================================${NC}" 