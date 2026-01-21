# Dockerfile untuk TodoList App
FROM node:20-slim

WORKDIR /app

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy package files dan install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy source code
COPY . .

# Set env untuk build
ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/todoapp"

# Generate Prisma client
RUN npx prisma generate

# Build app
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
