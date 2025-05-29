import { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// Instance Axios configurée pour l'API
const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true, // Essentiel pour les cookies
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState({
    init: true,       // Chargement initial
    action: false     // Chargement pendant les actions
  });
  const [error, setError] = useState(null);

  // Intercepteur pour gérer les erreurs globales
  useEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      response => response,
      async (error) => {
        if (error.response?.status === 401) {
          await logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  // Fonction pour obtenir le token CSRF
  const ensureCsrfToken = async () => {
    try {
      await api.get('/sanctum/csrf-cookie');
    } catch (error) {
      console.error('CSRF Token Error:', error);
      throw error;
    }
  };

  // Initialisation de l'authentification
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await ensureCsrfToken();
        const { data } = await api.get('/api/user');
        setUser(data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(prev => ({ ...prev, init: false }));
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(prev => ({ ...prev, action: true }));
      
      // Étape cruciale - Obtenir le cookie CSRF avant le login
      await ensureCsrfToken();
      
      const response = await api.post('/api/login', credentials);
      
      // Après login, vérifiez l'utilisateur
      const userResponse = await api.get('/api/user');
      setUser(userResponse.data);
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Login Error:', error.response?.data);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

  const register = async (userData) => {
    try {
      setLoading(prev => ({ ...prev, action: true }));
      setError(null);
      
      // 1. Obtenir le token CSRF
      await getCsrfToken();
      
      // 2. Faire la requête d'inscription
      const response = await api.post('/api/register', userData);
      
      // 3. Récupérer les infos utilisateur
      const userResponse = await api.get('/api/user');
      setUser(userResponse.data);
      
      return { success: true, data: response.data };
    } catch (error) {
      const errorData = error.response?.data?.errors || 
                       { message: error.response?.data?.message || 'Échec de l\'inscription' };
      setError(errorData);
      return { success: false, error: errorData };
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

  const logout = async () => {
    try {
      setLoading(prev => ({ ...prev, action: true }));
      await api.post('/api/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setError(null);
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    clearError: () => setError(null)
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading.init && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};