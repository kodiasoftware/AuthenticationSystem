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

            <Button
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
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
