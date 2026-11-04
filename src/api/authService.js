import { apiClient } from './client';

export const authService = {
  // Iniciar sesión (POST /api/auth/login)
  login: async (email, password) => {
    const data = await apiClient('/auth/login', {
      body: { email, password },
    });
    if (data.token) {
      localStorage.setItem('aiva_token', data.token);
      localStorage.setItem('aiva_user_id', String(data.usuario.id));
      localStorage.setItem('aiva_user', JSON.stringify(data.usuario));
    }
    return data;
  },

  // Registro de nuevo usuario (POST /api/auth/registro)
  registro: async (nombre, email, password) => {
    return await apiClient('/auth/registro', {
      body: { nombre, email, password },
    });
  },

  // Cerrar sesión
  logout: async () => {
    try {
      await apiClient('/auth/logout', { method: 'POST' });
    } finally {
      localStorage.removeItem('aiva_token');
      localStorage.removeItem('aiva_user_id');
      localStorage.removeItem('aiva_user');
    }
  },
};

export default authService;