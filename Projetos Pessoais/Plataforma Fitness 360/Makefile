.PHONY: setup infra up down restart logs clean frontend-aluno frontend-staff auth-api members-api all-apis reset-all help status update healthcheck test-integration monitoring monitoring-setup monitoring-up monitoring-down monitoring-exporters monitoring-dashboard docs beta-env beta-launch beta-healthcheck

# Configurações
SHELL := /bin/bash
MAKEFILE_PATH := $(abspath $(lastword $(MAKEFILE_LIST)))
PROJECT_DIR := $(dir $(MAKEFILE_PATH))

help:
	@echo "╔══════════════════════════════════════════════╗"
	@echo "║             PLATAFORMA FITNESS 360           ║"
	@echo "╚══════════════════════════════════════════════╝"
	@echo ""
	@echo "Comandos disponíveis:"
	@echo "  make setup         - Configura o ambiente inicial (requer apenas uma vez)"
	@echo "  make infra         - Inicia apenas a infraestrutura (bancos, Kafka, Redis)"
	@echo "  make up            - Inicia todo o ambiente (infraestrutura + APIs)"
	@echo "  make down          - Para todos os contêineres"
	@echo "  make restart       - Reinicia todos os contêineres"
	@echo "  make logs [svc=X]  - Mostra logs (ex: make logs svc=auth-svc)"
	@echo "  make status        - Verifica status dos serviços"
	@echo "  make healthcheck   - Executa verificação de saúde completa"
	@echo "  make test-integration - Executa testes de integração entre serviços"
	@echo ""
	@echo "Iniciar componentes individuais:"
	@echo "  make frontend-aluno - Inicia o frontend do aluno"
	@echo "  make frontend-staff - Inicia o frontend do staff"
	@echo "  make auth-api       - Inicia apenas o serviço de autenticação"
	@echo "  make members-api    - Inicia apenas o serviço de membros"
	@echo "  make all-apis       - Inicia todos os serviços de API"
	@echo ""
	@echo "Ambiente Beta:"
	@echo "  make beta-env       - Configura ambiente beta para testes"
	@echo "  make beta-launch [grupo=X] - Lança recursos beta para um grupo específico"
	@echo "                      (grupo=grupo-a|grupo-b|grupo-c|grupo-d|all)"
	@echo "  make beta-healthcheck - Verifica a saúde do ambiente beta"
	@echo ""
	@echo "Monitoramento:"
	@echo "  make monitoring     - Configura e inicia todo o sistema de monitoramento"
	@echo "  make monitoring-up  - Inicia apenas os serviços de monitoramento"
	@echo "  make monitoring-down - Para os serviços de monitoramento"
	@echo ""
	@echo "Manutenção:"
	@echo "  make clean         - Remove todos os contêineres e volumes"
	@echo "  make update        - Atualiza as dependências"
	@echo "  make reset-all     - Reset completo (remove + recria)"
	@echo "  make docs          - Gera documentação atualizada da plataforma"

setup:
	@echo "🔧 Configurando ambiente inicial..."
	@chmod +x $(PROJECT_DIR)/scripts/podman-up.sh
	@chmod +x $(PROJECT_DIR)/scripts/start-microservices.sh
	@chmod +x $(PROJECT_DIR)/scripts/healthcheck.sh
	@chmod +x $(PROJECT_DIR)/scripts/update-dependencies.sh
	@chmod +x $(PROJECT_DIR)/scripts/test-integration.sh
	@chmod +x $(PROJECT_DIR)/scripts/setup-monitoring.sh
	@chmod +x $(PROJECT_DIR)/scripts/start-monitoring-exporters.sh
	@chmod +x $(PROJECT_DIR)/scripts/setup-beta-env.sh
	@chmod +x $(PROJECT_DIR)/scripts/launch-beta-group.sh
	@chmod +x $(PROJECT_DIR)/scripts/beta-healthcheck.sh
	@pnpm install
	@podman network exists fitness360-network || podman network create fitness360-network
	@mkdir -p ~/.local/share/containers/storage/volumes/{auth_postgres_data,members_postgres_data,billing_postgres_data,feedback_postgres_data,kafka_data,zookeeper_data,redis_data}
	@echo "✅ Ambiente configurado!"

infra:
	@echo "🚀 Iniciando infraestrutura..."
	@bash $(PROJECT_DIR)/scripts/podman-up.sh

