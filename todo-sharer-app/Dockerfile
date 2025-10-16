# Stage 1: Build the Angular application
FROM node:20-slim AS build

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm ci

# Bundle app source
COPY . .

# Build the app
RUN npm run build -- --configuration production

# Stage 2: Create the production image
FROM node:20-slim AS production

WORKDIR /usr/src/app

# Copy the built application from the 'build' stage
COPY --from=build /usr/src/app/dist ./dist

# Your app binds to port 8080 so you need to expose it
EXPOSE 8080

# Define the command to run your app
CMD node dist/todo-sharer-app/server/server.mjs
