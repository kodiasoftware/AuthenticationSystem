import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/auth-store";
import { loginUserSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Mail, Lock } from "lucide-react";

/**
 * Componente de formulario de inicio de sesión
 * 
 * Este componente muestra un formulario para que los usuarios inicien sesión
 * con su correo electrónico y contraseña. Incluye validación de campos y
 * manejo de errores.
 * 
 * @param onSwitchToRegister - Función para cambiar a la vista de registro
 */
export function LoginForm({ onSwitchToRegister }: { onSwitchToRegister: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { login } = useAuthStore();

  // Definir el formulario con react-hook-form y zod para validación
  const form = useForm<z.infer<typeof loginUserSchema>>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  /**
   * Manejar el envío del formulario
   * 
   * @param values - Los valores del formulario (email y password)
   */
  async function onSubmit(values: z.infer<typeof loginUserSchema>) {
    setIsLoading(true);
    
    try {
      // Llamar a la API para iniciar sesión
      const response = await apiRequest("POST", "/api/auth/login", values);
      const data = await response.json();
      
      if (data.success) {
        // Guardar datos de autenticación y redirigir
        login(data.data.token, data.data.user);
        
        toast({
          title: "Inicio de sesión exitoso",
          description: "Has iniciado sesión correctamente",
          variant: "default",
        });
        
        setLocation("/");
      }
    } catch (error) {
      console.error("Error de inicio de sesión:", error);
      
      toast({
        title: "Error de inicio de sesión",
        description: error instanceof Error ? error.message : "Credenciales inválidas",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Iniciar Sesión</h2>
          <p className="text-gray-600">Ingresa tus credenciales para acceder</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Correo electrónico
                  </FormLabel>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <FormControl>
                      <Input
                        placeholder="tu@email.com"
                        type="email"
                        className="pl-10"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Contraseña
                    </FormLabel>
                    <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <FormControl>
                      <Input
                        placeholder="••••••••"
                        type="password"
                        className="pl-10"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <Button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">O continúa con</span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <Button variant="outline" type="button" className="bg-white">
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                      fill="#EA4335"
                    />
                    <path
                      d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12.0004 24C15.2404 24 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24 12.0004 24Z"
                      fill="#34A853"
                    />
                  </svg>
                  Google
                </Button>
                <Button variant="outline" type="button" className="bg-white">
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 21 21" fill="none">
                    <g clipPath="url(#clip0)">
                      <path
                        d="M20.667 10.3333C20.667 4.76666 16.067 0.166656 10.5003 0.166656C4.93366 0.166656 0.333664 4.76666 0.333664 10.3333C0.333664 15.2666 3.93366 19.4 8.66699 20.1667V13.1667H6.16699V10.3333H8.66699V8.08333C8.66699 5.58333 10.167 4.16666 12.4337 4.16666C13.5003 4.16666 14.667 4.33333 14.667 4.33333V6.83333H13.417C12.2503 6.83333 11.8337 7.66666 11.8337 8.5V10.3333H14.5003L14.0837 13.1667H11.8337V20.1667C16.567 19.4 20.667 15.2666 20.667 10.3333Z"
                        fill="#1877F2"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0">
                        <rect width="20.3333" height="20" fill="white" transform="translate(0.333664 0.166656)" />
                      </clipPath>
                    </defs>
                  </svg>
                  Facebook
                </Button>
                <Button variant="outline" type="button" className="bg-white">
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <path d="M17.563 12.928c-.008-1.922 1.574-2.85 1.645-2.893-0.895-1.31-2.29-1.49-2.787-1.51-1.184-0.119-2.313.698-2.914.698-0.598 0-1.527-0.68-2.51-0.664-1.284.02-2.473.748-3.13 1.899-1.339 2.326-0.343 5.769.958 7.657.639.923 1.396 1.956 2.392 1.918 0.962-.038 1.325-.619 2.487-0.619 1.161 0 1.492.619 2.51.599 1.037-.02 1.695-0.94 2.327-1.865.736-1.074 1.037-2.116 1.056-2.169-0.023-0.01-2.022-.776-2.042-3.069l.008.018z" fill="#000" />
                    <path d="M15.797 6.9c0.528-0.642.887-1.53.789-2.42-0.762.031-1.685.51-2.228 1.146-0.489.566-0.918 1.474-0.803 2.342 0.852.065 1.72-0.427 2.233-1.076l.9.008z" fill="#000" />
                  </svg>
                  Apple
                </Button>
              </div>
            </div>
          </form>
        </Form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            ¿No tienes cuenta?{" "}
            <Button
              type="button"
              variant="link"
              className="font-medium text-primary-600 hover:text-primary-500 p-0"
              onClick={onSwitchToRegister}
            >
              Regístrate aquí
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
