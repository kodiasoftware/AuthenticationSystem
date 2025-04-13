import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { LoginForm } from "@/components/auth/login-form";
import { AuthHeader } from "@/components/ui/auth-header";
import { AuthFooter } from "@/components/ui/auth-footer";
import { useAuthStore } from "@/store/auth-store";

/**
 * Página de inicio de sesión
 * 
 * Esta página muestra el formulario de inicio de sesión y permite
 * a los usuarios cambiar a la página de registro.
 */
export default function Login() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuthStore();

  // Redirigir a home si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  /**
   * Cambiar a la página de registro
   */
  const handleSwitchToRegister = () => {
    setLocation("/register");
  };

  // Si está autenticado, no mostrar nada mientras redirige
  if (isAuthenticated) {
    return null;
  }

  return (
    <>
      <AuthHeader />
      
      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          <LoginForm onSwitchToRegister={handleSwitchToRegister} />
        </div>
      </main>
      
      <AuthFooter />
    </>
  );
}
