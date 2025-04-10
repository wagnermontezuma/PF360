# Estágio de construção
FROM node:18-alpine AS builder

# Diretório de trabalho
WORKDIR /app

# Instalar dependências
COPY package.json package-lock.json* pnpm-lock.yaml* ./
RUN npm ci --production=false

# Copiar todos os arquivos
COPY . .

# Construir o app
RUN npm run build

# Estágio de produção
FROM node:18-alpine AS runner

WORKDIR /app

# Definir variáveis de ambiente para produção
ENV NODE_ENV=production

# Adicionar usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar o resultado da construção
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Melhorias de segurança
USER nextjs

# Expor a porta
EXPOSE 3007

# Definir variáveis de ambiente padrão
ENV PORT=3007
ENV NEXT_TELEMETRY_DISABLED=1

# Comando de início
CMD ["node", "server.js"] 