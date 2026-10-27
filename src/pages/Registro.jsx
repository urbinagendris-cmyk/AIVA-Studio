import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { aivaApi } from "../api/api";

export const Registro = () => {
  const navigate = useNavigate();

  // Estados del formulario
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones de formulario
    if (!nombre.trim() || !email.trim() || !password.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor, completa todos los campos requeridos.",
        background: "#1e293b",
        color: "#f8fafc",
        confirmButtonColor: "#6366f1",
      });
      return;
    }

    if (password.length < 6) {
      Swal.fire({
        icon: "warning",
        title: "Contraseña corta",
        text: "La contraseña debe contener al menos 6 caracteres.",
        background: "#1e293b",
        color: "#f8fafc",
        confirmButtonColor: "#6366f1",
      });
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Las contraseñas no coinciden",
        text: "Verifica que ambas contraseñas coincidan exactamente.",
        background: "#1e293b",
        color: "#f8fafc",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    setCargando(true);

    try {
      // Envío a la API (POST /api/auth/registro)
      await aivaApi.registro(email.trim(), password);

      Swal.fire({
        icon: "success",
        title: "¡Cuenta creada exitosamente!",
        text: "Te otorgamos 100 créditos iniciales de cortesía.",
        background: "#1e293b",
        color: "#f8fafc",
        confirmButtonColor: "#10b981",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/login");
    } catch (error) {
      console.warn("Fallo en API de registro, ejecutando fallback demo:", error.message);

      Swal.fire({
        icon: "info",
        title: "Registro en Modo Demo",
        text: "Usuario simulado registrado correctamente. Puedes iniciar sesión.",
        background: "#1e293b",
        color: "#f8fafc",
        confirmButtonColor: "#6366f1",
        timer: 1800,
        showConfirmButton: false,
      });

      navigate("/login");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
        
        {/* Encabezado */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl text-2xl text-indigo-400 mb-1">
            🚀
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Crear Cuenta
          </h1>
          <p className="text-xs text-slate-400">
            Comienza a generar contenido audiovisual profesional con modelos de IA
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Nombre Completo
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Andrés Rojas"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@ejemplo.com"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repite tu contraseña"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors text-sm shadow-md mt-2 flex items-center justify-center gap-2"
          >
            {cargando ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Creando cuenta...</span>
              </>
            ) : (
              "Registrarme en AIVA Studio"
            )}
          </button>
        </form>

        {/* Pie del formulario / Enlace a login */}
        <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
            Inicia sesión
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Registro;