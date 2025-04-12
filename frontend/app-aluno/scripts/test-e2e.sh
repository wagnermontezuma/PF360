#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "🚀 Iniciando testes E2E..."

# Garante que o ambiente de teste está rodando
echo "📦 Verificando containers Docker..."
docker-compose ps | grep -q "fitness360_backend" || {
    echo "${RED}Backend não está rodando. Iniciando containers...${NC}"
    docker-compose up -d
    sleep 10
}

# Limpa relatórios anteriores
rm -rf playwright-report/* test-results/*

# Executa os testes
echo "🧪 Executando testes..."
cd frontend/app-aluno

# Instala dependências se necessário
npm install

# Executa testes em todos os browsers configurados
PLAYWRIGHT_HTML_REPORT=playwright-report npx playwright test --reporter=html

# Verifica resultado
if [ $? -eq 0 ]; then
    echo "${GREEN}✅ Todos os testes passaram!${NC}"
    echo "📊 Relatório disponível em: playwright-report/index.html"
else
    echo "${RED}❌ Alguns testes falharam${NC}"
    echo "📊 Verifique o relatório em: playwright-report/index.html"
    exit 1
fi 