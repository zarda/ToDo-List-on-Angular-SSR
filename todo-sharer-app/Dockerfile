# Stage 1: Build the application
FROM node:20-slim AS build

# Install build dependencies
WORKDIR /usr/src/app

# Copy package files for dependency installation
COPY package*.json ./
RUN npm ci --prefer-offline --no-audit 2>/dev/null || npm install --no-audit

# Copy application source
COPY . .

# Build the application (single build with runtime i18n using ngx-translate)
# All languages (en, zh-Hant, ja) are included in a single build
# Users can switch languages instantly without page reload
RUN npm run build

# Stage 2: Production dependencies
FROM node:20-slim AS deps
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --prefer-offline --no-audit --omit=dev 2>/dev/null || npm install --omit=dev --no-audit

# Stage 3: Create the production image
FROM node:20-slim

# Set NODE_ENV to production
ENV NODE_ENV=production \
    PORT=8080

# Create a non-root user for security
RUN groupadd -g 1001 nodejs && \
    useradd -r -u 1001 -g nodejs nodejs

WORKDIR /usr/src/app

# Copy built application from build stage
# Single browser build with all translations: dist/todo-sharer-app/browser/
# Server build: dist/todo-sharer-app/server/
COPY --from=build --chown=nodejs:nodejs /usr/src/app/dist ./dist

# Copy production dependencies from deps stage
COPY --from=deps --chown=nodejs:nodejs /usr/src/app/node_modules ./node_modules

# Copy package files for metadata
COPY --chown=nodejs:nodejs package*.json ./

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 8080

# Start the application
# The app uses ngx-translate for runtime language switching
# Users can change language instantly via the UI language switcher
CMD [ "node", "dist/todo-sharer-app/server/server.mjs" ]
