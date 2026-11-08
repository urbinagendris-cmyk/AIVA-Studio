import { useState } from "react";
import { Link } from "react-router-dom";
import { aivaApi } from "../api/api";

const inputClass =
  "w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors";

export const RecuperarPassword = () => {
  const [email, setEmail] = useState("");
  const [cargando, setCargando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Ingresa un correo electrónico válido.");
      return;
    }

    setCargando(true);
    setError("");
    try {
      await aivaApi.solicitarRecuperacion(email.trim());
      setEnviado(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl text-2xl text-indigo-400 mb-1">
            🔑
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Recuperar contraseña
          </h1>
          <p className="text-xs text-slate-400">
            Escribe el correo de tu cuenta y te enviaremos un enlace para elegir una nueva contraseña.
          </p>
        </div>

        {enviado ? (
          <div className="space-y-4">
            <div
              className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
              role="status"
            >
              Si <b>{email.trim()}</b> tiene una cuenta en AIVA Studio, te enviamos un enlace de
              recuperación. Revisa tu bandeja de entrada y la carpeta de spam. El enlace vence en 30 minutos.
            </div>
            <button
              type="button"
              onClick={() => { setEnviado(false); setEmail(""); }}
              className="w-full border border-slate-700 hover:border-slate-500 text-slate-200 font-semibold py-2.5 px-4 rounded-lg transition-colors text-sm"
            >
              Usar otro correo
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="recovery-email" className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Correo Electrónico
              </label>
              <input
                id="recovery-email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="creador@aivastudio.com"
                className={inputClass}
                autoComplete="email"
                autoFocus
              />
            </div>

            {error && (
              <p className="text-xs text-red-400" role="alert">{error}</p>
            )}

            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors text-sm shadow-md"
            >
              {cargando ? "Enviando enlace..." : "Enviar enlace de recuperación"}
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
            ← Volver a iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecuperarPassword;
