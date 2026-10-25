/* eslint-disable react-refresh/only-export-components */
import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { aivaApi } from './services/api'
import { StudioWorkspace } from './Components/StudioWorkspace'

function BrandMark() {
  return <span className="brand-mark" aria-hidden="true"><span /></span>
}

function Icon({ name }) {
  const paths = {
    grid: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
    spark: 'M12 3l1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3zM19 16l.6 1.4L21 18l-1.4.6L19 20l-.6-1.4L17 18l1.4-.6L19 16z',
    folder: 'M3 6.5A1.5 1.5 0 014.5 5H10l2 2h7.5A1.5 1.5 0 0121 8.5v9a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 17V6.5z',
    settings: 'M12 8.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zM19 12a7 7 0 01-.1 1.2l2 1.5-2 3.4-2.3-.9a7.2 7.2 0 01-2.1 1.2L14.2 21h-4.4l-.3-2.6a7.2 7.2 0 01-2.1-1.2l-2.3.9-2-3.4 2-1.5A7 7 0 015 12c0-.4 0-.8.1-1.2l-2-1.5 2-3.4 2.3.9a7.2 7.2 0 012.1-1.2L9.8 3h4.4l.3 2.6a7.2 7.2 0 012.1 1.2l2.3-.9 2 3.4-2 1.5c.1.4.1.8.1 1.2z',
    play: 'M8 5v14l11-7L8 5z',
    plus: 'M12 5v14M5 12h14',
    arrow: 'M5 12h13M13 7l5 5-5 5',
    close: 'M6 6l12 12M18 6L6 18',
  }
  return (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[name]} />
    </svg>
  )
}

function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setErrorMsg('')
    setLoading(true)

    const targetEmail = email.trim() || 'creador@aiva.studio'
    const targetPass = password || '123456'

    try {
      // Intento de conexión con la API Spring Boot (POST /api/auth/login)
      const data = await aivaApi.login(targetEmail, targetPass)
      onLogin({
        id: data.usuarioId || 1,
        email: data.email || targetEmail,
        creditosDisponibles: data.creditosDisponibles ?? 250,
        suscripcionActiva: data.suscripcionActiva ?? true,
        nombre: 'Andrés Rojas'
      })
    } catch (err) {
      // Fallback para permitir desarrollo frontend si el backend aún no está encendido
      console.warn('Backend desconectado o error de login:', err.message)
      onLogin({
        id: 1,
        email: targetEmail,
        creditosDisponibles: 250,
        suscripcionActiva: true,
        nombre: 'Andrés Rojas'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-shell">
      <section className="login-art">
        <div className="art-topline">
          <BrandMark />
          <strong>AIVA<span>.</span>studio</strong>
        </div>
        <div className="art-copy">
          <p className="eyebrow">CREA SIN LIMITES</p>
          <h1>Las ideas<br /><em>también</em><br />se mueven.</h1>
          <p className="art-description">Convierte una idea en una historia visual que la gente quiera ver hasta el final.</p>
        </div>
        <div className="art-orbit orbit-one" />
        <div className="art-orbit orbit-two" />
        <div className="art-card">
          <span className="mini-play"><Icon name="play" /></span>
          <span><b>Tu próxima historia</b><small>está a un prompt de distancia</small></span>
          <span className="art-card-arrow"><Icon name="arrow" /></span>
        </div>
      </section>

      <section className="login-panel">
        <div className="login-form-wrap">
          <div className="mobile-brand">
            <BrandMark />
            <strong>AIVA<span>.</span>studio</strong>
          </div>
          <p className="eyebrow">BIENVENIDO DE VUELTA</p>
          <h2>Entra a tu estudio.</h2>
          <p className="muted">Continúa creando algo extraordinario.</p>

          {errorMsg && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '10px' }}>{errorMsg}</p>}

          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="tu@correo.com"
            />
            <div className="label-row">
              <label htmlFor="password">Contraseña</label>
              <a href="#forgot">¿La olvidaste?</a>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
            />
            <button className="primary-button login-button" type="submit" disabled={loading}>
              {loading ? 'Verificando...' : 'Entrar al estudio'} <Icon name="arrow" />
            </button>
          </form>

          <div className="divider"><span>o continúa con</span></div>
          <button
            className="google-button"
            type="button"
            onClick={() => onLogin({ id: 1, email: 'creador@aiva.studio', creditosDisponibles: 250, suscripcionActiva: true, nombre: 'Andrés Rojas' })}
          >
            <span className="google-g">G</span> Continuar con Google
          </button>
          <p className="signup-copy">
            ¿Aún no tienes cuenta?{' '}
            <button
              type="button"
              onClick={() => onLogin({ id: 2, email: 'nuevo@aiva.studio', creditosDisponibles: 100, suscripcionActiva: true, nombre: 'Nuevo Creador' })}
            >
              Crea una gratis
            </button>
          </p>
        </div>
        <footer className="login-footer">
          <span>© 2026 AIVA Studio</span>
          <span>Hecho para quienes tienen algo que decir.</span>
        </footer>
      </section>
    </main>
  )
}

function Dashboard({ user, setUser, onLogout }) {
  return <StudioWorkspace user={user} setUser={setUser} onLogout={onLogout} />
}

function App() {
  const [user, setUser] = useState(null)
  return user ? (
    <Dashboard user={user} setUser={setUser} onLogout={() => setUser(null)} />
  ) : (
    <Login onLogin={setUser} />
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)