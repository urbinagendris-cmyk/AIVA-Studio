import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import { aivaApi } from "../api/api";

const inputClass =
  "w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors";

export const RestablecerPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6 || password.length > 72) {
      setError("La contraseña debe tener entre 6 y 72 caracteres.");
      return;
    }
    if (password !== confirmar) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setCargando(true);
    setError("");
    try {
      await aivaApi.restablecerPassword(token, password);
      await Swal.fire({
        icon: "success",
        title: "Contraseña actualizada",
        text: "Ya puedes iniciar sesión con tu nueva contraseña.",
        background: "#1e293b",
        color: "#f8fafc",
        confirmButtonColor: "#6366f1",
      });
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  // Enlace abierto sin token (por ejemplo, copiado a medias)
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-4 text-center">
          <h1 className="text-xl font-bold text-white">Enlace no válido</h1>
          <p className="text-sm text-slate-400">
            Este enlace de recuperación está incompleto. Solicita uno nuevo para continuar.
          </p>
          <Link
            to="/recuperar-password"
            className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-5 rounded-lg transition-colors text-sm"
          >
            Solicitar un enlace nuevo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl text-2xl text-indigo-400 mb-1">
            🔒
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Elige una nueva contraseña
          </h1>
          <p className="text-xs text-slate-400">
            Por seguridad, al guardarla se cerrarán las sesiones abiertas de tu cuenta.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="reset-password" className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Nueva contraseña
            </label>
            <input
              id="reset-password"
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              placeholder="Entre 6 y 72 caracteres"
              className={inputClass}
              autoComplete="new-password"
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="reset-confirm" className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Confirmar contraseña
            </label>
            <input
              id="reset-confirm"
              type="password"
              value={confirmar}
              onChange={(e) => { setConfirmar(e.target.value); setError(""); }}
              placeholder="Repite la contraseña"
              className={inputClass}
              autoComplete="new-password"
            />
          </div>

          {error && (
            <div className="space-y-1" role="alert">
              <p className="text-xs text-red-400">{error}</p>
              {/expir|válido/i.test(error) && (
                <Link to="/recuperar-password" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold">
                  Solicitar un enlace nuevo
                </Link>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors text-sm shadow-md"
          >
            {cargando ? "Guardando..." : "Guardar nueva contraseña"}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
            ← Volver a iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RestablecerPassword;
