/**
 * Componente de pie de página para el sistema de autenticación
 * 
 * Este componente muestra información de copyright en el pie de página
 * y se utiliza en todas las páginas del sistema de autenticación.
 */
export function AuthFooter() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <p className="text-sm text-center text-gray-500">
          &copy; {currentYear} Sistema de Autenticación. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
