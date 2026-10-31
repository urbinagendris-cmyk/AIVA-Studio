import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-sm text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo y Branding */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <span className="p-2 bg-indigo-600 rounded-lg text-white font-bold text-lg leading-none">
                AI
              </span>
              <span className="font-bold text-xl tracking-tight text-white">
                AIVA <span className="text-indigo-400 font-light">Studio</span>
              </span>
            </Link>
          </div>

          {/* Navegación Principal */}
          <nav className="hidden md:flex space-x-6 text-sm font-medium">
            <Link to="/proyectos" className="text-slate-300 hover:text-indigo-400 transition-colors">
              Proyectos
            </Link>
            <Link to="/modelos" className="text-slate-300 hover:text-indigo-400 transition-colors">
              Modelos IA
            </Link>
            <Link to="/creditos" className="text-slate-300 hover:text-indigo-400 transition-colors">
              Recargar Créditos
            </Link>
          </nav>

          {/* Información del Usuario y Créditos */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/workspace" className="text-sm font-semibold text-indigo-300 hover:text-indigo-200">
              Abrir mi estudio
            </Link>
          </div>

          {/* Botón Menú Móvil */}
          <div className="md:hidden flex items-center">
            <button className="text-slate-400 hover:text-white focus:outline-none" aria-label="Abrir menú">
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

export default Header;