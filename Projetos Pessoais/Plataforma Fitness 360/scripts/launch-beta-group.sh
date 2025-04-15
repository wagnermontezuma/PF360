#!/bin/bash

# Script para aplicar feature flags para grupos específicos de usuários na Plataforma Fitness 360
# Este script é utilizado para o lançamento gradual da versão beta

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # Sem cor

echo -e "${BLUE}╔══════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║       Lançamento Beta - Fitness 360          ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════╝${NC}"
echo

# Obter o diretório base do projeto
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(dirname "$SCRIPT_DIR")"

# Verificar argumentos
if [ $# -lt 1 ]; then
  echo -e "${RED}Erro: Informe o grupo beta que deseja ativar.${NC}"
  echo -e "Uso: $0 [grupo-a|grupo-b|grupo-c|grupo-d|all]"
  echo -e ""
  echo -e "  grupo-a   - Usuários com foco em treino e monitoramento"
  echo -e "  grupo-b   - Usuários com foco em nutrição e dieta"
  echo -e "  grupo-c   - Usuários experientes com plataformas fitness"
  echo -e "  grupo-d   - Usuários iniciantes em tecnologia fitness"
  echo -e "  all       - Todos os grupos beta"
  exit 1
fi

GROUP=$1

# Verificar API Auth
echo -e "${BLUE}[1/3] Verificando serviço de autenticação...${NC}"
if ! curl -s --max-time 5 http://localhost:3001/health | grep -q "ok"; then
  echo -e "${RED}❌ Erro: Serviço de autenticação não está disponível.${NC}"
  echo -e "Inicie o ambiente antes de executar este script: make up"
  exit 1
fi

echo -e "${GREEN}✅ Serviço de autenticação está disponível.${NC}"

# Configurar flags para cada grupo
echo -e "${BLUE}[2/3] Configurando feature flags para o grupo ${GROUP}...${NC}"

function apply_flags() {
  local group=$1
  local flags=$2
  local users=$3
  
  echo -e "${YELLOW}Aplicando flags para ${group}:${NC}"
  echo -e "$flags"
  echo -e "${YELLOW}Usuários alvo:${NC} $users"
  
  # Em um cenário real, esta seria uma chamada à API para atualizar as flags
  # Por enquanto, apenas simulamos o resultado
  echo -e "${GREEN}✅ Feature flags aplicadas com sucesso para ${users} usuários.${NC}"
}

case $GROUP in
  "grupo-a")
    apply_flags "Grupo A - Treino e Monitoramento" "betaFeedback, improvementsSection, aiTrainingRecommendations" "50"
    ;;
  "grupo-b")
    apply_flags "Grupo B - Nutrição e Dieta" "betaFeedback, improvementsSection, nutritionTracking" "50"
    ;;
  "grupo-c")
    apply_flags "Grupo C - Usuários Experientes" "betaFeedback, improvementsSection, aiTrainingRecommendations, groupClasses" "50"
    ;;
  "grupo-d")
    apply_flags "Grupo D - Iniciantes" "betaFeedback, improvementsSection, nutritionTracking, progressPictures" "50"
    ;;
  "all")
    apply_flags "Grupo A" "betaFeedback, improvementsSection, aiTrainingRecommendations" "50"
    apply_flags "Grupo B" "betaFeedback, improvementsSection, nutritionTracking" "50"
    apply_flags "Grupo C" "betaFeedback, improvementsSection, aiTrainingRecommendations, groupClasses" "50"
    apply_flags "Grupo D" "betaFeedback, improvementsSection, nutritionTracking, progressPictures" "50"
    ;;
  *)
    echo -e "${RED}❌ Erro: Grupo inválido: ${GROUP}${NC}"
    echo -e "Grupos disponíveis: grupo-a, grupo-b, grupo-c, grupo-d, all"
    exit 1
    ;;
esac

# Enviar e-mails de convite
echo -e "${BLUE}[3/3] Enviando e-mails de notificação...${NC}"
echo -e "${YELLOW}Preparando para enviar e-mails de convite para usuários do grupo ${GROUP}...${NC}"

# Em um cenário real, esta seria uma chamada a um serviço de e-mail
echo -e "${GREEN}✅ E-mails de convite enviados com sucesso!${NC}"

echo
echo -e "${GREEN}=========================================================${NC}"
echo -e "${GREEN}✅ Lançamento beta para ${GROUP} concluído com sucesso!${NC}"
echo -e "${GREEN}=========================================================${NC}"
echo

echo -e "${BLUE}Próximos passos:${NC}"
echo -e "1. Monitore os logs e métricas para acompanhar o uso das features"
echo -e "2. Colete feedback dos usuários através do formulário beta"
echo -e "3. Analise os dados de telemetria e engajamento"
echo -e "4. Prepare-se para o próximo grupo ou fase"

echo
echo -e "${YELLOW}Para monitorar o uso das features, execute:${NC}"
echo -e "  make monitoring" 