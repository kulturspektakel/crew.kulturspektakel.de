FROM node:20-slim

WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install --omit=dev
COPY . .
RUN npm run build
CMD ["npm", "start"]