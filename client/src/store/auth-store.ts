import { create } from 'zustand';
import { apiRequest } from '@/lib/queryClient';
import { getToken, getUser, saveToken, saveUser, clearAuth, isAuthenticated as checkIsAuthenticated } from '@/utils/auth';

/**
 * Interfaz para el usuario autenticado
 */
interface User {
  id: number;
  name: string;
  email: string;
}

/**
 * Interfaz para el estado de autenticación
 */
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

/**
 * Store para gestionar el estado de autenticación
 * 
 * Este store maneja el estado de autenticación global de la aplicación,
 * incluyendo el token JWT, los datos del usuario y funciones para
 * iniciar y cerrar sesión.
 */
export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: checkIsAuthenticated(),
  user: getUser(),
  token: getToken(),
  
  /**
   * Iniciar sesión y almacenar datos de autenticación
   * 
   * @param token - El token JWT de autenticación
   * @param user - Los datos del usuario autenticado
   */
  login: (token: string, user: User) => {
    saveToken(token);
    saveUser(user);
    
    set({
      isAuthenticated: true,
      token,
      user,
    });
  },
  
  /**
   * Cerrar sesión y limpiar datos de autenticación
   */
  logout: () => {
    clearAuth();
    
    set({
      isAuthenticated: false,
      token: null,
      user: null,
    });
  },
  
  /**
   * Verificar el estado de autenticación actual con el servidor
   * 
   * @returns Promesa que resuelve a true si el usuario está autenticado, false en caso contrario
   */
  checkAuth: async () => {
    // Si no hay token, el usuario no está autenticado
    if (!getToken()) {
      set({ isAuthenticated: false, token: null, user: null });
      return false;
    }
    
    try {
      // Verificar el token con el servidor
      const response = await apiRequest("GET", "/api/auth/user");
      const data = await response.json();
      
      if (data.success && data.data.user) {
        // Actualizar datos del usuario en el store
        set({
          isAuthenticated: true,
          user: data.data.user,
          token: getToken(),
        });
        return true;
      } else {
        // Si el servidor no reconoce al usuario, cerrar sesión
        get().logout();
        return false;
      }
    } catch (error) {
      console.error("Error al verificar autenticación:", error);
      // Si hay un error al verificar, cerrar sesión
      get().logout();
      return false;
    }
  },
}));
