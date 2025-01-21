FROM node:18-alpine AS development

WORKDIR /app

COPY package.json  .
COPY package-lock.json .

RUN npm ci

COPY . .

RUN npm run build auth

FROM node:18-alpine AS production

WORKDIR /app

COPY package.json  .
COPY package-lock.json .

RUN npm ci --production

COPY --from=development /app/dist ./dist

CMD [ "node","dist/apps/auth/main.js" ]