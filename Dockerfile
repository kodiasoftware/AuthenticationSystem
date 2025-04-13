# Base de Node.js
FROM node:20-alpine

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./
COPY postcss.config.js ./
COPY tailwind.config.ts ./
COPY drizzle.config.ts ./
COPY theme.json ./

# Instalar dependencias
RUN npm ci

# Copiar el código fuente
COPY client ./client
COPY server ./server
COPY shared ./shared

# Construir la aplicación
RUN npm run build

# Exponer el puerto
EXPOSE 5000

# Comando para iniciar la aplicación
CMD ["npm", "start"]