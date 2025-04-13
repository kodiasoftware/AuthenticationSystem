import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { RegisterForm } from "@/components/auth/register-form";
import { AuthHeader } from "@/components/ui/auth-header";
import { AuthFooter } from "@/components/ui/auth-footer";
import { useAuthStore } from "@/store/auth-store";

/**
 * Página de registro
 * 
 * Esta página muestra el formulario de registro y permite
 * a los usuarios cambiar a la página de inicio de sesión.
 */
export default function Register() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuthStore();

  // Redirigir a home si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  /**
   * Cambiar a la página de inicio de sesión
   */
  const handleSwitchToLogin = () => {
    setLocation("/login");
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
          <RegisterForm onSwitchToLogin={handleSwitchToLogin} />
        </div>
      </main>
      
      <AuthFooter />
    </>
  );
}
