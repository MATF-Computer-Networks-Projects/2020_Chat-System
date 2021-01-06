FROM node:alpine

COPY . /usr/src/chat-server

WORKDIR /usr/src/chat-server

RUN cp .env.example .env 

RUN npm install 

RUN npm install typescript

RUN npm run build 

CMD ["node", "./build/index.js"]