import { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { AuthHeader } from "@/components/ui/auth-header";
import { AuthFooter } from "@/components/ui/auth-footer";
import { useAuthStore } from "@/store/auth-store";
import { useToast } from "@/hooks/use-toast";

/**
 * Página de inicio para usuarios autenticados
 * 
 * Esta página muestra un mensaje de bienvenida al usuario autenticado
 * y proporciona un botón para cerrar sesión.
 */
export default function Home() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { toast } = useToast();

  // Redirigir a login si no está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, setLocation]);

  /**
   * Manejar el cierre de sesión
   */
  const handleLogout = () => {
    logout();
    
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
      variant: "default",
    });
    
    setLocation("/login");
  };

  // Si no está autenticado, no mostrar nada mientras redirige
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <AuthHeader title="Panel Principal" />
      
      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">¡Bienvenido!</h2>
                <p className="text-gray-600 mb-2">Has iniciado sesión correctamente</p>
                {user && <p className="text-lg font-medium text-primary-600">{user.name}</p>}
              </div>
              
              <div className="text-center">
                <Button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <AuthFooter />
    </>
  );
}
