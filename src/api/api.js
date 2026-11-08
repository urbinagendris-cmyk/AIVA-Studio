import { authService } from './authService';
import { proyectoService } from './proyectoService';
import { usuarioService } from './usuarioService';
import { apiClient } from './client';

export { authService, proyectoService, usuarioService };

// Fachada principal unificada para consumo en componentes
export const aivaApi = {
  // Auth
  login: authService.login,
  registro: authService.registro,
  logout: authService.logout,
  solocitarRecuperacion: authService.solicitarRecuperacion,
  restablecerPassword: authService.restablecerPassword,

  // Regla 1: Proyectos y deducción de créditos
  crearProyecto: proyectoService.crearProyecto,
  listarProyectos: proyectoService.listarPorUsuario,
  eliminarProyecto: proyectoService.eliminar,

  // Regla 2: Recarga con bonificación
  recargarCreditos: usuarioService.recargarCreditos,
  obtenerPerfil: usuarioService.obtenerPerfil,
  listarMovimientos: usuarioService.listarMovimientos,

  // Edi|ción de perfil y cambio de contraseña
  actualizarPerfil: usuarioService.actualizarPerfil,
  cambiarPassword: usuarioService.cambiarPassword,

  // Catálogo de modelos habilitados en el backend
  listarModelos: () => apiClient('/ai-models'),

  // Recuperación de contraseña
  solicitarRecuperacion: authService.solicitarRecuperacion,
  restablecerPassword: authService.restablecerPassword,
  
};

export default aivaApi;

