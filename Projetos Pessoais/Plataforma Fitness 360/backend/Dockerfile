FROM node:20-alpine AS builder

WORKDIR /app

# Instala pnpm
RUN npm install -g pnpm

# Copia arquivos de dependências
COPY package.json pnpm-lock.yaml ./
COPY packages/tsconfig.json ./packages/

# Instala dependências
RUN pnpm install --frozen-lockfile

# Copia código fonte
COPY . .

# Build
RUN pnpm build

FROM node:20-alpine AS runner

WORKDIR /app

# Copia apenas arquivos necessários
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./

# Configurações de segurança
USER node
ENV NODE_ENV production
ENV PORT 3000

EXPOSE 3000

CMD ["node", "dist/main.js"] 