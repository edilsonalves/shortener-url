FROM node:24.12-alpine

ENV NODE_ENV=production

WORKDIR /app

COPY prisma ./prisma
COPY public ./public
COPY src ./src
COPY package*.json ./
COPY prisma.config.ts ./
COPY tsconfig.json ./

RUN npm ci --omit=dev --ignore-scripts

CMD ["node", "./src/index.ts"]
