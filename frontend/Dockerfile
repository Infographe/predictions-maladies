# Étape 1 : Construire l'application Angular
FROM node:20 as build-stage

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Étape 2 : Servir l'application avec Nginx
FROM nginx:alpine
COPY --from=build-stage /app/dist/frontend /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
