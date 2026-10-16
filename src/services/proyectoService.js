import { apiClient } from './client';

export const proyectoService = {
  /**
   * REGLA 1: Crear Proyecto de Renderizado y Descontar Créditos
   * POST /api/aiva/proyectos/crear
   */
  crearProyecto: async ({ usuarioId, nombre, modeloIa, costoCreditos, duracionSeg }) => {
    return await apiClient('/aiva/proyectos/crear', {
      body: {
        usuarioId,
        nombre,
        modeloIa,
        costoCreditos,
        duracionSeg,
      },
    });
  },

  // Listar proyectos del usuario (GET /api/aiva/proyectos/usuario/:id)
  listarPorUsuario: async (usuarioId) => {
    return await apiClient(`/aiva/proyectos/usuario/${usuarioId}`);
  },
};