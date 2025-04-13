# Sistema de Autenticación

Un sistema completo de autenticación desarrollado con React, Node.js y PostgreSQL, que proporciona funcionalidades de registro, inicio de sesión y rutas protegidas.

## Características

- ✅ Registro de usuarios con validación de datos
- ✅ Inicio de sesión seguro con JWT
- ✅ Almacenamiento de datos en PostgreSQL
- ✅ Rutas protegidas para usuarios autenticados
- ✅ Interfaz de usuario moderna y responsiva
- ✅ Integración con proveedores de autenticación social (Simulación)
- ✅ Tests unitarios completos

## Requisitos previos

- Node.js v18.x o superior
- MySQL 8.0 o superior
- npm v8.x o superior

## Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/tu-usuario/sistema-autenticacion.git
cd sistema-autenticacion
```

2. Instala las dependencias:

```bash
npm install
```

3. Configura las variables de entorno:

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```
DATABASE_URL=mysql://usuario:contraseña@localhost:3306/nombre_bd
JWT_SECRET=tu_clave_secreta_para_jwt
```

4. Ejecuta la migración de la base de datos:

```bash
npm run db:push
```

## Ejecución en desarrollo

Para ejecutar la aplicación en modo desarrollo:

```bash
npm run dev
```

Esto iniciará el servidor backend en http://localhost:5000 y el cliente frontend en la misma dirección.

## Ejecución en producción

1. Construye la aplicación:

```bash
npm run build
```

2. Inicia el servidor en modo producción:

```bash
npm start
```

## Pruebas

Para ejecutar el verificador de tipos TypeScript:

```bash
npm run check
```

Para ejecutar tests en un entorno de CI/CD, necesitarías configurar Jest u otro framework de testing. Los tests se encuentran en los directorios `__tests__` dentro del proyecto.

## Despliegue

### Despliegue manual

1. Construye la aplicación:

```bash
npm run build
```

2. Inicia el servidor:

```bash
npm start
```

### Despliegue con Docker

1. Construye la imagen Docker:

```bash
docker build -t sistema-autenticacion .
```

2. Ejecuta el contenedor:

```bash
docker run -p 5000:5000 -e DATABASE_URL=tu_url_de_bd -e JWT_SECRET=tu_secreto sistema-autenticacion
```

## Docker Compose

También puedes utilizar Docker Compose para ejecutar la aplicación junto con MySQL:

```bash
docker-compose up -d
```

Esto iniciará tanto la aplicación como una base de datos MySQL.

## Estructura del proyecto

```
├── client/                # Código del frontend
│   ├── src/               # Código fuente
│   │   ├── components/    # Componentes React
│   │   ├── pages/         # Páginas de la aplicación
│   │   ├── hooks/         # Custom hooks
│   │   ├── store/         # Estado global (Zustand)
│   │   └── utils/         # Utilidades
├── server/                # Código del backend
│   ├── index.ts           # Punto de entrada
│   ├── routes.ts          # Rutas de la API
│   ├── storage.ts         # Lógica de almacenamiento
│   └── db.ts              # Configuración de la base de datos
└── shared/                # Código compartido
    └── schema.ts          # Esquemas y tipos
```

## Tecnologías utilizadas

- **Frontend**: React, Tailwind CSS, shadcn/ui, Zustand
- **Backend**: Node.js, Express
- **Base de datos**: MySQL
- **ORM**: Drizzle ORM
- **Autenticación**: JWT
- **Testing**: Jest, React Testing Library

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.