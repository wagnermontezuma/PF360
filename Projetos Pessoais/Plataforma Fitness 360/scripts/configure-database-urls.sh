#!/bin/bash

# Script para configurar as variáveis DATABASE_URL em todos os serviços
# Plataforma Fitness 360

set -e

SERVICES=("auth-svc" "members-svc" "billing-svc" "feedback-svc" "notifications-svc" "workouts-svc" "nutrition-svc")
ENV_FILES=(".env" ".env.development" ".env.staging" ".env.production")

# Cores para saída no terminal
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "=== Configurando variáveis DATABASE_URL nos serviços ==="

# Detectar ambiente
if [ -n "$STAGE" ]; then
  ENVIRONMENT="$STAGE"
else
  ENVIRONMENT="development"
  echo -e "${YELLOW}Variável STAGE não definida. Usando 'development' como padrão.${NC}"
fi

echo "Ambiente atual: $ENVIRONMENT"

# Função para atualizar uma variável em um arquivo .env
update_env_var() {
  local file=$1
  local var_name=$2
  local var_value=$3
  
  # Se o arquivo existe
  if [ -f "$file" ]; then
    # Se a variável já existe no arquivo, atualize-a
    if grep -q "^$var_name=" "$file"; then
      sed -i "s|^$var_name=.*|$var_name=$var_value|" "$file"
      echo -e "${GREEN}Atualizada${NC} a variável $var_name em $file"
    else
      # Caso contrário, adicione-a ao arquivo
      echo "$var_name=$var_value" >> "$file"
      echo -e "${GREEN}Adicionada${NC} a variável $var_name em $file"
    fi
  else
    # Se o arquivo não existe, crie-o com a variável
    echo "$var_name=$var_value" > "$file"
    echo -e "${GREEN}Criado${NC} o arquivo $file com a variável $var_name"
  fi
}

# Para cada serviço
for service in "${SERVICES[@]}"; do
  echo -e "\n${YELLOW}Configurando serviço:${NC} $service"
  
  # Crie o diretório do serviço se não existir
  mkdir -p "backend/$service"
  
  # Determinar o nome do banco de dados
  db_name=$(echo "$service" | sed 's/-svc//g')360
  
  # Configurar variáveis para diferentes ambientes
  for env_file in "${ENV_FILES[@]}"; do
    env_path="backend/$service/$env_file"
    
    case "$env_file" in
      ".env" | ".env.development")
        db_url="postgresql://fitness360:fitness360pass@localhost:5432/$db_name?schema=public"
        ;;
      ".env.staging")
        db_url="postgresql://fitness360:fitness360pass@$db_name-db:5432/$db_name?schema=public"
        ;;
      ".env.production")
        # Em produção, usamos a variável de ambiente passada pelos secrets
        db_url="\${DATABASE_URL}"
        ;;
    esac
    
    # Atualizar a variável DATABASE_URL no arquivo
    update_env_var "$env_path" "DATABASE_URL" "$db_url"
  done
  
  echo -e "${GREEN}Concluído${NC} para $service"
done

echo -e "\n${GREEN}Configuração de DATABASE_URL finalizada para todos os serviços!${NC}"
echo "Para aplicar as alterações em um ambiente específico, execute:"
echo "  STAGE=staging ./scripts/configure-database-urls.sh" 