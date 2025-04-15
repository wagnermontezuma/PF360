#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # Sem cor

echo -e "${YELLOW}╔════════════════════════════════════════╗${NC}"
echo -e "${YELLOW}║       PLATAFORMA FITNESS 360           ║${NC}"
echo -e "${YELLOW}║       Configuração Ambiente Beta       ║${NC}"
echo -e "${YELLOW}╚════════════════════════════════════════╝${NC}"

# Diretório base
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Verificar se o script está sendo executado como root
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}Este script precisa ser executado com privilégios de superusuário.${NC}"
  echo -e "${YELLOW}Por favor, execute com sudo:${NC} sudo $0"
  exit 1
fi

# Criar bancos de dados beta
echo -e "${BLUE}[1/7] Criando bancos de dados para ambiente beta...${NC}"
podman exec -it fitness360-postgres psql -U postgres -c "CREATE DATABASE auth360_beta;"
podman exec -it fitness360-postgres psql -U postgres -c "CREATE DATABASE members360_beta;"
podman exec -it fitness360-postgres psql -U postgres -c "CREATE DATABASE billing360_beta;"
podman exec -it fitness360-postgres psql -U postgres -c "CREATE DATABASE feedback360_beta;"
podman exec -it fitness360-postgres psql -U postgres -c "CREATE DATABASE training360_beta;"
podman exec -it fitness360-postgres psql -U postgres -c "CREATE DATABASE nutrition360_beta;"

echo -e "${BLUE}[2/7] Configurando variáveis de ambiente beta...${NC}"
# Criar arquivo .env.beta
cat > ${BASE_DIR}/.env.beta << EOL
# Ambiente Beta - Plataforma Fitness 360
NODE_ENV=beta
LOG_LEVEL=debug

# Serviços
AUTH_SERVICE_URL=http://auth-svc:3001
MEMBERS_SERVICE_URL=http://members-svc:3003
BILLING_SERVICE_URL=http://billing-svc:3004
FEEDBACK_SERVICE_URL=http://feedback-svc:3005
TRAINING_SERVICE_URL=http://training-svc:3007
NUTRITION_SERVICE_URL=http://nutrition-svc:3008

# Frontends
FRONTEND_URL=https://beta.fitness360.com.br
FRONTEND_STAFF_URL=https://staff-beta.fitness360.com.br

# Banco de Dados
AUTH_DB_URL=postgresql://fitness360:fitness360pass@fitness360-postgres:5432/auth360_beta?schema=public
MEMBERS_DB_URL=postgresql://fitness360:fitness360pass@fitness360-postgres:5432/members360_beta?schema=public
BILLING_DB_URL=postgresql://fitness360:fitness360pass@fitness360-postgres:5432/billing360_beta?schema=public
FEEDBACK_DB_URL=postgresql://fitness360:fitness360pass@fitness360-postgres:5432/feedback360_beta?schema=public
TRAINING_DB_URL=postgresql://fitness360:fitness360pass@fitness360-postgres:5432/training360_beta?schema=public
NUTRITION_DB_URL=postgresql://fitness360:fitness360pass@fitness360-postgres:5432/nutrition360_beta?schema=public

# Kafka e Redis
KAFKA_BROKERS=fitness360-kafka:9092
REDIS_HOST=fitness360-redis
REDIS_PORT=6379

# JWT
JWT_SECRET=beta_jwt_secret_key_more_secure_than_dev
JWT_EXPIRATION=1h
REFRESH_TOKEN_SECRET=beta_refresh_jwt_secret
REFRESH_TOKEN_EXPIRATION=7d

# Métricas e Monitoramento
METRICS_PREFIX=beta
PROMETHEUS_ENDPOINT=http://prometheus:9090
EOL

echo -e "${BLUE}[3/7] Configurando usuários beta de teste...${NC}"
# Script para criar usuários de teste no ambiente beta
cat > ${BASE_DIR}/scripts/create-beta-users.js << EOL
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.AUTH_DB_URL || 'postgresql://fitness360:fitness360pass@localhost:5432/auth360_beta?schema=public'
    }
  }
});

