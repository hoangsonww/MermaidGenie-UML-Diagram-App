# 1) Install & build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy everything and build
COPY . .
RUN npm run build

# 2) Production image
FROM node:18-alpine

WORKDIR /app

# Only install production deps
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Copy app build output and static assets
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./

ENV NODE_ENV=production
EXPOSE 3000

# Start the Next.js server
CMD ["npm", "start"]
