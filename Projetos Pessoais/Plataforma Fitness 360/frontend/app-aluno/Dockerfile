FROM node:18-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install

COPY . .

RUN pnpm build

ENV PORT=3006
EXPOSE 3006

CMD ["pnpm", "start"] 