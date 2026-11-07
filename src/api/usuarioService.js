import { apiClient } from './client';

export const usuarioService = {
  /**
   * REGLA 2: Recarga de Créditos con Bonificación (+20% si >= 500)
   * POST /api/users/{userId}/credits
   */
  recargarCreditos: async (usuarioId, cantidad) => {
    if (!usuarioId || cantidad === undefined) {
      throw new Error('Se requiere el identificador de usuario y la cantidad a recargar.');
    }
    return await apiClient(`/users/${usuarioId}/credits`, {
      body: { cantidad: Number(cantidad) },
    });
  },

  // Consultar perfil/saldo actualizado (GET /api/users/{userId})
  obtenerPerfil: async (usuarioId) => {
    if (!usuarioId) {
      throw new Error('Se requiere el identificador de usuario para consultar el perfil.');
    }
    return await apiClient(`/users/${usuarioId}`);
  },

  // Movimientos de créditos (GET /api/users/{userId}/credits)
  listarMovimientos: async (usuarioId) => {
    if (!usuarioId) {
      throw new Error('Se requiere el identificador de usuario para consultar los movimientos.');
    }
    return await apiClient(`/users/${usuarioId}/credits`);
  },

    // Editar cuenta (PUT /api/users/{userId})
  actualizarPerfil: async (usuarioId, { nombre, email }) => {
    if (!usuarioId) throw new Error('Se requiere el identificador de usuario.');
    return await apiClient(`/users/${usuarioId}`, {
      method: 'PUT',
      body: { nombre, email },
    });
  },

  // Cambiar contraseña (PATCH /api/users/{userId}/password)
  cambiarPassword: async (usuarioId, { passwordActual, passwordNueva }) => {
    if (!usuarioId) throw new Error('Se requiere el identificador de usuario.');
    return await apiClient(`/users/${usuarioId}/password`, {
      method: 'PATCH',
      body: { passwordActual, passwordNueva },
    });
  },
};

export default usuarioService;