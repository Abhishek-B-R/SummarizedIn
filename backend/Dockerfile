# Stage 1: Builder
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

# Stage 2: Runner
FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY .env ./

EXPOSE 8085
CMD ["node", "dist/index.js"]
