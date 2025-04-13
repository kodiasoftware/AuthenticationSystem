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

            <div className="space-y-4">
              <Button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Creando cuenta..." : "Crear cuenta"}
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">O regístrate con</span>
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
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M22 5.59v12.82A3.59 3.59 0 0 1 18.41 22H5.59A3.59 3.59 0 0 1 2 18.41V5.59A3.59 3.59 0 0 1 5.59 2h12.82A3.59 3.59 0 0 1 22 5.59z"
                      stroke="#000"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16.3 9.05a3.25 3.25 0 1 0-3.25 3.25 3.25 3.25 0 0 0 3.25-3.25z"
                      stroke="#000"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M17.81 17.95a8.01 8.01 0 0 0-11.62 0"
                      stroke="#000"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  GitHub
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
