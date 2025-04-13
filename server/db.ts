import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from "@shared/schema";

// Verifica si la URL de la base de datos está configurada
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Parsear la URL de la base de datos (adaptado desde PostgreSQL para MySQL)
const dbUrl = process.env.DATABASE_URL || '';
let connectionConfig: mysql.PoolOptions = {};

// Chequear si es una URL de PostgreSQL y parsearla para usar en MySQL
const isPostgresUrl = dbUrl.startsWith('postgresql://');
const isMysqlUrl = dbUrl.startsWith('mysql://');

if (isPostgresUrl || isMysqlUrl) {
  const url = new URL(dbUrl.replace('postgresql://', 'mysql://'));
  connectionConfig = {
    host: url.hostname,
    port: Number(url.port) || 3306,
    user: url.username,
    password: url.password,
    database: url.pathname.substring(1),
    ssl: { rejectUnauthorized: false } // Deshabilitar verificación SSL para desarrollo
  };
} else {
  // Configuración por defecto para desarrollo local
  console.warn('No se detectó una URL válida, usando configuración por defecto');
  connectionConfig = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'mysql_password',
    database: 'auth_db'
  };
}

// Configura una pool de conexiones MySQL
const poolConnection = mysql.createPool(connectionConfig);

// Crea una instancia de Drizzle con MySQL
export const db = drizzle(poolConnection, { schema, mode: 'default' });