# Step 1: Use official Node.js image
FROM node:18-alpine AS builder

# Step 2: Set working directory
WORKDIR /app

# Step 3: Copy package.json and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Step 4: Copy all project files
COPY . .

# Step 5: Build the Next.js app
RUN npm run build

# Step 6: Use a lightweight image for production
FROM node:18-alpine AS runner
WORKDIR /app

# Only copy necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

# Start Next.js
CMD ["npm", "start"]
