
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

COPY apps/koku-ui-onprem/package.json ./apps/koku-ui-onprem/
COPY libs/ui-lib/package.json ./libs/ui-lib/

COPY apps/koku-ui-onprem ./apps/koku-ui-onprem/
COPY libs ./libs

RUN npm ci

WORKDIR /app
RUN npm run build --workspace=@koku-ui/koku-ui-onprem

FROM registry.redhat.io/rhel10/nginx-126

COPY apps/koku-ui-onprem/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/apps/koku-ui-onprem/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

