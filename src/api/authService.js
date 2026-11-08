import { apiClient } from './client';

export const authService = {
  // Iniciar sesión (POST /api/sessions)
  login: async (email, password) => {
    const data = await apiClient('/sessions', {
      body: { email, password },
    });
    if (data.token) {
      localStorage.setItem('aiva_token', data.token);
      localStorage.setItem('aiva_user_id', String(data.usuario.id));
      localStorage.setItem('aiva_user', JSON.stringify(data.usuario));
    }
    return data;
  },

  // Registro de nuevo usuario (POST /api/users)
  registro: async (nombre, email, password) => {
    return await apiClient('/users', {
      body: { nombre, email, password },
    });
  },

  // Cerrar sesión (DELETE /api/sessions/current)
  logout: async () => {
    try {
      await apiClient('/sessions/current', { method: 'DELETE' });
    } finally {
      localStorage.removeItem('aiva_token');
      localStorage.removeItem('aiva_user_id');
      localStorage.removeItem('aiva_user');
    }
  },

    // Solicitar enlace de recuperación (POST /api/password-resets)
  solicitarRecuperacion: async (email) => {
    return await apiClient('/password-resets', { body: { email } });
  },

  // Guardar la nueva contraseña (POST /api/password-resets/confirm)
  restablecerPassword: async (token, passwordNueva) => {
    return await apiClient('/password-resets/confirm', { body: { token, passwordNueva } });
  },
};

export default authService;