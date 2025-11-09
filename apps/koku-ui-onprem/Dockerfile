
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.json ./
COPY apps/koku-ui-onprem/package.json ./apps/koku-ui-onprem/
COPY libs ./libs
RUN npm ci

COPY apps/koku-ui-onprem ./apps/koku-ui-onprem/

RUN npm run build --workspace=@koku-ui/koku-ui-onprem

FROM registry.redhat.io/rhel10/nginx-126

COPY apps/koku-ui-onprem/nginx.conf "${NGINX_DEFAULT_CONF_PATH}"
COPY --from=builder /app/apps/koku-ui-onprem/dist .

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
