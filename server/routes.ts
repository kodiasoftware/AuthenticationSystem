import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, loginUserSchema } from "@shared/schema";
import jwt from "jsonwebtoken";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

// JWT Secret (should be in environment variables in production)
const JWT_SECRET = process.env.JWT_SECRET || "auth_system_jwt_secret";
const JWT_EXPIRES_IN = "24h";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes - prefix all routes with /api
  
  // Register new user
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const userData = insertUserSchema.parse(req.body);
      
      // Create user in storage
      const newUser = await storage.createUser(userData);
      
      // Generate JWT token
      const token = jwt.sign(
        { id: newUser.id, email: newUser.email, name: newUser.name },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );
      
      // Return user data and token
      return res.status(201).json({
        success: true,
        data: {
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email
          },
          token
        }
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          success: false,
          message: "Error de validación",
          errors: validationError.details
        });
      } else if (error instanceof Error) {
        return res.status(400).json({ 
          success: false,
          message: error.message 
        });
      }
      
      return res.status(500).json({ 
        success: false,
        message: "Error en el servidor" 
      });
    }
  });
  
  // Login user
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const credentials = loginUserSchema.parse(req.body);
      
      // Validate credentials
      const user = await storage.validateUserCredentials(
        credentials.email, 
        credentials.password
      );
      
      if (!user) {
        return res.status(401).json({ 
          success: false,
          message: "Credenciales inválidas" 
        });
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );
      
      // Return user data and token
      return res.status(200).json({
        success: true,
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email
          },
          token
        }
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          success: false,
          message: "Error de validación",
          errors: validationError.details
        });
      }
      
      return res.status(500).json({ 
        success: false,
        message: "Error en el servidor" 
      });
    }
  });
  
  // Verify token and get current user
  app.get("/api/auth/user", async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
          success: false,
          message: "No autorizado - Token no proporcionado" 
        });
      }
      
      const token = authHeader.split(' ')[1];
      
      try {
        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number, email: string, name: string };
        
        // Get user from storage
        const user = await storage.getUser(decoded.id);
        
        if (!user) {
          return res.status(404).json({ 
            success: false,
            message: "Usuario no encontrado" 
          });
        }
        
        // Return user data
        return res.status(200).json({
          success: true,
          data: {
            user: {
              id: user.id,
              name: user.name,
              email: user.email
            }
          }
        });
      } catch (err) {
        return res.status(401).json({ 
          success: false,
          message: "No autorizado - Token inválido" 
        });
      }
    } catch (error) {
      return res.status(500).json({ 
        success: false,
        message: "Error en el servidor" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
