# Usamos una versión ligera de Node.js (la 20)
FROM node:20-slim

# Creamos y nos situamos en la carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copiamos primero los archivos de dependencias
COPY package*.json ./

# Docker instala AQUÍ todas las librerías de golpe automáticamente
RUN npm install

# Copiamos el resto del código de tu frontend
COPY . .

# Exponemos el puerto estándar que usa Vite
EXPOSE 5173

# Arrancamos Vite obligándolo a escuchar conexiones externas (--host)
CMD ["npm", "run", "dev", "--", "--host"]
