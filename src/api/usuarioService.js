import { apiClient } from './client';

export const usuarioService = {
  /**
   * REGLA 2: Recarga de Créditos con Bonificación (+20% si >= 500)
   * POST /api/aiva/usuarios/recargar
   */
  recargarCreditos: async (usuarioId, cantidad) => {
    if (!usuarioId || cantidad === undefined) {
      throw new Error('Se requiere el identificador de usuario y la cantidad a recargar.');
    }
    return await apiClient('/aiva/usuarios/recargar', {
      body: {
        usuarioId,
        cantidad: Number(cantidad),
      },
    });
  },

  // Consultar perfil/saldo actualizado (GET /api/aiva/usuarios/:id)
  obtenerPerfil: async (usuarioId) => {
    if (!usuarioId) {
      throw new Error('Se requiere el identificador de usuario para consultar el perfil.');
    }
    return await apiClient(`/aiva/usuarios/${usuarioId}`);
  },
};

export default usuarioService;