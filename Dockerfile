FROM node:20-slim

WORKDIR /usr/src/app
COPY . .
RUN yarn install --production
RUN yarn build
CMD ["yarn", "start"]