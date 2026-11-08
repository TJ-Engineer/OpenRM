FROM node:24-alpine AS builder
WORKDIR /build
COPY package.json package-lock.json ./
RUN npm ci
COPY index.html tsconfig.json vite.config.ts ./
COPY src ./src
ARG VITE_API_BASE_URL=/
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
RUN npm run build

FROM nginxinc/nginx-unprivileged:1.27-alpine
COPY deploy/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY deploy/web/proxy_params /etc/nginx/proxy_params
COPY --from=builder /build/dist /usr/share/nginx/html
EXPOSE 8080
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=6 \
    CMD ["wget", "--quiet", "--spider", "http://127.0.0.1:8080/container-health"]
