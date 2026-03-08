# Use official node image for build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./
COPY tsconfig.build.json ./
COPY nest-cli.json ./
COPY src ./src
RUN npm ci
RUN npm run build

# Production image
FROM node:20-alpine
WORKDIR /app
# allow runtime PORT variable (set via docker-compose/env_file)
ENV NODE_ENV=production
ENV PORT=${PORT}
COPY package*.json ./
RUN npm ci --production
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main.js"]
