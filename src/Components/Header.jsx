import { mockUsuario } from "../data/mocks";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-sm text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo y Branding */}
          <div className="flex-shrink-0 flex items-center">
            <a href="#" className="flex items-center gap-2">
              <span className="p-2 bg-indigo-600 rounded-lg text-white font-bold text-lg leading-none">
                AI
              </span>
              <span className="font-bold text-xl tracking-tight text-white">
                AIVA <span className="text-indigo-400 font-light">Studio</span>
              </span>
            </a>
          </div>

          {/* Navegación Principal */}
          <nav className="hidden md:flex space-x-6 text-sm font-medium">
            <a href="#proyectos" className="text-slate-300 hover:text-indigo-400 transition-colors">
              Proyectos
            </a>
            <a href="#modelos" className="text-slate-300 hover:text-indigo-400 transition-colors">
              Modelos IA
            </a>
            <a href="#recargar" className="text-slate-300 hover:text-indigo-400 transition-colors">
              Recargar Créditos
            </a>
          </nav>

          {/* Información del Usuario y Créditos */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Badge de Créditos */}
            <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-full text-xs font-medium">
              <span className="text-amber-400">⚡</span>
              <span className="text-slate-300">Créditos:</span>
              <span className="text-white font-bold">{mockUsuario.creditosDisponibles}</span>
            </div>

            {/* Identificación de Usuario */}
            <div className="flex items-center gap-2 text-xs text-slate-400 border-l border-slate-700 pl-4">
              <div className="w-7 h-7 rounded-full bg-indigo-700 flex items-center justify-center text-white font-bold text-xs uppercase">
                {mockUsuario.email.charAt(0)}
              </div>
              <span className="truncate max-w-[140px]">{mockUsuario.email}</span>
            </div>
          </div>

          {/* Botón Menú Móvil */}
          <div className="md:hidden flex items-center">
            <button className="text-slate-400 hover:text-white focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}