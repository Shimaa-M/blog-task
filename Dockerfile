FROM node:16-alpine as development

WORKDIR /user/src/app

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 3000

RUN npm run build

FROM node:16-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /user/src/app

COPY package*.json .

RUN npm install --only=production

COPY --from=development /user/src/app/dist ./dist

CMD [ "node","dist/index.js" ]


