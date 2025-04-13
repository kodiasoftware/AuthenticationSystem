import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/auth-store";
import { insertUserSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Mail, Lock, User } from "lucide-react";

/**
 * Esquema de validación para el formulario de registro
 * Extiende el esquema de usuario con confirmación de contraseña y términos
 */
const registerFormSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  terms: z.boolean().refine(val => val === true, {
    message: "Debes aceptar los términos y condiciones",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

/**
 * Componente de formulario de registro
 * 
 * Este componente muestra un formulario para que los usuarios se registren
 * con su nombre, correo electrónico y contraseña. Incluye validación de campos
 * y manejo de errores.
 * 
 * @param onSwitchToLogin - Función para cambiar a la vista de inicio de sesión
 */
export function RegisterForm({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { login } = useAuthStore();

  // Definir el formulario con react-hook-form y zod para validación
  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  /**
   * Manejar el envío del formulario
   * 
   * @param values - Los valores del formulario (name, email, password, confirmPassword, terms)
   */
  async function onSubmit(values: z.infer<typeof registerFormSchema>) {
    setIsLoading(true);
    
    try {
      // Eliminar campos que no necesitamos enviar al servidor
      const { confirmPassword, terms, ...userData } = values;
      
      // Llamar a la API para registrar al usuario
      const response = await apiRequest("POST", "/api/auth/register", userData);
      const data = await response.json();
      
      if (data.success) {
        // Guardar datos de autenticación y redirigir
        login(data.data.token, data.data.user);
        
        toast({
          title: "Registro exitoso",
          description: "Tu cuenta ha sido creada correctamente",
          variant: "default",
        });
        
        setLocation("/");
      }
    } catch (error) {
      console.error("Error de registro:", error);
      
      toast({
        title: "Error de registro",
        description: error instanceof Error ? error.message : "Error al crear la cuenta",
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Crear Cuenta</h2>
          <p className="text-gray-600">Completa la información para registrarte</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Nombre completo
                  </FormLabel>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <FormControl>
                      <Input
                        placeholder="Juan Pérez"
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
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Contraseña
                  </FormLabel>
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

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Confirmar contraseña
                  </FormLabel>
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

            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Acepto los{" "}
                      <a href="#" className="text-primary-600 hover:text-primary-500">
                        términos y condiciones
                      </a>
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Creando cuenta..." : "Crear cuenta"}
            </Button>
          </form>
        </Form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            ¿Ya tienes cuenta?{" "}
            <Button
              type="button"
              variant="link"
              className="font-medium text-primary-600 hover:text-primary-500 p-0"
              onClick={onSwitchToLogin}
            >
              Inicia sesión
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
