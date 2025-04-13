import { type User, type InsertUser } from "@shared/schema";
import bcrypt from "bcrypt";
import { db } from "./db";
import { eq } from "drizzle-orm";
import * as schema from "@shared/schema";

// Interfaz para las operaciones de almacenamiento
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  validateUserCredentials(email: string, password: string): Promise<User | null>;
}

// Implementación de almacenamiento usando base de datos MySQL
export class DatabaseStorage implements IStorage {
  
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(schema.users).where(eq(schema.users.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const normalizedEmail = email.toLowerCase();
    const result = await db.select().from(schema.users).where(eq(schema.users.email, normalizedEmail)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Verificar si el usuario ya existe
    const existingUser = await this.getUserByEmail(insertUser.email);
    if (existingUser) {
      throw new Error("El usuario con este correo ya existe");
    }

    // Hash la contraseña antes de almacenarla
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    
    // Preparar los datos del usuario con el email normalizado
    const userData = { 
      ...insertUser, 
      email: insertUser.email.toLowerCase(),
      password: hashedPassword 
    };
    
    // Insertar el usuario en la base de datos y obtener la inserción ID
    await db.insert(schema.users).values(userData);
    
    // En MySQL, recuperamos el usuario usando el correo electrónico después de insertarlo
    const newUser = await this.getUserByEmail(userData.email);
    if (newUser) {
      // Devolver el usuario sin exponer la contraseña
      return { ...newUser, password: "[PROTECTED]" } as User;
    }
    
    throw new Error("Error al crear el usuario");
  }

  async validateUserCredentials(email: string, password: string): Promise<User | null> {
    // Buscar al usuario por email
    const user = await this.getUserByEmail(email);
    
    if (!user) {
      return null;
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return null;
    }

    // Devolver el usuario sin exponer la contraseña
    return { ...user, password: "[PROTECTED]" } as User;
  }
}

// Exportar la instancia de almacenamiento para ser utilizada en la aplicación
export const storage = new DatabaseStorage();
