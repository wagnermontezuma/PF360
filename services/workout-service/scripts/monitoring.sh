#!/bin/bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Função para exibir mensagens
print_message() {
    echo -e "${2}${1}${NC}"
}

# Função para verificar se o Docker está rodando
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_message "Docker não está rodando. Por favor, inicie o Docker primeiro." "$RED"
        exit 1
    fi
}

# Função para iniciar os serviços
start_monitoring() {
    print_message "Iniciando serviços de monitoramento..." "$YELLOW"
    docker-compose -f docker-compose.monitoring.yml up -d
    
    if [ $? -eq 0 ]; then
        print_message "\nServiços iniciados com sucesso!" "$GREEN"
        print_message "\nAcesse:" "$YELLOW"
        print_message "Prometheus: http://localhost:9090" "$GREEN"
        print_message "Grafana: http://localhost:3001" "$GREEN"
        print_message "\nCredenciais Grafana:" "$YELLOW"
        print_message "Usuário: admin" "$GREEN"
        print_message "Senha: admin123" "$GREEN"
    else
        print_message "\nErro ao iniciar os serviços." "$RED"
        exit 1
    fi
}

# Função para parar os serviços
stop_monitoring() {
    print_message "Parando serviços de monitoramento..." "$YELLOW"
    docker-compose -f docker-compose.monitoring.yml down
    
    if [ $? -eq 0 ]; then
        print_message "Serviços parados com sucesso!" "$GREEN"
    else
        print_message "Erro ao parar os serviços." "$RED"
        exit 1
    fi
}

# Função para reiniciar os serviços
restart_monitoring() {
    print_message "Reiniciando serviços de monitoramento..." "$YELLOW"
    stop_monitoring
    start_monitoring
}

# Função para exibir logs
show_logs() {
    print_message "Exibindo logs dos serviços..." "$YELLOW"
    docker-compose -f docker-compose.monitoring.yml logs -f
}

# Verificar se o Docker está rodando
check_docker

# Menu de opções
case "$1" in
    start)
        start_monitoring
        ;;
    stop)
        stop_monitoring
        ;;
    restart)
        restart_monitoring
        ;;
    logs)
        show_logs
        ;;
    *)
        print_message "Uso: $0 {start|stop|restart|logs}" "$YELLOW"
        exit 1
        ;;
esac

exit 0 