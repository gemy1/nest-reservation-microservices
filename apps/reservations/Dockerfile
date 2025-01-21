# Development Stage
FROM node:18-alpine AS development

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . . 

RUN npm run build

# Production Stage
FROM node:18-alpine AS production

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --production

COPY --from=development /app/dist ./dist

CMD ["node", "dist/apps/reservations/main.js"]
