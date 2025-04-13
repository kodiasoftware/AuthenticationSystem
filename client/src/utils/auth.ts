/**
 * Utilidades para la autenticación
 * 
 * Este archivo contiene funciones auxiliares para manejar la autenticación,
 * incluyendo la gestión del token JWT y los datos del usuario en localStorage.
 */

// Tipos para la autenticación
export interface User {
  id: number;
  name: string;
  email: string;
}

/**
 * Guardar el token de autenticación en localStorage
 * 
 * @param token - El token JWT de autenticación
 */
export const saveToken = (token: string): void => {
  localStorage.setItem("auth_token", token);
};

/**
 * Obtener el token de autenticación de localStorage
 * 
 * @returns El token JWT o null si no existe
 */
export const getToken = (): string | null => {
  return localStorage.getItem("auth_token");
};

/**
 * Eliminar el token de autenticación de localStorage
 */
export const removeToken = (): void => {
  localStorage.removeItem("auth_token");
};

/**
 * Guardar los datos del usuario en localStorage
 * 
 * @param user - Los datos del usuario a guardar
 */
export const saveUser = (user: User): void => {
  localStorage.setItem("user_data", JSON.stringify(user));
};

/**
 * Obtener los datos del usuario de localStorage
 * 
 * @returns Los datos del usuario o null si no existen
 */
export const getUser = (): User | null => {
  const userData = localStorage.getItem("user_data");
  if (userData) {
    try {
      return JSON.parse(userData) as User;
    } catch (e) {
      console.error("Error parsing user data:", e);
      return null;
    }
  }
  return null;
};

/**
 * Eliminar los datos del usuario de localStorage
 */
export const removeUser = (): void => {
  localStorage.removeItem("user_data");
};

/**
 * Verificar si el usuario está autenticado
 * 
 * @returns true si el usuario está autenticado, false en caso contrario
 */
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

/**
 * Limpiar todos los datos de autenticación
 */
export const clearAuth = (): void => {
  removeToken();
  removeUser();
};
