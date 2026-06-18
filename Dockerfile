# --- STAGE 1: Build Stage ---
FROM node:22-alpine AS builder
WORKDIR /app

# Copy package configurations
COPY package*.json ./

# Install ALL dependencies (including devDependencies like typescript, tsx, eslint)
RUN npm ci

# Copy the rest of your application source code
COPY . .

# Generate Prisma Client and compile TypeScript to JS (dist/)
# RUN npx prisma generate
RUN npm run build

# --- STAGE 2: Production Runtime Stage ---
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy package configs
COPY package*.json ./

# Install ONLY production dependencies (ignores devDependencies)
RUN npm ci --only=production

# Copy compiled JavaScript from the builder stage
COPY --from=builder /app/dist ./dist
# Copy the generated Prisma client binaries so database queries function
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Expose your application port
EXPOSE 3000

# Run the compiled server using native Node.js
CMD ["node", "dist/server.js"]