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
              
              <div className="flex flex-col space-y-4 items-center">
                <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                  <Button
                    type="button"
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white"
                  >
                    <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Mi Perfil
                  </Button>
                  <Button
                    type="button"
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white"
                  >
                    <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Configuración
                  </Button>
                </div>
                
                <div className="pt-4 border-t border-gray-200 w-full max-w-sm">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-red-300 text-red-600 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Cerrar sesión
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <AuthFooter />
    </>
  );
}
