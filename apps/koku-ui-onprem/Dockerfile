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

COPY apps/koku-ui-onprem/nginx.conf.template /tmp/nginx.conf.template
COPY --from=builder /app/apps/koku-ui-onprem/dist .

EXPOSE 8080
CMD ["/bin/sh", "-c", "envsubst '\\$API_PROXY_URL' < /tmp/nginx.conf.template > ${NGINX_DEFAULT_CONF_PATH}/nginx.conf && nginx -g 'daemon off;'"]
