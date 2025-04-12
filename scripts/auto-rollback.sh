#!/bin/bash

# Script de rollback automático com verificação de saúde dos serviços
# Fitness 360 Platform

# Cores para saída no terminal
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variáveis do script
DEPLOY_MARKER="/opt/fitness360/deploy-marker"
BACKUP_DIR="/opt/fitness360/backups"
DOCKER_COMPOSE_FILE="/home/ec2-user/fitness360/docker-compose.yml"
ENV_FILE="/home/ec2-user/fitness360/.env"
CONFIG_DIR="/home/ec2-user/fitness360/config"
HEALTH_CHECK_SCRIPT="/home/ec2-user/fitness360/scripts/healthcheck.sh"
HEALTH_CHECK_URL="${HEALTH_CHECK_URL:-http://localhost:3000/api/health}"
S3_BUCKET="${S3_BUCKET:-fitness360-backups}"
MAX_ATTEMPTS=3
ATTEMPT_DELAY=30 # segundos

# Verificar se está rodando como root/sudo
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}Erro: Este script precisa ser executado como root ou com sudo${NC}"
  exit 1
fi

# Verificar se o Docker Compose está instalado
if ! command -v docker compose &> /dev/null; then
  echo -e "${RED}Erro: Docker Compose não está instalado${NC}"
  exit 1
fi

# Função para fazer log
log() {
  local level="$1"
  local message="$2"
  local timestamp=$(date +"%Y-%m-%d %H:%M:%S")
  
  case $level in
    "INFO")
      echo -e "${BLUE}[INFO]${NC} $timestamp - $message"
      ;;
    "SUCCESS")
      echo -e "${GREEN}[SUCCESS]${NC} $timestamp - $message"
      ;;
    "WARNING")
      echo -e "${YELLOW}[WARNING]${NC} $timestamp - $message"
      ;;
    "ERROR")
      echo -e "${RED}[ERROR]${NC} $timestamp - $message"
      ;;
    *)
      echo -e "$timestamp - $message"
      ;;
  esac
  
  # Registrar também em arquivo de log
  echo "[$level] $timestamp - $message" >> /var/log/fitness360-rollback.log
}

# Função para verificar a saúde dos serviços
check_health() {
  log "INFO" "Verificando saúde dos serviços..."
  
  # Se existe um script específico de verificação de saúde, usar ele
  if [ -f "$HEALTH_CHECK_SCRIPT" ] && [ -x "$HEALTH_CHECK_SCRIPT" ]; then
    log "INFO" "Executando script de healthcheck: $HEALTH_CHECK_SCRIPT"
    if "$HEALTH_CHECK_SCRIPT"; then
      log "SUCCESS" "Verificação de saúde concluída com sucesso"
      return 0
    else
      log "ERROR" "Verificação de saúde falhou"
      return 1
    fi
  else
    # Verificação básica dos endpoints
    log "INFO" "Utilizando verificação básica de saúde através de HTTP"
    
    local response
    response=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_CHECK_URL")
    
    if [ "$response" == "200" ]; then
      log "SUCCESS" "Verificação de saúde concluída com sucesso (HTTP $response)"
      return 0
    else
      log "ERROR" "Verificação de saúde falhou (HTTP $response)"
      return 1
    fi
  fi
}

