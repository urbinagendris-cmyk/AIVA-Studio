import { authService } from './authService';
import { proyectoService } from './proyectoService';
import { usuarioService } from './usuarioService';

export { authService, proyectoService, usuarioService };

// Fachada principal unificada para consumo en componentes
export const aivaApi = {
  // Auth
  login: authService.login,
  registro: authService.registro,
  logout: authService.logout,

  // Regla 1: Proyectos y deducción de créditos
  crearProyecto: proyectoService.crearProyecto,
  listarProyectos: proyectoService.listarPorUsuario,

  // Regla 2: Recarga con bonificación
  recargarCreditos: usuarioService.recargarCreditos,
  obtenerPerfil: usuarioService.obtenerPerfil,
};