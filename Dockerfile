FROM node:8-alpine

WORKDIR /home/node/app

ENV NODE_ENV=production \
    NODE_PORT=8080

ADD . /home/node/app

RUN yarn \
    && yarn build

EXPOSE 8080

USER node

CMD ["yarn", "serve"]