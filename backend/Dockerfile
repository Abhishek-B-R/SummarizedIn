FROM mcr.microsoft.com/playwright:v1.56.1-jammy

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.15.1 --activate

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm exec tsc -b || echo "Skipping build step (not using TS)"

ENV NODE_ENV=production \
    PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

EXPOSE 8085

CMD ["pnpm", "start"]