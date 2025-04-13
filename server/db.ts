import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from "@shared/schema";

// Verifica si la URL de la base de datos está configurada
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Configura una pool de conexiones MySQL
const poolConnection = mysql.createPool(process.env.DATABASE_URL);

// Crea una instancia de Drizzle con MySQL
export const db = drizzle(poolConnection, { schema, mode: 'default' });