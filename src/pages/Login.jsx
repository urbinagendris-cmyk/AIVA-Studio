import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { aivaApi } from "../api/api";

export const Login = () => {
  const navigate = useNavigate();

  // Estados del formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones básicas de entrada
    if (!email.trim() || !password.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor, ingresa tu correo electrónico y contraseña.",
        background: "#1e293b",
        color: "#f8fafc",
        confirmButtonColor: "#6366f1",
      });
      return;
    }

    setCargando(true);

    try {
      // Llamada al endpoint de autenticación POST /api/sessions
      await aivaApi.login(email.trim(), password);

      Swal.fire({
        icon: "success",
        title: "¡Bienvenido a AIVA Studio!",
        text: "Sesión iniciada correctamente.",
        background: "#1e293b",
        color: "#f8fafc",
        showConfirmButton: false,
        timer: 1500,
      });

      // Abre directamente el espacio conectado a la API después del login.
      navigate("/workspace");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "No se pudo iniciar sesión",
        text: error.message,
        background: "#1e293b",
        color: "#f8fafc",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">

        {/* Encabezado */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl text-2xl text-indigo-400 mb-1">
            ⚡
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Iniciar Sesión
          </h1>
          <p className="text-xs text-slate-400">
            Ingresa a tu cuenta para administrar tus créditos y renders con IA
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="creador@aivastudio.com"
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
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              autoComplete="current-password"
            />
            <div className="mt-2 text-right">
              <Link to="/recuperar-password" 
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
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
                <span>Validando credenciales...</span>
              </>
            ) : (
              "Ingresar al Estudio"
            )}
          </button>
        </form>

        {/* Pie del formulario / Enlace a registro */}
        <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          ¿Aún no tienes una cuenta?{" "}
          <Link to="/registro" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
            Crea una aquí
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;