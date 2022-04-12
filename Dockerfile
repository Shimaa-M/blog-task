FROM node:16-alpine 

ARG NODE_ENV=dev
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.8.0/wait /wait
RUN chmod +x /wait

EXPOSE 3000

CMD /wait && npm run start

RUN npm run migrate
