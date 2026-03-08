# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Accept VITE_API_BASE_URL as build arg so it gets baked into the production bundle
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

COPY package.json package-lock.json ./
COPY tsconfig.json tsconfig.app.json tsconfig.node.json ./
COPY index.html ./
COPY vite.config.ts ./
COPY public ./public
COPY src ./src
RUN npm ci
# ensure the build has access to the VITE variable
RUN npm run build

# Runtime stage
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
