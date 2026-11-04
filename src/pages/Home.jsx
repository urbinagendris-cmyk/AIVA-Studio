import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Card from "../components/Cards";
import { aivaApi } from "../api/api";
import {
  calculateRenderCost,
  calculateCreditRecharge,
  hasSufficientCredits,
  formatCredits,
} from "../helpers/businessRules";

export const Home = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [proyectos, setProyectos] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [cargandoSesion, setCargandoSesion] = useState(true);
  const [errorApi, setErrorApi] = useState("");

  // Estados del formulario para nuevo proyecto
  const [nombreProyecto, setNombreProyecto] = useState("");
  const [modeloSeleccionado, setModeloSeleccionado] = useState("");
  const [duracion, setDuracion] = useState(15);
  const [cargando, setCargando] = useState(false);

  // Estado para formulario de recarga
  const [montoRecarga, setMontoRecarga] = useState(500);

  useEffect(() => {
    const userId = localStorage.getItem("aiva_user_id");
    if (!localStorage.getItem("aiva_token") || !userId) {
      navigate("/login", { replace: true });
      return;
    }

    let active = true;
    Promise.all([
      aivaApi.obtenerPerfil(userId),
      aivaApi.listarProyectos(userId),
      aivaApi.listarModelos(),
    ])
      .then(([profile, projects, availableModels]) => {
        if (!active) return;
        setUsuario(profile);
        setProyectos(projects);
        setModelos(availableModels);
        setModeloSeleccionado(availableModels[0]?.id || "");
      })
      .catch((error) => {
        if (active) setErrorApi(error.message);
      })
      .finally(() => {
        if (active) setCargandoSesion(false);
      });

    return () => {
      active = false;
    };
  }, [navigate]);

  const modeloActual = modelos.find((model) => model.id === modeloSeleccionado);
  const costoCalculado = modeloActual
    ? calculateRenderCost(duracion, modeloActual.costoPorSegundo)
    : 0;
  const recargaCalculada = calculateCreditRecharge(montoRecarga);

  // Regla 1: Crear Proyecto de Renderizado y Descontar Créditos
  const handleCrearProyecto = async (e) => {
    e.preventDefault();

    if (!nombreProyecto.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Campo requerido",
        text: "Debe asignar un nombre al proyecto.",
        background: "#1e293b",
        color: "#f8fafc",
        confirmButtonColor: "#6366f1",
      });
      return;
    }

    if (!hasSufficientCredits(usuario.creditosDisponibles, costoCalculado)) {
      Swal.fire({
        icon: "error",
        title: "Créditos insuficientes",
        text: `Requieres ${formatCredits(costoCalculado)} créditos y dispones de ${formatCredits(usuario.creditosDisponibles)}.`,
        background: "#1e293b",
        color: "#f8fafc",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    setCargando(true);
    try {
      const newProject = await aivaApi.crearProyecto({
        usuarioId: usuario.id,
        nombre: nombreProyecto.trim(),
        prompt: nombreProyecto.trim(),
        modelId: modeloActual.id,
        modeloIa: modeloActual.nombre,
        costoCreditos: costoCalculado,
        duracionSeg: Number(duracion),
        formato: "16:9",
        estilo: "Cinematográfico",
      });
      setUsuario((current) => ({
        ...current,
        creditosDisponibles: newProject.creditosDisponibles,
      }));
      setProyectos((current) => [newProject, ...current]);
      setNombreProyecto("");

      Swal.fire({
        icon: "success",
        title: "¡Proyecto enviado!",
        text: `El video "${newProject.nombre}" entró a cola de renderizado.`,
        background: "#1e293b",
        color: "#f8fafc",
        confirmButtonColor: "#6366f1",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "No se pudo crear el proyecto",
        text: error.message,
        background: "#1e293b",
        color: "#f8fafc",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setCargando(false);
    }
  };

  // Regla 2: Recarga con Bonificación (+20% si >= 500)
  const handleRecargarCreditos = async (e) => {
    e.preventDefault();

    const cantidad = Number(montoRecarga);
    if (!Number.isInteger(cantidad) || cantidad < 50) {
      Swal.fire({
        icon: "warning",
        title: "Monto inválido",
        text: "La recarga mínima es de 50 créditos enteros.",
        background: "#1e293b",
        color: "#f8fafc",
        confirmButtonColor: "#6366f1",
      });
      return;
    }

    try {
      const recharge = await aivaApi.recargarCreditos(usuario.id, cantidad);
      setUsuario((current) => ({
        ...current,
        creditosDisponibles: recharge.creditosDisponibles,
      }));
      Swal.fire({
        icon: "success",
        title: "Recarga de prueba registrada",
        text: `Se agregaron ${formatCredits(recharge.totalRecargado)} créditos${
          recharge.bonificacion
            ? ` (incluye bono de ${formatCredits(recharge.bonificacion)} cr)`
            : ""
        }. El pago real requiere una pasarela.`,
        background: "#1e293b",
        color: "#f8fafc",
        confirmButtonColor: "#10b981",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "No se pudo registrar la recarga",
        text: error.message,
        background: "#1e293b",
        color: "#f8fafc",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  if (cargandoSesion) {
    return <main className="mx-auto max-w-7xl px-4 py-12 text-slate-300">Cargando tu espacio AIVA...</main>;
  }
  if (errorApi || !usuario) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12 text-slate-100">
        <p role="alert" className="text-red-400">{errorApi || "No se pudo cargar tu cuenta."}</p>
        <button className="mt-4 text-indigo-300 underline" onClick={() => navigate("/login")}>Volver a iniciar sesión</button>
      </main>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 text-slate-100">
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
              ⚡ {formatCredits(usuario.creditosDisponibles)} <span className="text-xs text-slate-400">créditos</span>
            </span>
          </div>
          <span className="px-2.5 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
            {usuario.suscripcionActiva ? "PRO ACTIVO" : "INACTIVO"}
          </span>
        </div>
      </section>

      {/* Grid: Formulario de Generación + Panel de Recargas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario Crear Proyecto */}
        <section className="lg:col-span-2 bg-slate-800/60 border border-slate-700 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🎬</span> Nueva Generación de Video
          </h2>

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
                  {modelos.map((m) => (
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
                <select
                  value={duracion}
                  onChange={(e) => setDuracion(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  {[5, 10, 15, 30, 45, 60].map((seconds) => (
                    <option key={seconds} value={seconds}>{seconds} segundos</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Resumen del Costo */}
            <div className="bg-slate-900/80 border border-slate-700/60 p-3 rounded-lg flex justify-between items-center text-xs">
              <span className="text-slate-400">Costo estimado de render:</span>
              <span className="font-bold text-amber-400 text-sm">{formatCredits(costoCalculado)} Créditos</span>
            </div>

            <button
              type="submit"
              disabled={cargando || !modeloActual}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors shadow-sm text-sm"
            >
              {cargando ? "Enviando a la cola..." : "Comenzar Renderizado"}
            </button>
          </form>
        </section>

        {/* Panel de Recarga de Créditos */}
        <section className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <span>💳</span> Recargar Créditos
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Bonificación automática: Si recargas <strong>500 créditos o más</strong>, obtienes un <strong>20% extra</strong> de cortesía.
            </p>

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
                  {formatCredits(recargaCalculada.total)} créditos{" "}
                  {recargaCalculada.hasBonus && (
                    <small className="text-emerald-400">(+{formatCredits(recargaCalculada.bonus)} bono)</small>
                  )}
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

      {/* Lista / Galería mapeando el componente Card */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white">Tus Proyectos de Video</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {proyectos.map((p) => (
            <Card key={p.id} proyecto={p} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;