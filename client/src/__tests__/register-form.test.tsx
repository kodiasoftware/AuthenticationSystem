/**
 * Tests para el componente RegisterForm
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RegisterForm } from '@/components/auth/register-form';
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
  useLocation: () => ['/register', jest.fn()],
}));

describe('RegisterForm', () => {
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
  test('renders the register form correctly', () => {
    const mockSwitchToLogin = jest.fn();
    render(<RegisterForm onSwitchToLogin={mockSwitchToLogin} />);
    
    // Verificar elementos del formulario
    expect(screen.getByText('Crear Cuenta')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('tu@email.com')).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText('••••••••')[0]).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText('••••••••')[1]).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Crear cuenta' })).toBeInTheDocument();
    expect(screen.getByText('Inicia sesión')).toBeInTheDocument();
  });

  // Test del envío del formulario con datos válidos
  test('submits the form with valid data', async () => {
    const mockSwitchToLogin = jest.fn();
    const mockLogin = jest.fn();
    (useAuthStore as jest.Mock).mockReturnValue({ login: mockLogin });
    
    render(<RegisterForm onSwitchToLogin={mockSwitchToLogin} />);
    
    // Llenar el formulario
    fireEvent.change(screen.getByPlaceholderText('Juan Pérez'), {
      target: { value: 'Test User' },
    });
    
    fireEvent.change(screen.getByPlaceholderText('tu@email.com'), {
      target: { value: 'test@example.com' },
    });
    
    fireEvent.change(screen.getAllByPlaceholderText('••••••••')[0], {
      target: { value: 'password123' },
    });
    
    fireEvent.change(screen.getAllByPlaceholderText('••••••••')[1], {
      target: { value: 'password123' },
    });
    
    // Marcar la casilla de términos y condiciones
    fireEvent.click(screen.getByRole('checkbox'));
    
    // Enviar el formulario
    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    
    // Verificar que la API fue llamada con los datos correctos
    await waitFor(() => {
      expect(apiRequest).toHaveBeenCalledWith(
        'POST',
        '/api/auth/register',
        { name: 'Test User', email: 'test@example.com', password: 'password123' }
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
  test('handles registration error correctly', async () => {
    const mockSwitchToLogin = jest.fn();
    const mockToast = jest.fn();
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
    
    // Simular error en la API
    (apiRequest as jest.Mock).mockRejectedValue(new Error('El usuario con este correo ya existe'));
    
    render(<RegisterForm onSwitchToLogin={mockSwitchToLogin} />);
    
    // Llenar el formulario
    fireEvent.change(screen.getByPlaceholderText('Juan Pérez'), {
      target: { value: 'Test User' },
    });
    
    fireEvent.change(screen.getByPlaceholderText('tu@email.com'), {
      target: { value: 'test@example.com' },
    });
    
    fireEvent.change(screen.getAllByPlaceholderText('••••••••')[0], {
      target: { value: 'password123' },
    });
    
    fireEvent.change(screen.getAllByPlaceholderText('••••••••')[1], {
      target: { value: 'password123' },
    });
    
    // Marcar la casilla de términos y condiciones
    fireEvent.click(screen.getByRole('checkbox'));
    
    // Enviar el formulario
    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    
    // Verificar que se muestra el mensaje de error
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Error de registro',
        description: 'El usuario con este correo ya existe',
        variant: 'destructive',
      }));
    });
  });

  // Test de validación de contraseña coincidente
  test('validates matching passwords', async () => {
    const mockSwitchToLogin = jest.fn();
    render(<RegisterForm onSwitchToLogin={mockSwitchToLogin} />);
    
    // Llenar el formulario con contraseñas que no coinciden
    fireEvent.change(screen.getByPlaceholderText('Juan Pérez'), {
      target: { value: 'Test User' },
    });
    
    fireEvent.change(screen.getByPlaceholderText('tu@email.com'), {
      target: { value: 'test@example.com' },
    });
    
    fireEvent.change(screen.getAllByPlaceholderText('••••••••')[0], {
      target: { value: 'password123' },
    });
    
    fireEvent.change(screen.getAllByPlaceholderText('••••••••')[1], {
      target: { value: 'differentpassword' },
    });
    
    // Marcar la casilla de términos y condiciones
    fireEvent.click(screen.getByRole('checkbox'));
    
    // Enviar el formulario
    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    
    // Verificar que aparece un mensaje de error sobre contraseñas
    await waitFor(() => {
      expect(screen.getByText('Las contraseñas no coinciden')).toBeInTheDocument();
    });
  });

  // Test del botón para cambiar a inicio de sesión
  test('switches to login form when clicked', () => {
    const mockSwitchToLogin = jest.fn();
    render(<RegisterForm onSwitchToLogin={mockSwitchToLogin} />);
    
    // Hacer clic en el enlace de inicio de sesión
    fireEvent.click(screen.getByText('Inicia sesión'));
    
    // Verificar que se llamó a la función para cambiar de vista
    expect(mockSwitchToLogin).toHaveBeenCalled();
  });
});
