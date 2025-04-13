/**
 * Tests para el AuthStore
 */
import { act, renderHook } from '@testing-library/react-hooks';
import { useAuthStore } from '@/store/auth-store';
import { apiRequest } from '@/lib/queryClient';
import { getToken, getUser, saveToken, saveUser, clearAuth } from '@/utils/auth';

// Mock de las dependencias
jest.mock('@/lib/queryClient', () => ({
  apiRequest: jest.fn(),
}));

jest.mock('@/utils/auth', () => ({
  getToken: jest.fn(),
  getUser: jest.fn(),
  saveToken: jest.fn(),
  saveUser: jest.fn(),
  clearAuth: jest.fn(),
  isAuthenticated: jest.fn().mockReturnValue(false),
}));

describe('AuthStore', () => {
  // Limpiar mocks después de cada test
  afterEach(() => {
    jest.clearAllMocks();
    // Reiniciar el estado del store
    act(() => {
      const { result } = renderHook(() => useAuthStore());
      result.current.logout();
    });
  });

  // Test del estado inicial
  test('has the correct initial state', () => {
    const { result } = renderHook(() => useAuthStore());
    
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
    expect(result.current.token).toBe(null);
  });

  // Test de la función login
  test('login sets auth state correctly', () => {
    const { result } = renderHook(() => useAuthStore());
    
    const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' };
    const mockToken = 'fake-token';
    
    act(() => {
      result.current.login(mockToken, mockUser);
    });
    
    // Verificar que el estado se actualizó correctamente
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.token).toBe(mockToken);
    
    // Verificar que se llamaron las funciones de almacenamiento
    expect(saveToken).toHaveBeenCalledWith(mockToken);
    expect(saveUser).toHaveBeenCalledWith(mockUser);
  });

  // Test de la función logout
  test('logout clears auth state correctly', () => {
    const { result } = renderHook(() => useAuthStore());
    
    // Primero hacemos login
    const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' };
    const mockToken = 'fake-token';
    
    act(() => {
      result.current.login(mockToken, mockUser);
    });
    
    // Luego hacemos logout
    act(() => {
      result.current.logout();
    });
    
    // Verificar que el estado se limpió correctamente
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
    expect(result.current.token).toBe(null);
    
    // Verificar que se llamó a la función para limpiar el almacenamiento
    expect(clearAuth).toHaveBeenCalled();
  });

  // Test de la función checkAuth cuando el usuario está autenticado
  test('checkAuth verifies authentication correctly when authenticated', async () => {
    // Simular que hay un token
    (getToken as jest.Mock).mockReturnValue('fake-token');
    
    // Simular respuesta exitosa de la API
    (apiRequest as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        success: true,
        data: {
          user: { id: 1, name: 'Test User', email: 'test@example.com' },
        },
      }),
    });
    
    const { result } = renderHook(() => useAuthStore());
    
    // Ejecutar checkAuth
    let isAuthenticated;
    await act(async () => {
      isAuthenticated = await result.current.checkAuth();
    });
    
    // Verificar resultado
    expect(isAuthenticated).toBe(true);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual({ id: 1, name: 'Test User', email: 'test@example.com' });
  });

  // Test de la función checkAuth cuando el usuario no está autenticado
  test('checkAuth handles unauthenticated state correctly', async () => {
    // Simular que no hay token
    (getToken as jest.Mock).mockReturnValue(null);
    
    const { result } = renderHook(() => useAuthStore());
    
    // Ejecutar checkAuth
    let isAuthenticated;
    await act(async () => {
      isAuthenticated = await result.current.checkAuth();
    });
    
    // Verificar resultado
    expect(isAuthenticated).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
    
    // Verificar que no se llamó a la API
    expect(apiRequest).not.toHaveBeenCalled();
  });

  // Test de la función checkAuth cuando la API retorna error
  test('checkAuth handles API error correctly', async () => {
    // Simular que hay un token
    (getToken as jest.Mock).mockReturnValue('fake-token');
    
    // Simular error en la API
    (apiRequest as jest.Mock).mockRejectedValue(new Error('API error'));
    
    const { result } = renderHook(() => useAuthStore());
    
    // Ejecutar checkAuth
    let isAuthenticated;
    await act(async () => {
      isAuthenticated = await result.current.checkAuth();
    });
    
    // Verificar resultado
    expect(isAuthenticated).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
    
    // Verificar que se llamó a clearAuth debido al error
    expect(clearAuth).toHaveBeenCalled();
  });
});