# Função para obter o último backup disponível
get_latest_backup() {
  log "INFO" "Buscando o backup mais recente..."
  
  # Primeiro verifica se existe backup localmente
  local latest_local
  latest_local=$(ls -t "${BACKUP_DIR}"/*pre_deploy*.tar.gz 2>/dev/null | head -n 1)
  
  if [ -n "$latest_local" ] && [ -f "$latest_local" ]; then
    log "INFO" "Backup local encontrado: $latest_local"
    echo "$latest_local"
    return 0
  fi
  
  # Se não houver backup local, procura no S3
  if command -v aws &> /dev/null; then
    log "INFO" "Buscando backup no S3..."
    local latest_s3
    latest_s3=$(aws s3 ls "s3://${S3_BUCKET}/pre-deploy-backups/" | sort | tail -n 1 | awk '{print $4}')
    
    if [ -n "$latest_s3" ]; then
      log "INFO" "Backup encontrado no S3: $latest_s3"
      local download_path="${BACKUP_DIR}/${latest_s3}"
      
      # Criar diretório se não existir
      mkdir -p "$BACKUP_DIR"
      
      # Baixar o arquivo
      aws s3 cp "s3://${S3_BUCKET}/pre-deploy-backups/${latest_s3}" "$download_path"
      
      if [ -f "$download_path" ]; then
        log "SUCCESS" "Backup baixado com sucesso: $download_path"
        echo "$download_path"
        return 0
      else
        log "ERROR" "Falha ao baixar backup do S3"
        return 1
      fi
    else
      log "ERROR" "Nenhum backup encontrado no S3"
      return 1
    fi
  else
    log "ERROR" "AWS CLI não encontrado e nenhum backup local disponível"
    return 1
  fi
}

# Função para realizar o rollback
perform_rollback() {
  local backup_file="$1"
  
  if [ -z "$backup_file" ] || [ ! -f "$backup_file" ]; then
    log "ERROR" "Arquivo de backup inválido: $backup_file"
    return 1
  fi
  
  log "INFO" "Iniciando procedimento de rollback usando: $backup_file"
  
  # Criar diretório temporário para extração
  local temp_dir
  temp_dir=$(mktemp -d)
  log "INFO" "Criando diretório temporário: $temp_dir"
  
  # Extrair backup
  log "INFO" "Extraindo backup..."
  tar -xzf "$backup_file" -C "$temp_dir"
  
  if [ $? -ne 0 ]; then
    log "ERROR" "Falha ao extrair backup"
    rm -rf "$temp_dir"
    return 1
  fi
  
  # Diretório extraído (baseado no nome do arquivo sem extensão)
  local extract_name
  extract_name=$(basename "$backup_file" .tar.gz)
  local extract_dir="${temp_dir}/${extract_name}"
  
  if [ ! -d "$extract_dir" ]; then
    log "ERROR" "Diretório extraído não encontrado: $extract_dir"
    rm -rf "$temp_dir"
    return 1
  fi
  
  # Parar os contêineres atuais
  log "INFO" "Parando serviços atuais..."
  cd "$(dirname "$DOCKER_COMPOSE_FILE")" || {
    log "ERROR" "Não foi possível acessar o diretório do docker-compose"
    rm -rf "$temp_dir"
    return 1
  }
  
  docker compose down
  
  # Copiar arquivos de configuração
  log "INFO" "Restaurando arquivos de configuração..."
  cp -f "${extract_dir}/docker-compose.yml" "$DOCKER_COMPOSE_FILE"
  cp -f "${extract_dir}/.env" "$ENV_FILE"
  
  if [ -d "${extract_dir}/config" ]; then
    log "INFO" "Restaurando diretório de configuração..."
    cp -rf "${extract_dir}/config" "$(dirname "$CONFIG_DIR")"
  fi
  
  # Iniciar os serviços novamente
  log "INFO" "Iniciando serviços com a configuração anterior..."
  docker compose up -d
  
  # Limpar diretório temporário
  log "INFO" "Limpando arquivos temporários..."
  rm -rf "$temp_dir"
  
  # Registrar ação de rollback no marker
  echo "ROLLBACK_TIMESTAMP=$(date +"%Y%m%d%H%M%S")" > "$DEPLOY_MARKER"
  echo "ROLLBACK_BACKUP=$(basename "$backup_file")" >> "$DEPLOY_MARKER"
  
  log "SUCCESS" "Rollback concluído com sucesso"
  return 0
}

# Função para enviar notificação
notify() {
  local status="$1"
  local message="$2"
  
  # Enviar para Slack se SLACK_WEBHOOK_URL estiver definido
  if [ -n "${SLACK_WEBHOOK_URL}" ]; then
    log "INFO" "Enviando notificação para o Slack..."
    
    local emoji
    if [ "$status" == "success" ]; then
      emoji="✅"
    else
      emoji="❌"
    fi
    
    curl -s -X POST -H 'Content-type: application/json' \
      --data "{\"text\":\"${emoji} FITNESS 360: $message\"}" \
      "${SLACK_WEBHOOK_URL}" > /dev/null
  fi
  
  # Enviar e-mail se AWS CLI estiver disponível
  if command -v aws &> /dev/null && [ -n "${ALERT_EMAIL}" ]; then
    log "INFO" "Enviando notificação por e-mail para ${ALERT_EMAIL}..."
    
    local subject
    if [ "$status" == "success" ]; then
      subject="✅ FITNESS 360: Rollback executado com sucesso"
    else
      subject="❌ FITNESS 360: Falha no rollback"
    fi
    
    aws ses send-email \
      --from "alerts@fitness360.com.br" \
      --to "${ALERT_EMAIL}" \
      --subject "${subject}" \
      --text "${message}" > /dev/null
  fi
}

# Função principal
main() {
  log "INFO" "Iniciando verificação pós-implantação..."
  
  # Criar flag para controlar se já houve rollback
  local rollback_attempted=false
  
  # Tentar verificação de saúde várias vezes antes de decidir pelo rollback
  for (( i=1; i<=$MAX_ATTEMPTS; i++ )); do
    log "INFO" "Tentativa $i de $MAX_ATTEMPTS para verificação de saúde"
    
    if check_health; then
      log "SUCCESS" "Serviços estão saudáveis na tentativa $i. Nenhum rollback necessário."
      notify "success" "Verificação pós-deploy concluída com sucesso. Serviços saudáveis."
      return 0
    else
      log "WARNING" "Serviços não estão saudáveis na tentativa $i"
      
      if [ $i -lt $MAX_ATTEMPTS ]; then
        log "INFO" "Aguardando $ATTEMPT_DELAY segundos antes da próxima tentativa..."
        sleep $ATTEMPT_DELAY
      fi
    fi
  done
  
  # Se chegou aqui, todas as tentativas falharam
  log "ERROR" "Todas as $MAX_ATTEMPTS tentativas de verificação de saúde falharam"
  
  # Verificar se já houve rollback anterior recente (últimas 24h)
  if [ -f "$DEPLOY_MARKER" ] && grep -q "ROLLBACK_TIMESTAMP" "$DEPLOY_MARKER"; then
    local last_rollback
    last_rollback=$(grep "ROLLBACK_TIMESTAMP" "$DEPLOY_MARKER" | cut -d'=' -f2)
    local now
    now=$(date +"%Y%m%d%H%M%S")
    local elapsed=$((now - last_rollback))
    
    # Se o último rollback foi há menos de 24h (86400 segundos)
    if [ $elapsed -lt 86400 ]; then
      log "WARNING" "Já houve um rollback nas últimas 24 horas. Não será tentado novamente automaticamente."
      notify "error" "Verificação de saúde falhou após deploy, mas não será feito rollback automático pois já houve um nas últimas 24h. ATENÇÃO: Necessária intervenção manual!"
      return 1
    fi
  fi
  
  # Recuperar último backup disponível para rollback
  local backup_file
  backup_file=$(get_latest_backup)
  
  if [ -z "$backup_file" ] || [ ! -f "$backup_file" ]; then
    log "ERROR" "Não foi possível encontrar um backup válido para rollback"
    notify "error" "Falha na verificação de saúde após deploy e nenhum backup disponível para rollback. ATENÇÃO: Necessária intervenção manual!"
    return 1
  fi
  
  # Realizar o rollback
  log "INFO" "Iniciando procedimento de rollback automático..."
  if perform_rollback "$backup_file"; then
    # Verificar novamente a saúde após o rollback
    log "INFO" "Verificando saúde após rollback..."
    sleep 30 # Aguardar serviços estabilizarem
    
    if check_health; then
      log "SUCCESS" "Rollback concluído com sucesso e serviços estão saudáveis"
      notify "success" "Rollback automático concluído com sucesso. Serviços restaurados e saudáveis."
      return 0
    else
      log "ERROR" "Rollback concluído, mas serviços ainda não estão saudáveis"
      notify "error" "Rollback automático concluído, mas serviços ainda apresentam problemas. ATENÇÃO: Necessária intervenção manual!"
      return 1
    fi
  else
    log "ERROR" "Falha no procedimento de rollback"
    notify "error" "Falha crítica no processo de rollback automático. ATENÇÃO: Necessária intervenção manual URGENTE!"
    return 1
  fi
}

# Executar a função principal
main
exit $? 