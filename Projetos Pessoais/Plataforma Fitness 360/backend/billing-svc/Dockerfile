FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install && npm ci --legacy-peer-deps

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main.js"] 