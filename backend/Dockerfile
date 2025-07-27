# 1. Build stage
FROM node:18-alpine AS builder
WORKDIR /app

# copy ALL files under backend/ into /app
COPY . .

# install & compile
RUN npm ci
RUN npm run build

# 2. Run stage
FROM node:18-alpine
WORKDIR /app

# only install prod deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# bring in the compiled output
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "dist/index.js"]
