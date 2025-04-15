#!/bin/bash

# Script de verificação de saúde do Ambiente Beta da Plataforma Fitness 360
# Este script verifica todos os componentes críticos e serviços do ambiente beta

# Configurações
LOG_FILE="/tmp/fitness360-beta-healthcheck-$(date +%Y%m%d-%H%M%S).log"
TIMEOUT=5  # Timeout para requisições em segundos
REQUIRED_SERVICES=("auth-svc" "members-svc" "billing-svc" "feedback-svc" "training-svc" "nutrition-svc")
INFRA_SERVICES=("fitness360-postgres" "fitness360-redis" "fitness360-kafka" "fitness360-zookeeper")
MAX_ERRORS=0  # Contador de erros encontrados

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # Sem cor

# Funções de utilidade
log() {
  local message="$1"
  local level="${2:-INFO}"
  local timestamp=$(date +"%Y-%m-%d %H:%M:%S")
  echo -e "${timestamp} [${level}] ${message}" | tee -a "${LOG_FILE}"
}

check_success() {
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ OK${NC}"
  else
    echo -e "${RED}✗ FALHA${NC}"
    ((MAX_ERRORS++))
  fi
}

# Inicializa log
echo "Iniciando verificação de saúde do Ambiente Beta da Plataforma Fitness 360" > "${LOG_FILE}"
log "Iniciando verificação em $(date)"
echo -e "${BLUE}=== Verificação de Saúde do Ambiente Beta da Plataforma Fitness 360 ===${NC}"
echo

# 1. Verificar contêineres em execução
echo -e "${BLUE}[1/7] Verificando contêineres em execução...${NC}"
log "Verificando contêineres em execução" "CHECK"

# Verificar infraestrutura
for service in "${INFRA_SERVICES[@]}"; do
  echo -n "  - Infraestrutura: ${service} "
  if podman ps --format "{{.Names}}" | grep -q "${service}"; then
    echo -e "${GREEN}✓ OK${NC}"
    log "Infraestrutura: ${service} está em execução" "PASS"
  else
    echo -e "${RED}✗ FALHA${NC}"
    log "Infraestrutura: ${service} não está em execução" "FAIL"
    ((MAX_ERRORS++))
  fi
done

# Verificar microsserviços
for service in "${REQUIRED_SERVICES[@]}"; do
  echo -n "  - Microsserviço: ${service} "
  if podman ps --format "{{.Names}}" | grep -q "${service}" && podman inspect ${service} --format "{{.Config.Labels.environment}}" | grep -q "beta"; then
    echo -e "${GREEN}✓ OK${NC}"
    log "Microsserviço beta: ${service} está em execução" "PASS"
  else
    echo -e "${RED}✗ FALHA${NC}"
    log "Microsserviço beta: ${service} não está em execução" "FAIL"
    ((MAX_ERRORS++))
  fi
done
echo

# 2. Verificar conectividade de rede entre serviços
echo -e "${BLUE}[2/7] Verificando conectividade de rede...${NC}"
log "Verificando conectividade de rede entre serviços" "CHECK"

# Verificar se os serviços principais conseguem se conectar ao DB
for service in "${REQUIRED_SERVICES[@]}"; do
  echo -n "  - Conectividade ${service} -> Postgres "
  if podman exec -it ${service} curl -s --connect-timeout ${TIMEOUT} http://fitness360-postgres:5432 &> /dev/null; then
    echo -e "${GREEN}✓ OK${NC}"
    log "Conectividade ${service} -> Postgres OK" "PASS"
  else
    echo -e "${YELLOW}? ALERTA${NC} (Não foi possível validar diretamente)"
    log "Não foi possível verificar conectividade ${service} -> Postgres" "WARN"
  fi
done

# Verificar conectividade dos serviços ao Redis
echo -n "  - Conectividade auth-svc -> Redis "
if podman exec -it auth-svc curl -s --connect-timeout ${TIMEOUT} http://fitness360-redis:6379 &> /dev/null; then
  echo -e "${GREEN}✓ OK${NC}"
  log "Conectividade auth-svc -> Redis OK" "PASS"
else
  echo -e "${YELLOW}? ALERTA${NC} (Não foi possível validar diretamente)"
  log "Não foi possível verificar conectividade auth-svc -> Redis" "WARN"
fi
echo

# 3. Verificar health checks dos serviços via HTTP
echo -e "${BLUE}[3/7] Verificando endpoints de health check...${NC}"
log "Verificando endpoints de health check dos microsserviços beta" "CHECK"

