/**
 * Componente de cabecera para el sistema de autenticación
 * 
 * Este componente muestra un encabezado con el título de la aplicación
 * y se utiliza en todas las páginas del sistema de autenticación.
 */
export function AuthHeader({ title = "Sistema de Autenticación" }: { title?: string }) {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
      </div>
    </header>
  );
}
