#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar se um serviço específico foi fornecido
if [ "$1" != "" ]; then
  SERVICE=$1
  echo -e "${BLUE}==================================================${NC}"
  echo -e "${BLUE}   Monitorando logs do serviço: $SERVICE          ${NC}"
  echo -e "${BLUE}==================================================${NC}"
  
  # Verifica a disponibilidade do arquivo docker-compose de desenvolvimento
  if [ ! -f "docker-compose.dev.yml" ]; then
    echo -e "${RED}[ERRO] O arquivo docker-compose.dev.yml não foi encontrado.${NC}"
    exit 1
  fi
  
  # Monitorar logs do serviço específico
  docker-compose -f docker-compose.dev.yml logs -f $SERVICE
  
  exit 0
fi

# Se nenhum serviço específico foi fornecido, exibir ajuda
echo -e "${BLUE}==================================================${NC}"
echo -e "${BLUE}   Monitoramento de logs da Plataforma Fitness 360 ${NC}"
echo -e "${BLUE}==================================================${NC}"
echo -e "${YELLOW}Uso: $0 [serviço]${NC}"
echo -e "${YELLOW}Serviços disponíveis:${NC}"
echo -e "  ${GREEN}frontend${NC} - Frontend Aluno"
echo -e "  ${GREEN}frontend-staff${NC} - Frontend Profissional"
echo -e "  ${GREEN}api-gateway${NC} - API Gateway"
echo -e "  ${GREEN}auth-api${NC} - Serviço de Autenticação"
echo -e "  ${GREEN}members-api${NC} - Serviço de Membros"
echo -e "  ${GREEN}billing-api${NC} - Serviço de Faturamento"
echo -e "  ${GREEN}feedback-api${NC} - Serviço de Feedback"
echo -e "  ${GREEN}workouts-api${NC} - Serviço de Treinos"
echo -e "  ${GREEN}nutrition-api${NC} - Serviço de Nutrição"
echo -e "  ${GREEN}notifications-api${NC} - Serviço de Notificações"
echo -e "  ${GREEN}kafka${NC} - Serviço Kafka"
echo -e "  ${GREEN}zookeeper${NC} - Serviço Zookeeper"
echo -e "${BLUE}==================================================${NC}"
echo -e "${YELLOW}Exemplo: $0 frontend${NC}"
echo -e "${YELLOW}Para visualizar todos os logs:${NC} $0 all"
echo -e "${BLUE}==================================================${NC}"

# Verificar se o usuário solicitou todos os logs
if [ "$1" == "all" ]; then
  echo -e "${BLUE}==================================================${NC}"
  echo -e "${BLUE}   Monitorando logs de todos os serviços           ${NC}"
  echo -e "${BLUE}==================================================${NC}"
  
  # Verifica a disponibilidade do arquivo docker-compose de desenvolvimento
  if [ ! -f "docker-compose.dev.yml" ]; then
    echo -e "${RED}[ERRO] O arquivo docker-compose.dev.yml não foi encontrado.${NC}"
    exit 1
  fi
  
  # Monitorar logs de todos os serviços
  docker-compose -f docker-compose.dev.yml logs -f
  
  exit 0
fi 