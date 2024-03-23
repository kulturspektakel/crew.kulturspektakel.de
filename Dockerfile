FROM node:20-slim

WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --production --ignore-engines
COPY . .
RUN yarn build
CMD ["yarn", "start"]