up: infra
	@echo "🚀 Iniciando todas as APIs..."
	@bash $(PROJECT_DIR)/scripts/start-microservices.sh

down:
	@echo "🛑 Parando todos os contêineres..."
	@podman-compose -f $(PROJECT_DIR)/podman-compose.yml down || true
	@podman stop $(shell podman ps -a -q --filter "name=fitness360-*") 2>/dev/null || true
	@podman stop auth-svc members-svc billing-svc feedback-svc 2>/dev/null || true
	@echo "✅ Todos os contêineres parados!"

restart: down up

logs:
	@if [ -z "$(svc)" ]; then \
		echo "Informe o serviço para visualizar os logs: make logs svc=auth-svc"; \
	else \
		podman logs -f $(svc); \
	fi

clean: down
	@echo "🧹 Limpando ambiente..."
	@podman rm $(shell podman ps -a -q --filter "name=fitness360-*") 2>/dev/null || true
	@podman rm auth-svc members-svc billing-svc feedback-svc 2>/dev/null || true
	@podman rm prometheus grafana alertmanager node-exporter cadvisor kafka-exporter 2>/dev/null || true
	@podman volume rm $(shell podman volume ls -q --filter "name=fitness360-*") 2>/dev/null || true
	@echo "✅ Ambiente limpo!"

status:
	@echo "📊 Status dos serviços:"
	@echo "=========================="
	@echo "🔵 Infraestrutura:"
	@podman ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" --filter "name=fitness360-*" || true
	@echo ""
	@echo "🔵 Microsserviços:"
	@podman ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" --filter "name=auth-svc" || true
	@podman ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" --filter "name=members-svc" || true
	@podman ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" --filter "name=billing-svc" || true
	@podman ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" --filter "name=feedback-svc" || true
	@echo ""
	@echo "🔵 Monitoramento:"
	@podman ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" --filter "name=prometheus" || true
	@podman ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" --filter "name=grafana" || true
	@podman ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" --filter "name=alertmanager" || true
	@podman ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" --filter "name=node-exporter" || true

healthcheck:
	@echo "🩺 Verificando saúde da plataforma..."
	@bash $(PROJECT_DIR)/scripts/healthcheck.sh

test-integration:
	@echo "🧪 Executando testes de integração..."
	@bash $(PROJECT_DIR)/scripts/test-integration.sh

frontend-aluno:
	@echo "🚀 Iniciando frontend do aluno..."
	@cd $(PROJECT_DIR)/frontend/app-aluno && pnpm dev

frontend-staff:
	@echo "🚀 Iniciando frontend do staff..."
	@cd $(PROJECT_DIR)/frontend/app-staff && pnpm dev

auth-api:
	@echo "🚀 Iniciando serviço de autenticação..."
	@cd $(PROJECT_DIR) && bash scripts/start-microservices.sh auth-svc

members-api:
	@echo "🚀 Iniciando serviço de membros..."
	@cd $(PROJECT_DIR) && bash scripts/start-microservices.sh members-svc

all-apis:
	@echo "🚀 Iniciando todos os serviços de API..."
	@cd $(PROJECT_DIR) && bash scripts/start-microservices.sh

update:
	@echo "🔄 Atualizando dependências..."
	@bash $(PROJECT_DIR)/scripts/update-dependencies.sh

reset-all: clean setup up
	@echo "✅ Ambiente completamente reiniciado!"

docs:
	@echo "📚 Gerando documentação atualizada..."
	@if [ ! -d "$(PROJECT_DIR)/docs/api" ]; then \
		mkdir -p $(PROJECT_DIR)/docs/api; \
	fi
	@echo "✅ Gerando documentação de API..."
	@for service in auth-svc members-svc billing-svc feedback-svc; do \
		if [ -d "$(PROJECT_DIR)/backend/$$service" ]; then \
			cd $(PROJECT_DIR)/backend/$$service && \
			if grep -q "\"compodoc\"" "package.json"; then \
				echo "Gerando documentação para $$service"; \
				pnpm compodoc -p tsconfig.json -d ../../docs/api/$$service; \
			else \
				echo "Pulando $$service (compodoc não configurado)"; \
			fi; \
		fi; \
	done
	@echo "✅ Documentação gerada com sucesso!"
	@echo "📖 Abra a documentação em seu navegador:"
	@echo "  - API Auth: file://$(PROJECT_DIR)/docs/api/auth-svc/index.html"
	@echo "  - API Members: file://$(PROJECT_DIR)/docs/api/members-svc/index.html"
	@echo "  - Exemplos de Monitoramento: $(PROJECT_DIR)/docs/examples/monitoring"

