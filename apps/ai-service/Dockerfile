FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

FROM base AS pruner
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN pnpm add -g turbo
COPY . .
RUN turbo prune @app/ai-service --docker

FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

COPY --from=pruner /app/out/full/ .
RUN pnpm turbo run build --filter=@app/ai-service...

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 aisuite

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/ai-service/dist ./dist
COPY --from=builder /app/apps/ai-service/package.json ./package.json

USER aisuite
EXPOSE 8000
ENV PORT=8000
ENV HOST="0.0.0.0"

CMD ["node", "dist/index.js"]
