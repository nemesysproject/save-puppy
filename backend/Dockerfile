# Usamos una imagen base ligera de Node.js
FROM node:18-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiamos los archivos de definición de dependencias
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el código fuente
COPY . .

# Compilamos TypeScript a JavaScript
RUN npm run build

# Exponemos el puerto que usa la app
EXPOSE 3000

# Comando para iniciar la app compilada
CMD ["node", "dist/index.js"]