# Comandos para monitoramento
monitoring-setup:
	@echo "🔧 Configurando sistema de monitoramento..."
	@bash $(PROJECT_DIR)/scripts/setup-monitoring.sh
	@echo "✅ Sistema de monitoramento configurado!"

monitoring-up:
	@echo "🚀 Iniciando serviços de monitoramento..."
	@podman run -d --name prometheus \
		--network fitness360-network \
		-p 9090:9090 \
		-v $(PROJECT_DIR)/prometheus/config:/etc/prometheus \
		-v $(PROJECT_DIR)/prometheus/data:/prometheus \
		prom/prometheus:latest
	@podman run -d --name grafana \
		--network fitness360-network \
		-p 3000:3000 \
		-v $(PROJECT_DIR)/grafana/config:/etc/grafana \
		-v $(PROJECT_DIR)/grafana/dashboards:/var/lib/grafana/dashboards \
		-v $(PROJECT_DIR)/grafana/data:/var/lib/grafana/data \
		grafana/grafana:latest
	@podman run -d --name alertmanager \
		--network fitness360-network \
		-p 9093:9093 \
		-v $(PROJECT_DIR)/alertmanager/config:/etc/alertmanager \
		-v $(PROJECT_DIR)/alertmanager/data:/alertmanager \
		prom/alertmanager:latest
	@echo "✅ Serviços de monitoramento iniciados!"

monitoring-exporters:
	@echo "🚀 Iniciando exporters para monitoramento..."
	@bash $(PROJECT_DIR)/scripts/start-monitoring-exporters.sh
	@echo "✅ Exporters iniciados!"

monitoring-down:
	@echo "🛑 Parando serviços de monitoramento..."
	@podman stop prometheus grafana alertmanager node-exporter cadvisor kafka-exporter || true
	@podman rm prometheus grafana alertmanager node-exporter cadvisor kafka-exporter || true
	@echo "✅ Serviços de monitoramento parados!"

monitoring-dashboard:
	@echo "🔗 Abrindo dashboard do Grafana no navegador..."
	@xdg-open http://localhost:3000 || open http://localhost:3000 || echo "Abra manualmente: http://localhost:3000"

monitoring: monitoring-setup monitoring-up monitoring-exporters
	@echo "✅ Monitoramento completo configurado e iniciado!"

# Comandos para ambiente beta
beta-env:
	@echo "🧪 Configurando ambiente beta..."
	@if [ ! -x "$(PROJECT_DIR)/scripts/setup-beta-env.sh" ]; then \
		chmod +x $(PROJECT_DIR)/scripts/setup-beta-env.sh; \
	fi
	@sudo $(PROJECT_DIR)/scripts/setup-beta-env.sh
	@echo "✅ Ambiente beta configurado com sucesso!"

beta-launch:
	@echo "🚀 Lançando recursos beta para grupo específico..."
	@if [ -z "$(grupo)" ]; then \
		echo "❌ Erro: Grupo não especificado"; \
		echo "Uso: make beta-launch grupo=GRUPO"; \
		echo "Grupos disponíveis: grupo-a, grupo-b, grupo-c, grupo-d, all"; \
		exit 1; \
	fi
	@if [ ! -x "$(PROJECT_DIR)/scripts/launch-beta-group.sh" ]; then \
		chmod +x $(PROJECT_DIR)/scripts/launch-beta-group.sh; \
	fi
	@$(PROJECT_DIR)/scripts/launch-beta-group.sh $(grupo)
	@echo "✅ Recursos beta lançados para o grupo $(grupo)!"

beta-healthcheck:
	@echo "🩺 Verificando saúde do ambiente beta..."
	@if [ ! -x "./scripts/beta-healthcheck.sh" ]; then \
		chmod +x ./scripts/beta-healthcheck.sh; \
	fi
	@./scripts/beta-healthcheck.sh
	@echo "✅ Verificação de saúde do ambiente beta concluída!" 