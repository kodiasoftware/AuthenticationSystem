/**
 * Tests para el componente LoginForm
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '@/components/auth/login-form';
import { useAuthStore } from '@/store/auth-store';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

// Mock de los hooks y dependencias
jest.mock('@/lib/queryClient', () => ({
  apiRequest: jest.fn(),
}));

jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}));

jest.mock('@/store/auth-store', () => ({
  useAuthStore: jest.fn(),
}));

jest.mock('wouter', () => ({
  useLocation: () => ['/login', jest.fn()],
}));

describe('LoginForm', () => {
  // Configuración de mocks antes de cada test
  beforeEach(() => {
    (useAuthStore as jest.Mock).mockReturnValue({
      login: jest.fn(),
    });
    
    (useToast as jest.Mock).mockReturnValue({
      toast: jest.fn(),
    });
    
    (apiRequest as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        success: true,
        data: {
          token: 'fake-token',
          user: { id: 1, name: 'Test User', email: 'test@example.com' },
        },
      }),
    });
  });

  // Limpiar mocks después de cada test
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test del renderizado del componente
  test('renders the login form correctly', () => {
    const mockSwitchToRegister = jest.fn();
    render(<LoginForm onSwitchToRegister={mockSwitchToRegister} />);
    
    // Verificar elementos del formulario
    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('tu@email.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Iniciar Sesión' })).toBeInTheDocument();
    expect(screen.getByText('Regístrate aquí')).toBeInTheDocument();
  });

  // Test del envío del formulario con datos válidos
  test('submits the form with valid data', async () => {
    const mockSwitchToRegister = jest.fn();
    const mockLogin = jest.fn();
    (useAuthStore as jest.Mock).mockReturnValue({ login: mockLogin });
    
    render(<LoginForm onSwitchToRegister={mockSwitchToRegister} />);
    
    // Llenar el formulario
    fireEvent.change(screen.getByPlaceholderText('tu@email.com'), {
      target: { value: 'test@example.com' },
    });
    
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'password123' },
    });
    
    // Enviar el formulario
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar Sesión' }));
    
    // Verificar que la API fue llamada con los datos correctos
    await waitFor(() => {
      expect(apiRequest).toHaveBeenCalledWith(
        'POST',
        '/api/auth/login',
        { email: 'test@example.com', password: 'password123' }
      );
    });
    
    // Verificar que el login fue llamado con los datos correctos
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(
        'fake-token',
        { id: 1, name: 'Test User', email: 'test@example.com' }
      );
    });
  });

  // Test del manejo de errores en el formulario
  test('handles login error correctly', async () => {
    const mockSwitchToRegister = jest.fn();
    const mockToast = jest.fn();
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
    
    // Simular error en la API
    (apiRequest as jest.Mock).mockRejectedValue(new Error('Credenciales inválidas'));
    
    render(<LoginForm onSwitchToRegister={mockSwitchToRegister} />);
    
    // Llenar el formulario
    fireEvent.change(screen.getByPlaceholderText('tu@email.com'), {
      target: { value: 'test@example.com' },
    });
    
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'password123' },
    });
    
    // Enviar el formulario
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar Sesión' }));
    
    // Verificar que se muestra el mensaje de error
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Error de inicio de sesión',
        description: 'Credenciales inválidas',
        variant: 'destructive',
      }));
    });
  });

  // Test del botón para cambiar a registro
  test('switches to register form when clicked', () => {
    const mockSwitchToRegister = jest.fn();
    render(<LoginForm onSwitchToRegister={mockSwitchToRegister} />);
    
    // Hacer clic en el enlace de registro
    fireEvent.click(screen.getByText('Regístrate aquí'));
    
    // Verificar que se llamó a la función para cambiar de vista
    expect(mockSwitchToRegister).toHaveBeenCalled();
  });
});
