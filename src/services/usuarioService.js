import { apiClient } from './client';

export const usuarioService = {
  /**
   * REGLA 2: Recarga de Créditos con Bonificación (+20% si >= 500)
   * POST /api/aiva/usuarios/recargar
   */
  recargarCreditos: async (usuarioId, cantidad) => {
    return await apiClient('/aiva/usuarios/recargar', {
      body: {
        usuarioId,
        cantidad,
      },
    });
  },

  // Consultar perfil/saldo actualizado (GET /api/aiva/usuarios/:id)
  obtenerPerfil: async (usuarioId) => {
    return await apiClient(`/aiva/usuarios/${usuarioId}`);
  },
};