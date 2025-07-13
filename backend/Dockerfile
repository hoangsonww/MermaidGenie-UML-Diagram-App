# 1. Build stage
FROM node:18-alpine AS builder

# set workdir
WORKDIR /app

# install dependencies based on package.json
COPY package.json package-lock.json ./
RUN npm ci

# copy source & compile
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# 2. Run stage
FROM node:18-alpine

WORKDIR /app

# only install production deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# copy built artifacts
COPY --from=builder /app/dist ./dist

# if you use .env, mount it at runtime or copy it here:
# COPY .env ./

ENV NODE_ENV=production
EXPOSE 5000

# start your server
CMD ["node", "dist/index.js"]
