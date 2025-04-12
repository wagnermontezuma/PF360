#!/bin/bash

# Script de backup automático antes da implantação em produção
# Fitness 360 Platform

# Definir variáveis
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/opt/fitness360/backups"
DOCKER_COMPOSE_FILE="/home/ec2-user/fitness360/docker-compose.yml"
ENV_FILE="/home/ec2-user/fitness360/.env"
CONFIG_DIR="/home/ec2-user/fitness360/config"
BACKUP_NAME="fitness360_pre_deploy_${TIMESTAMP}"
S3_BUCKET="fitness360-backups"

# Verificar se o diretório de backup existe
if [ ! -d "$BACKUP_DIR" ]; then
  mkdir -p "$BACKUP_DIR"
  echo "Diretório de backup criado: $BACKUP_DIR"
fi

# Criar diretório para o backup atual
CURRENT_BACKUP_DIR="${BACKUP_DIR}/${BACKUP_NAME}"
mkdir -p "$CURRENT_BACKUP_DIR"

echo "Iniciando backup antes da implantação em: $CURRENT_BACKUP_DIR"

# Backup dos volumes do Docker (se necessário)
echo "Realizando backup dos volumes Docker..."
if docker compose -f "$DOCKER_COMPOSE_FILE" ps | grep -q Up; then
  # Listar todos os contêineres em execução
  for CONTAINER in $(docker compose -f "$DOCKER_COMPOSE_FILE" ps -q); do
    CONTAINER_NAME=$(docker inspect --format='{{.Name}}' "$CONTAINER" | sed 's/\///')
    echo "Executando backup do contêiner: $CONTAINER_NAME"
    
    # Se for um contêiner de banco de dados
    if [[ "$CONTAINER_NAME" == *"db"* ]] && [[ "$CONTAINER_NAME" == *"postgres"* ]]; then
      DB_NAME=$(docker exec "$CONTAINER" psql -U fitness360 -t -c "SELECT current_database()" | tr -d '[:space:]')
      echo "Realizando dump do banco de dados $DB_NAME..."
      
      # Dump do banco de dados
      docker exec "$CONTAINER" pg_dump -U fitness360 -d "$DB_NAME" -F c > "$CURRENT_BACKUP_DIR/${CONTAINER_NAME}_db_dump.sql"
    fi
  done
fi

# Backup dos arquivos de configuração
echo "Realizando backup dos arquivos de configuração..."
cp "$DOCKER_COMPOSE_FILE" "$CURRENT_BACKUP_DIR/docker-compose.yml"
cp "$ENV_FILE" "$CURRENT_BACKUP_DIR/.env"

# Se existir diretório de configuração, fazer backup
if [ -d "$CONFIG_DIR" ]; then
  cp -r "$CONFIG_DIR" "$CURRENT_BACKUP_DIR/config"
fi

# Comprimir o backup
echo "Comprimindo backup..."
cd "$BACKUP_DIR" || exit 1
tar -czf "${BACKUP_NAME}.tar.gz" "$BACKUP_NAME"

# Upload para o S3 (se configurado)
if command -v aws &> /dev/null; then
  echo "Enviando backup para o S3..."
  aws s3 cp "${BACKUP_NAME}.tar.gz" "s3://${S3_BUCKET}/pre-deploy-backups/${BACKUP_NAME}.tar.gz"
fi

# Limpar backups antigos (manter apenas os últimos 5)
echo "Limpando backups antigos..."
ls -tp "${BACKUP_DIR}" | grep -v '/$' | tail -n +6 | xargs -I {} rm -- "${BACKUP_DIR}/{}"

echo "Backup concluído com sucesso em: $(date)"
echo "Caminho do backup: ${BACKUP_DIR}/${BACKUP_NAME}.tar.gz"
exit 0 