# NestJS Backend Dockerfile

# Stage 1: Dependencies
FROM node:20 AS deps
WORKDIR /app
COPY ../backend/package*.json ./
RUN npm ci

# Stage 2: Builder
FROM node:20 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY ../backend .
RUN npm run build

# Stage 3: Runner (Production)
FROM node:20 AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY ../backend/package*.json ./

EXPOSE 4000

CMD ["node", "dist/main"]