import { NavLink } from "react-router-dom";

const menuItems = [
  { path: "/", label: "Panel Principal", icon: "📊" },
  { path: "/proyectos", label: "Mis Proyectos", icon: "📁" },
  { path: "/modelos", label: "Modelos IA", icon: "🤖" },
  { path: "/creditos", label: "Billetera & Créditos", icon: "⚡" },
  { path: "/preferencias", label: "Configuración", icon: "⚙️" },
];

export const Aside = () => {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col justify-between hidden lg:flex min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        <div className="px-3 py-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Navegación
          </p>
        </div>

        <nav className="space-y-1.5" aria-label="Navegación lateral">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Tarjeta de estado de suscripción */}
      <div className="bg-slate-800/70 border border-slate-700/60 rounded-xl p-3.5 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Plan Actual</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold text-[10px]">
            CREATOR
          </span>
        </div>
        <p className="text-xs text-slate-300">
          Renderizado acelerado por GPU activo.
        </p>
      </div>
    </aside>
  );
};

export default Aside;