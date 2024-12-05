FROM node:18-alpine

WORKDIR /workdir

COPY package.json .
COPY yarn.lock .

RUN yarn install --frozen-lockfile

COPY . .

ENV NODE_ENV=production

RUN yarn build

CMD [ "node", "dist/src/main.js" ]
