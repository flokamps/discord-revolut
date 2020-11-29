FROM node:latest

RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot

COPY . /usr/src/bot
RUN npm install

CMD ["node", "index.js"]