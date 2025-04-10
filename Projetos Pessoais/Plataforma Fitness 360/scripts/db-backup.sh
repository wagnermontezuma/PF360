#!/bin/bash

# Script de backup automático para bancos de dados PostgreSQL
# Plataforma Fitness 360

set -e

# Configurações
BACKUP_DIR="/opt/fitness360/backups/database"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
RETENTION_DAYS=7  # Quantos dias manter os backups
S3_BUCKET="${S3_BUCKET:-fitness360-backups}"  # Bucket S3 para armazenar backups

# Variáveis para Docker
COMPOSE_FILE="docker-compose.yml"
BACKUP_FILE_PREFIX="fitness360_db_backup_${TIMESTAMP}"

# Cores para saída no terminal
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar se o diretório de backup existe, se não, criar
if [ ! -d "$BACKUP_DIR" ]; then
  mkdir -p "$BACKUP_DIR"
  echo "Diretório de backup criado: $BACKUP_DIR"
fi

# Função para fazer backup de um banco de dados
backup_database() {
  local container_name=$1
  local db_name=$2
  local db_user=$3
  local backup_file="${BACKUP_DIR}/${BACKUP_FILE_PREFIX}_${db_name}.sql.gz"
  
  echo -e "\n${YELLOW}Iniciando backup do banco de dados:${NC} $db_name em $container_name"
  
  # Verificar se o container está rodando
  if ! docker ps -q -f name=$container_name | grep -q .; then
    echo -e "${RED}Container $container_name não está rodando. Pulando backup do $db_name.${NC}"
    return 1
  fi
  
  # Executar o backup (dump) com compressão direta
  echo "Executando backup com pg_dump..."
  docker exec $container_name pg_dump -U $db_user $db_name | gzip > "$backup_file"
  
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}Backup concluído com sucesso:${NC} $backup_file"
    echo "Tamanho do arquivo: $(du -h "$backup_file" | cut -f1)"
    return 0
  else
    echo -e "${RED}Erro ao fazer backup do banco de dados $db_name${NC}"
    return 1
  fi
}

# Função para fazer upload para o S3 (se configurado)
upload_to_s3() {
  local file=$1
  local s3_path=$2
  
  # Verificar se AWS CLI está instalada
  if ! command -v aws &> /dev/null; then
    echo -e "${YELLOW}AWS CLI não encontrado. Pulando upload para S3.${NC}"
    return 1
  fi
  
  # Verificar se variáveis de ambiente da AWS estão definidas
  if [ -z "$AWS_ACCESS_KEY_ID" ] || [ -z "$AWS_SECRET_ACCESS_KEY" ]; then
    echo -e "${YELLOW}Credenciais AWS não definidas. Pulando upload para S3.${NC}"
    return 1
  fi
  
  echo "Enviando backup para S3: s3://${S3_BUCKET}/${s3_path}"
  aws s3 cp "$file" "s3://${S3_BUCKET}/${s3_path}"
  
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}Upload para S3 concluído com sucesso${NC}"
    return 0
  else
    echo -e "${RED}Erro ao fazer upload para S3${NC}"
    return 1
  fi
}

# Função para limpar backups antigos
cleanup_old_backups() {
  echo -e "\n${YELLOW}Limpando backups antigos (mais de $RETENTION_DAYS dias)...${NC}"
  
  find "$BACKUP_DIR" -name "fitness360_db_backup_*" -type f -mtime +$RETENTION_DAYS -delete
  
  echo -e "${GREEN}Limpeza de backups antigos concluída${NC}"
}

echo "=== Iniciando backup de todos os bancos de dados PostgreSQL ==="
echo "Data e hora: $(date)"

# Descobrir contêineres PostgreSQL em execução
echo "Procurando contêineres PostgreSQL em execução..."

postgres_containers=$(docker ps --format '{{.Names}}' | grep -E '.*db-[0-9]+$')

if [ -z "$postgres_containers" ]; then
  echo -e "${YELLOW}Nenhum contêiner PostgreSQL encontrado em execução.${NC}"
  echo "Tentando obter informações do docker-compose.yml..."
  
  # Tentar usar informações do docker-compose.yml
  db_services=("auth-db" "members-db" "billing-db" "feedback-db" "notifications-db")
  
  for db_service in "${db_services[@]}"; do
    # Extrair nome do banco e usuário do serviço
    service_name=$(echo "$db_service" | sed 's/-db//g')
    container_name="plataformafitness360-${db_service}-1"
    db_name="${service_name}360"
    db_user="fitness360"
    
    backup_database "$container_name" "$db_name" "$db_user"
    
    if [ $? -eq 0 ]; then
      # Se o backup for bem-sucedido, fazer upload para S3
      backup_file="${BACKUP_DIR}/${BACKUP_FILE_PREFIX}_${db_name}.sql.gz"
      s3_path="daily/${service_name}/${BACKUP_FILE_PREFIX}_${db_name}.sql.gz"
      upload_to_s3 "$backup_file" "$s3_path"
    fi
  done
else
  # Processar cada contêiner encontrado
  for container in $postgres_containers; do
    # Extrair o nome do banco a partir do nome do contêiner
    service_name=$(echo "$container" | sed -E 's/plataformafitness360-(.+)-db-[0-9]+/\1/g')
    db_name="${service_name}360"
    db_user="fitness360"
    
    backup_database "$container" "$db_name" "$db_user"
    
    if [ $? -eq 0 ]; then
      # Se o backup for bem-sucedido, fazer upload para S3
      backup_file="${BACKUP_DIR}/${BACKUP_FILE_PREFIX}_${db_name}.sql.gz"
      s3_path="daily/${service_name}/${BACKUP_FILE_PREFIX}_${db_name}.sql.gz"
      upload_to_s3 "$backup_file" "$s3_path"
    fi
  done
fi

# Limpar backups antigos
cleanup_old_backups

echo -e "\n${GREEN}Processo de backup finalizado!${NC}"
echo "Todos os backups foram armazenados em: $BACKUP_DIR"
echo "Data e hora de conclusão: $(date)" 