FROM node:8

WORKDIR /home/node/app

ENV NODE_ENV=production \
    NODE_PORT=8080

ADD . /home/node/app

RUN echo $PWD

RUN yarn

RUN yarn build

EXPOSE 8080

USER node

CMD ["yarn", "serve"]