# Mapear endpoints de health para cada serviço
declare -A health_endpoints
health_endpoints["auth-svc"]="http://localhost:3001/health"
health_endpoints["members-svc"]="http://localhost:3003/health"
health_endpoints["billing-svc"]="http://localhost:3004/health"
health_endpoints["feedback-svc"]="http://localhost:3005/health"
health_endpoints["training-svc"]="http://localhost:3007/health"
health_endpoints["nutrition-svc"]="http://localhost:3008/health"

for service in "${!health_endpoints[@]}"; do
  endpoint="${health_endpoints[$service]}"
  echo -n "  - Health check ${service}: ${endpoint} "
  
  # Adicionar curl com retry para maior resiliência
  health_status=$(curl -s -f -m ${TIMEOUT} --retry 2 --retry-delay 1 "${endpoint}" || echo "FAIL")
  
  if [[ "${health_status}" == *"FAIL"* ]]; then
    echo -e "${RED}✗ FALHA${NC}"
    log "Health check ${service} falhou: ${endpoint}" "FAIL"
    ((MAX_ERRORS++))
  elif [[ "${health_status}" == *"ok"* ]] || [[ "${health_status}" == *"status"*":"*"up"* ]]; then
    echo -e "${GREEN}✓ OK${NC}"
    log "Health check ${service} OK: ${endpoint}" "PASS"
  else
    echo -e "${YELLOW}⚠ ALERTA${NC} (Resposta inesperada)"
    log "Health check ${service} com resposta inesperada: ${health_status}" "WARN"
  fi
done
echo

# 4. Verificar indicadores de recursos do sistema
echo -e "${BLUE}[4/7] Verificando recursos do sistema...${NC}"
log "Verificando recursos do sistema host" "CHECK"

# Verificação de CPU
echo -n "  - Utilização de CPU "
cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2 + $4}')
if (( $(echo "${cpu_usage} > 80" | bc -l) )); then
  echo -e "${RED}⚠ ALERTA (${cpu_usage}%)${NC}"
  log "Alta utilização de CPU: ${cpu_usage}%" "WARN"
else
  echo -e "${GREEN}✓ OK (${cpu_usage}%)${NC}"
  log "Utilização de CPU normal: ${cpu_usage}%" "PASS"
fi

# Verificação de memória
echo -n "  - Utilização de memória "
mem_available=$(free -m | awk '/^Mem:/{print $7}')
mem_total=$(free -m | awk '/^Mem:/{print $2}')
mem_usage=$(echo "scale=2; (${mem_total}-${mem_available})/${mem_total}*100" | bc | awk '{printf "%.1f", $0}')

if (( $(echo "${mem_usage} > 80" | bc -l) )); then
  echo -e "${RED}⚠ ALERTA (${mem_usage}%)${NC}"
  log "Alta utilização de memória: ${mem_usage}%" "WARN"
else
  echo -e "${GREEN}✓ OK (${mem_usage}%)${NC}"
  log "Utilização de memória normal: ${mem_usage}%" "PASS"
fi

# Verificação de disco
echo -n "  - Espaço em disco (/) "
disk_usage=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')

if [ "${disk_usage}" -gt 80 ]; then
  echo -e "${RED}⚠ ALERTA (${disk_usage}%)${NC}"
  log "Pouco espaço em disco: ${disk_usage}%" "WARN"
else
  echo -e "${GREEN}✓ OK (${disk_usage}%)${NC}"
  log "Espaço em disco adequado: ${disk_usage}%" "PASS"
fi
echo

# 5. Verificar conexões com bancos de dados
echo -e "${BLUE}[5/7] Verificando conexões com bancos de dados beta...${NC}"
log "Verificando conexões com bancos de dados beta" "CHECK"

# Verificar bancos de dados beta
beta_databases=("auth360_beta" "members360_beta" "billing360_beta" "feedback360_beta" "training360_beta" "nutrition360_beta")

for db in "${beta_databases[@]}"; do
  echo -n "  - Banco de dados: ${db} "
  if podman exec fitness360-postgres psql -U postgres -lqt | grep -q "${db}"; then
    echo -e "${GREEN}✓ OK${NC}"
    log "Banco de dados ${db} existe" "PASS"
  else
    echo -e "${RED}✗ FALHA${NC}"
    log "Banco de dados ${db} não encontrado" "FAIL"
    ((MAX_ERRORS++))
  fi
done

# Verificar conexão com Redis
echo -n "  - Conexão com Redis "
if podman exec fitness360-redis redis-cli ping | grep -q "PONG"; then
  echo -e "${GREEN}✓ OK${NC}"
  log "Conexão com Redis OK" "PASS"
