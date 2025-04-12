FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Instala as dependências
RUN npm ci

# Copia o resto dos arquivos
COPY . .

# Configura as variáveis de ambiente
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOST=0.0.0.0

EXPOSE 3000

# Comando para desenvolvimento
CMD ["npm", "run", "dev"] 