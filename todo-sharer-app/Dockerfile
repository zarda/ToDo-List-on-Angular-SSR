# Stage 1: Build the application
FROM node:20-slim AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Create the production image
FROM node:20-slim
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/dist ./dist
COPY package*.json ./
RUN npm install --omit=dev
EXPOSE 8080
CMD [ "npm", "run", "serve:ssr" ]