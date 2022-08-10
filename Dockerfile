FROM node:17-alpine

WORKDIR /usr/src/app

ENV CHROME_BIN="/usr/bin/chromium-browser" \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"
RUN set -x \
    && apk update \
    && apk upgrade \
    && apk add --no-cache \
    udev \
    ttf-freefont \
    chromium \
    && npm install puppeteer

COPY package.json ./
COPY package-lock.json ./

RUN npm install 

COPY . .

EXPOSE 5000

CMD npm run start:dev