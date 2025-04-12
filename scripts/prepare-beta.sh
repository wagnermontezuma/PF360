#!/bin/bash

echo "🚀 Preparando ambiente beta da Plataforma Fitness 360..."

# Verifica Node.js e pnpm
echo "📦 Verificando dependências..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale o Node.js 18 ou superior."
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm não encontrado. Por favor, instale o pnpm 8 ou superior."
    exit 1
fi

# Limpa caches e módulos
echo "🧹 Limpando caches..."
rm -rf frontend/app-aluno/.next
rm -rf frontend/app-aluno/node_modules
rm -rf node_modules

# Instala dependências
echo "📥 Instalando dependências..."
pnpm install

# Build do projeto
echo "🛠️ Construindo projeto..."
pnpm build

# Testes
echo "🧪 Executando testes..."
pnpm test

# Lint
echo "✨ Verificando código..."
pnpm lint

# Cria diretório de logs
echo "📝 Configurando logs..."
mkdir -p logs

echo "✅ Ambiente beta preparado!"
echo "Para iniciar o servidor de desenvolvimento, execute: pnpm dev"
echo "Para iniciar em produção, execute: pnpm start" 