import { useState } from "react";
import { mockUsuario, mockModelosIA, mockProyectos } from "../data/mocks";

export function Main() {
  // Estados para simular la persistencia y reglas de negocio
  const [usuario, setUsuario] = useState(mockUsuario);
  const [proyectos, setProyectos] = useState(mockProyectos);

  // Estados del formulario para nuevo proyecto
  const [nombreProyecto, setNombreProyecto] = useState("");
  const [modeloSeleccionado, setModeloSeleccionado] = useState(mockModelosIA[0].id);
  const [duracion, setDuracion] = useState(15);
  const [mensajeError, setMensajeError] = useState("");

  // Estado para formulario de recarga
  const [montoRecarga, setMontoRecarga] = useState(500);
  const [mensajeRecarga, setMensajeRecarga] = useState("");

  // Modelo actualmente seleccionado para cálculos
  const modeloActual = mockModelosIA.find((m) => m.id === modeloSeleccionado) || mockModelosIA[0];
  const costoCalculado = duracion * modeloActual.costoPorSegundo;

  // Lógica Regla 1: Crear Proyecto de Renderizado y Descontar Créditos
  const handleCrearProyecto = (e) => {
    e.preventDefault();
    setMensajeError("");

    if (!nombreProyecto.trim()) {
      setMensajeError("Debe asignar un nombre al proyecto.");
      return;
    }

    if (usuario.creditosDisponibles < costoCalculado) {
      setMensajeError(
        `Créditos insuficientes. Requieres ${costoCalculado} y dispones de ${usuario.creditosDisponibles}.`
      );
      return;
    }

    // Descontar saldo del usuario
    setUsuario((prev) => ({
      ...prev,
      creditosDisponibles: prev.creditosDisponibles - costoCalculado,
    }));

    // Registrar nuevo proyecto
    const nuevoProyecto = {
      id: Date.now(),
      nombre: nombreProyecto,
      modeloIa: modeloActual.nombre,
      costoCreditos: costoCalculado,
      duracionSeg: Number(duracion),
      estado: "EN_PROCESO",
      fechaCreacion: new Date().toISOString(),
      urlPreview:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
    };

    setProyectos([nuevoProyecto, ...proyectos]);
    setNombreProyecto("");
  };

  // Lógica Regla 2: Recarga de Créditos con Bonificación (+20% si >= 500)
  const handleRecargarCreditos = (e) => {
    e.preventDefault();
    setMensajeRecarga("");

    const cantidad = Number(montoRecarga);
    if (cantidad <= 0) {
      setMensajeRecarga("El valor a recargar debe ser mayor a 0.");
      return;
    }

    let creditosFinales = cantidad;
    let bonoAplicado = false;

    if (cantidad >= 500) {
      creditosFinales += Math.floor(cantidad * 0.2);
      bonoAplicado = true;
    }

    setUsuario((prev) => ({
      ...prev,
      creditosDisponibles: prev.creditosDisponibles + creditosFinales,
    }));

    setMensajeRecarga(
      `¡Recarga exitosa! Se agregaron ${creditosFinales} créditos${
        bonoAplicado ? " (incluye bono del 20%)" : ""
      }.`
    );
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 text-slate-100">
      
      {/* Encabezado Principal y Saldo */}
      <section className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-lg">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Generador de Video IA
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            Crea, renderiza y administra producciones audiovisuales con modelos de última generación.
          </p>
        </div>
        <div className="bg-slate-900 border border-slate-700/80 px-5 py-3 rounded-xl flex items-center gap-4">
          <div>
            <span className="text-xs text-slate-400 block font-medium uppercase">Saldo Actual</span>
            <span className="text-xl font-bold text-amber-400 flex items-center gap-1">
              ⚡ {usuario.creditosDisponibles} <span className="text-xs text-slate-400">créditos</span>
            </span>
          </div>
          <span className="px-2.5 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
            {usuario.suscripcionActiva ? "PRO ACTIVO" : "INACTIVO"}
          </span>
        </div>
      </section>

      {/* Grid: Formulario de Generación + Panel de Recargas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Formulario Crear Proyecto (Regla 1) */}
        <section className="lg:col-span-2 bg-slate-800/60 border border-slate-700 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🎬</span> Nueva Generación de Video
          </h2>

          {mensajeError && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm">
              {mensajeError}
            </div>
          )}

          <form onSubmit={handleCrearProyecto} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Nombre del Proyecto
              </label>
              <input
                type="text"
                value={nombreProyecto}
                onChange={(e) => setNombreProyecto(e.target.value)}
                placeholder="Ej. Anuncio Cinemático Producto"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Modelo de IA
                </label>
                <select
                  value={modeloSeleccionado}
                  onChange={(e) => setModeloSeleccionado(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  {mockModelosIA.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nombre} ({m.costoPorSegundo} cr/seg)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Duración ({duracion} segundos)
                </label>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="5"
                  value={duracion}
                  onChange={(e) => setDuracion(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 mt-3"
                />
              </div>
            </div>

            {/* Resumen del Costo */}
            <div className="bg-slate-900/80 border border-slate-700/60 p-3 rounded-lg flex justify-between items-center text-xs">
              <span className="text-slate-400">Costo estimado de render:</span>
              <span className="font-bold text-amber-400 text-sm">{costoCalculado} Créditos</span>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors shadow-sm text-sm"
            >
              Comenzar Renderizado
            </button>
          </form>
        </section>

        {/* Panel de Recarga de Créditos (Regla 2) */}
        <section className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <span>💳</span> Recargar Créditos
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Bonificación automática: Si recargas <strong>500 créditos o más</strong>, obtienes un <strong>20% extra</strong> de cortesía.
            </p>

            {mensajeRecarga && (
              <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
                {mensajeRecarga}
              </div>
            )}

            <form onSubmit={handleRecargarCreditos} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Cantidad a recargar
                </label>
                <input
                  type="number"
                  min="50"
                  step="50"
                  value={montoRecarga}
                  onChange={(e) => setMontoRecarga(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="text-xs text-slate-400 bg-slate-900/50 p-2.5 rounded-lg border border-slate-700/50">
                Total a recibir:{" "}
                <span className="font-bold text-white">
                  {Number(montoRecarga) >= 500
                    ? Number(montoRecarga) + Math.floor(Number(montoRecarga) * 0.2)
                    : Number(montoRecarga)}{" "}
                  créditos
                </span>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
              >
                Confirmar Recarga
              </button>
            </form>
          </div>
        </section>

      </div>

      {/* Lista / Galería de Proyectos */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white">Tus Proyectos de Video</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {proyectos.map((p) => (
            <div
              key={p.id}
              className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-sm hover:border-slate-600 transition-all flex flex-col"
            >
              <img
                src={p.urlPreview}
                alt={p.nombre}
                className="w-full h-36 object-cover opacity-80 hover:opacity-100 transition-opacity"
              />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <h3 className="font-semibold text-white text-base truncate">{p.nombre}</h3>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                        p.estado === "FINALIZADO"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}
                    >
                      {p.estado}
                    </span>
                  </div>
                  <p className="text-xs text-indigo-400 font-medium">{p.modeloIa}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700/60 flex justify-between items-center text-xs text-slate-400">
                  <span>⏱ {p.duracionSeg} seg</span>
                  <span>⚡ {p.costoCreditos} cr</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}