# Stage 1: Build the Angular application
FROM node:20 as build
WORKDIR /app
COPY package*.json ./
RUN npm ci   # This line is changed
COPY . .
RUN npm run build


# Stage 2: Serve the application with NGINX
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
