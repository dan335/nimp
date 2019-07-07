FROM node:12-alpine

RUN apk add --no-cache make gcc g++ python imagemagick

ENV PORT=80 TERM=xterm

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install --production

COPY . /usr/src/app

RUN npm run build
EXPOSE 80

CMD [ "npm", "start" ]