else
  echo -e "${RED}✗ FALHA${NC}"
  log "Falha na conexão com Redis" "FAIL"
  ((MAX_ERRORS++))
fi

# Verificar conexão com Kafka e tópicos beta
echo -n "  - Tópicos Kafka beta "
kafka_topics=$(podman exec fitness360-kafka kafka-topics.sh --list --bootstrap-server localhost:9092 2>/dev/null | grep -i "beta")
if [ $? -eq 0 ] && [ -n "$kafka_topics" ]; then
  echo -e "${GREEN}✓ OK${NC}"
  log "Conexão com Kafka OK, tópicos beta disponíveis" "PASS"
else
  echo -e "${YELLOW}⚠ ALERTA${NC} (Sem tópicos beta específicos)"
  log "Sem tópicos beta específicos em Kafka" "WARN"
fi
echo

# 6. Verificar métricas via Prometheus beta
echo -e "${BLUE}[6/7] Verificando métricas beta via Prometheus...${NC}"
log "Verificando se o Prometheus beta está disponível e coletando métricas" "CHECK"

echo -n "  - Serviço Prometheus para beta "
if podman ps --format "{{.Names}}" | grep -q "prometheus-beta"; then
  echo -e "${GREEN}✓ OK${NC}"
  log "Serviço Prometheus beta está em execução" "PASS"
  
  # Verificar targets no Prometheus beta
  echo -n "  - Targets Prometheus beta "
  prom_targets=$(curl -s http://localhost:9091/api/v1/targets | grep "health=\"up\"" | wc -l)
  
  if [ "${prom_targets}" -gt 0 ]; then
    echo -e "${GREEN}✓ OK (${prom_targets} targets ativos)${NC}"
    log "Prometheus beta tem ${prom_targets} targets ativos" "PASS"
  else
    echo -e "${YELLOW}⚠ ALERTA (nenhum target ativo)${NC}"
    log "Prometheus beta não tem targets ativos" "WARN"
  fi
else
  echo -e "${RED}✗ FALHA${NC}"
  log "Serviço Prometheus beta não está em execução" "FAIL"
  ((MAX_ERRORS++))
fi
echo

# 7. Verificar frontend beta
echo -e "${BLUE}[7/7] Verificando frontends beta...${NC}"
log "Verificando se os frontends beta estão operacionais" "CHECK"

# Verificar frontend dos alunos
echo -n "  - Frontend aluno beta (beta.fitness360.com.br) "
if curl -s -k --max-time 5 https://beta.fitness360.com.br/api/health 2>&1 | grep -q "ok"; then
  echo -e "${GREEN}✓ OK${NC}"
  log "Frontend aluno beta OK" "PASS"
else
  echo -e "${YELLOW}⚠ ALERTA${NC} (Não pode ser acessado diretamente)"
  log "Não foi possível verificar frontend aluno beta diretamente" "WARN"
fi

# Verificar frontend do staff
echo -n "  - Frontend staff beta (staff-beta.fitness360.com.br) "
if curl -s -k --max-time 5 https://staff-beta.fitness360.com.br/api/health 2>&1 | grep -q "ok"; then
  echo -e "${GREEN}✓ OK${NC}"
  log "Frontend staff beta OK" "PASS"
else
  echo -e "${YELLOW}⚠ ALERTA${NC} (Não pode ser acessado diretamente)"
  log "Não foi possível verificar frontend staff beta diretamente" "WARN"
fi

# Verificar se os processos do frontend beta estão em execução
echo -n "  - Processos frontend beta "
if ps aux | grep "pnpm start --env beta" | grep -v grep > /dev/null; then
  echo -e "${GREEN}✓ OK${NC}"
  log "Processos frontend beta em execução" "PASS"
else
  echo -e "${RED}✗ FALHA${NC}"
  log "Processos frontend beta não estão em execução" "FAIL"
  ((MAX_ERRORS++))
fi
echo

# Resumo
echo -e "${BLUE}=== Resumo da Verificação de Saúde do Ambiente Beta ===${NC}"
if [ ${MAX_ERRORS} -eq 0 ]; then
  echo -e "${GREEN}✅ Todos os sistemas beta estão operacionais!${NC}"
  log "Verificação de saúde beta concluída com sucesso. Todos os sistemas operacionais." "SUCCESS"
else
  echo -e "${RED}❌ Encontradas ${MAX_ERRORS} falhas no ambiente beta que precisam de atenção!${NC}"
  log "Verificação de saúde beta concluída com ${MAX_ERRORS} falhas." "ERROR"
fi
echo -e "Log detalhado salvo em: ${LOG_FILE}"

# Saída com código apropriado
exit ${MAX_ERRORS} 