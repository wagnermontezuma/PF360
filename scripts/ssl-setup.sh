#!/bin/bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# Domínios para certificados
DOMAINS=("app.fitness360.com" "api.fitness360.com")

# Verificar se está rodando como root
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}Este script precisa ser executado como root${NC}"
   exit 1
fi

# Verificar se o certbot está instalado
if ! command -v certbot &> /dev/null; then
    echo -e "${GREEN}Instalando Certbot...${NC}"
    apt-get update
    apt-get install -y certbot
fi

# Criar diretório para desafio ACME
mkdir -p /var/www/html/.well-known/acme-challenge
chown -R www-data:www-data /var/www/html

# Função para obter certificado
get_certificate() {
    local domain=$1
    
    echo -e "${GREEN}Obtendo certificado para $domain...${NC}"
    
    certbot certonly \
        --webroot \
        --webroot-path=/var/www/html \
        --domain $domain \
        --email admin@fitness360.com \
        --agree-tos \
        --non-interactive \
        --expand
}

# Obter certificados para cada domínio
for domain in "${DOMAINS[@]}"; do
    get_certificate "$domain"
done

# Configurar renovação automática
echo "0 0 1 * * root certbot renew --quiet" > /etc/cron.d/certbot-renew
chmod 644 /etc/cron.d/certbot-renew

# Reiniciar nginx
systemctl restart nginx

echo -e "${GREEN}Configuração SSL concluída!${NC}"
echo -e "Próximos passos:"
echo -e "1. Verifique os certificados em /etc/letsencrypt/live/"
echo -e "2. Atualize a configuração do Nginx para usar os certificados"
echo -e "3. Teste a renovação com: certbot renew --dry-run" 