import { apiClient } from './client';

export const authService = {
  // Iniciar sesión (POST /api/auth/login)
  login: async (email, password) => {
    const data = await apiClient('/auth/login', {
      body: { email, password },
    });
    if (data.token) {
      localStorage.setItem('aiva_token', data.token);
    }
    return data;
  },

  // Registro de nuevo usuario (POST /api/auth/registro)
  registro: async (email, password) => {
    return await apiClient('/auth/registro', {
      body: { email, password },
    });
  },

  // Cerrar sesión
  logout: () => {
    localStorage.removeItem('aiva_token');
  },
};