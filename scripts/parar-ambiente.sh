#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}==================================================${NC}"
echo -e "${BLUE}      Parando o ambiente Fitness 360               ${NC}"
echo -e "${BLUE}==================================================${NC}"

# Verifica se o Docker está rodando
if ! docker info > /dev/null 2>&1; then
  echo -e "${RED}[ERRO] Docker não está rodando.${NC}"
  exit 1
fi

# Verifica a disponibilidade do arquivo docker-compose de desenvolvimento
if [ ! -f "docker-compose.dev.yml" ]; then
  echo -e "${RED}[ERRO] O arquivo docker-compose.dev.yml não foi encontrado.${NC}"
  exit 1
fi

# Parar todos os serviços
echo -e "${YELLOW}Parando todos os serviços...${NC}"
docker-compose -f docker-compose.dev.yml down

echo -e "${GREEN}==================================================${NC}"
echo -e "${GREEN}      Ambiente parado com sucesso!                ${NC}"
echo -e "${GREEN}==================================================${NC}"
echo -e "${YELLOW}Para remover todos os volumes (dados serão perdidos):${NC}"
echo -e "docker-compose -f docker-compose.dev.yml down -v"
echo -e "${GREEN}==================================================${NC}" 