async function main() {
  console.log('Criando usuários de teste para beta...');
  
  // Senha padrão: BetaFitness@2023
  const hashedPassword = await bcrypt.hash('BetaFitness@2023', 10);
  
  // Criar usuários de teste (alunos)
  const students = [
    { email: 'aluno1@beta.fitness360.com.br', name: 'Beta Tester 1', role: 'STUDENT' },
    { email: 'aluno2@beta.fitness360.com.br', name: 'Beta Tester 2', role: 'STUDENT' },
    { email: 'aluno3@beta.fitness360.com.br', name: 'Beta Tester 3', role: 'STUDENT' },
  ];
  
  // Criar usuários de teste (profissionais)
  const staff = [
    { email: 'prof1@beta.fitness360.com.br', name: 'Professor Beta 1', role: 'INSTRUCTOR' },
    { email: 'admin@beta.fitness360.com.br', name: 'Admin Beta', role: 'ADMIN' },
  ];
  
  // Inserir alunos
  for (const student of students) {
    await prisma.user.upsert({
      where: { email: student.email },
      update: {},
      create: {
        email: student.email,
        name: student.name,
        password: hashedPassword,
        role: student.role,
        emailVerified: true
      }
    });
  }
  
  // Inserir profissionais
  for (const staffMember of staff) {
    await prisma.user.upsert({
      where: { email: staffMember.email },
      update: {},
      create: {
        email: staffMember.email,
        name: staffMember.name,
        password: hashedPassword,
        role: staffMember.role,
        emailVerified: true
      }
    });
  }
  
  console.log('Usuários beta criados com sucesso!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
EOL

echo -e "${BLUE}[4/7] Aplicando migrações aos bancos de dados beta...${NC}"
# Executar migrações Prisma para cada serviço
for service in auth members billing feedback training nutrition; do
  if [ -d "${BASE_DIR}/backend/${service}-svc/prisma" ]; then
    echo -e "Aplicando migrações para ${service}-svc..."
    cd "${BASE_DIR}/backend/${service}-svc"
    
    # Configurar variável de ambiente para banco beta
    export DATABASE_URL="postgresql://fitness360:fitness360pass@localhost:5432/${service}360_beta?schema=public"
    
    # Executar migração
    npx prisma migrate dev --name beta-setup --preview-feature
  fi
done

echo -e "${BLUE}[5/7] Configurando DNS e certificados...${NC}"
# Configurar entradas DNS locais para desenvolvimento
echo -e "\n# Fitness 360 Beta Environment" >> /etc/hosts
echo -e "127.0.0.1\tbeta.fitness360.com.br" >> /etc/hosts
echo -e "127.0.0.1\tstaff-beta.fitness360.com.br" >> /etc/hosts
echo -e "127.0.0.1\tapi-beta.fitness360.com.br" >> /etc/hosts

# Gerar certificados SSL auto-assinados para desenvolvimento
mkdir -p ${BASE_DIR}/certs

# Criar configuração para certificado
cat > ${BASE_DIR}/certs/beta-openssl.cnf << EOL
[req]
distinguished_name = req_distinguished_name
req_extensions = v3_req
prompt = no

[req_distinguished_name]
C = BR
ST = Sao Paulo
L = Sao Paulo
O = Fitness 360 Development
OU = Beta Testing
CN = *.fitness360.com.br

[v3_req]
keyUsage = digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
DNS.1 = beta.fitness360.com.br
DNS.2 = staff-beta.fitness360.com.br
DNS.3 = api-beta.fitness360.com.br
DNS.4 = *.fitness360.com.br
EOL

# Gerar certificados
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ${BASE_DIR}/certs/beta.key \
  -out ${BASE_DIR}/certs/beta.crt \
  -config ${BASE_DIR}/certs/beta-openssl.cnf

echo -e "${BLUE}[6/7] Configurando ambiente de monitoramento beta...${NC}"
# Criar diretório para Prometheus e configurações de alerta para ambiente beta
mkdir -p ${BASE_DIR}/prometheus/beta/rules

# Configurar regras de alerta específicas para ambiente beta
cat > ${BASE_DIR}/prometheus/beta/rules/beta_alerts.yml << EOL
groups:
  - name: beta_environment_alerts
    rules:
      - alert: BetaHighErrorRate
        expr: sum(rate(http_requests_total{env="beta", status=~"5.."}[1m])) / sum(rate(http_requests_total{env="beta"}[1m])) > 0.05
        for: 1m
        labels:
          severity: warning
          environment: beta
        annotations:
          summary: "Alta taxa de erros no ambiente beta"
          description: "A taxa de erros no ambiente beta está acima de 5% no último minuto."
          
      - alert: BetaApiDown
        expr: up{job=~".*-service", env="beta"} == 0
        for: 1m
        labels:
          severity: critical
          environment: beta
        annotations:
          summary: "Serviço beta fora do ar: {{ \$labels.job }}"
          description: "O serviço {{ \$labels.job }} no ambiente beta está fora do ar."
EOL

echo -e "${BLUE}[7/7] Configurando variáveis para frontend beta...${NC}"
# Criar variáveis de ambiente para frontend
cat > ${BASE_DIR}/frontend/app-aluno/.env.beta << EOL
NEXT_PUBLIC_API_URL=https://api-beta.fitness360.com.br
NEXT_PUBLIC_AUTH_API_URL=https://api-beta.fitness360.com.br/auth
NEXT_PUBLIC_MEMBERS_API_URL=https://api-beta.fitness360.com.br/members
NEXT_PUBLIC_TRAINING_API_URL=https://api-beta.fitness360.com.br/training
NEXT_PUBLIC_NUTRITION_API_URL=https://api-beta.fitness360.com.br/nutrition
NEXT_PUBLIC_ENV=beta
NEXT_PUBLIC_BETA_FEEDBACK_ENABLED=true
EOL

cat > ${BASE_DIR}/frontend/app-staff/.env.beta << EOL
NEXT_PUBLIC_API_URL=https://api-beta.fitness360.com.br
NEXT_PUBLIC_AUTH_API_URL=https://api-beta.fitness360.com.br/auth
NEXT_PUBLIC_MEMBERS_API_URL=https://api-beta.fitness360.com.br/members
NEXT_PUBLIC_TRAINING_API_URL=https://api-beta.fitness360.com.br/training
NEXT_PUBLIC_NUTRITION_API_URL=https://api-beta.fitness360.com.br/nutrition
NEXT_PUBLIC_BILLING_API_URL=https://api-beta.fitness360.com.br/billing
NEXT_PUBLIC_ENV=beta
NEXT_PUBLIC_BETA_ADMIN_TOOLS=true
EOL

echo -e "${GREEN}✅ Ambiente beta configurado com sucesso!${NC}"
echo -e "Acesse: https://beta.fitness360.com.br (Alunos) ou https://staff-beta.fitness360.com.br (Profissionais)\n"

echo -e "${YELLOW}Para iniciar o ambiente beta, execute:${NC}"
echo -e "  ${GREEN}make beta-up${NC}"

exit 0 