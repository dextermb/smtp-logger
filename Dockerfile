FROM node:current-slim AS BUILD_IMAGE
WORKDIR /usr/src/app

ENV NODE_ENV production

COPY package.json yarn.lock ./
RUN yarn install

FROM node:current-slim
WORKDIR /usr/src/app

RUN mkdir /var/smtp-logger
USER root

COPY --from=BUILD_IMAGE /usr/src/app/node_modules ./node_modules
COPY . .

EXPOSE 25
EXPOSE 587

CMD ["yarn", "run", "boot"]
