# Backend Dockerfile - builds TypeScript and runs Node in production

FROM node:18-alpine AS builder
WORKDIR /app

# Install deps (need dev deps for tsc)
COPY backend/package*.json ./
RUN npm ci

# Copy source and build
COPY backend/tsconfig.json ./tsconfig.json
COPY backend/src ./src
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install production deps only
COPY backend/package*.json ./
RUN npm ci --omit=dev

# Copy built files
COPY --from=builder /app/dist ./dist

# Create persistent directories for sqlite and uploads
RUN mkdir -p /app/data /app/uploads

# Defaults (can be overridden by docker-compose)
ENV PORT=3000 \
    DATABASE_PATH=/app/data/database.sqlite \
    UPLOAD_DIR=/app/uploads \
    MAX_FILE_SIZE=10485760

EXPOSE 3000
CMD ["node", "dist/index.js"]



