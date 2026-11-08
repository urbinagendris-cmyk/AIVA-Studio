import { apiClient } from './client';

export const proyectoService = {
  /**
   * REGLA 1: Crear Proyecto de Renderizado y Descontar Créditos
   * POST /api/projects
   *
   * El backend toma el usuario del token y calcula el costo con el modelo y la duración,
   * por eso ya no se envían usuarioId, modeloIa ni costoCreditos.
   */
  crearProyecto: async ({ nombre, prompt, modelId, duracionSeg, formato, estilo, tags }) => {
    return await apiClient('/projects', {
      body: { nombre, prompt, modelId, duracionSeg, formato, estilo, tags },
    });
  },

  // Listar proyectos del usuario (GET /api/users/{userId}/projects?estado=)
  listarPorUsuario: async (usuarioId, estado) => {
    if (!usuarioId) {
      throw new Error('Se requiere el identificador de usuario para consultar los proyectos.');
    }
    const query = estado ? `?estado=${encodeURIComponent(estado)}` : '';
    return await apiClient(`/users/${usuarioId}/projects${query}`);
  },

  // Eliminar proyecto (DELETE /api/projects/{id})
  eliminar: async (proyectoId) => {
    if (!proyectoId) {
      throw new Error('Se requiere el identificador del proyecto.');
    }
    return await apiClient(`/projects/${proyectoId}`, { method: 'DELETE' });
  },
};

export default proyectoService;