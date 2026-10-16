/* eslint-disable react-refresh/only-export-components */
import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { aivaApi } from './services/api'

const initialProjects = [
  { id: 1, title: 'Lanzamiento Aurora', type: 'Video promocional', date: 'Hoy, 10:42', status: 'Listo', color: 'coral', duration: '00:42', costoCreditos: 40 },
  { id: 2, title: 'Historias que inspiran', type: 'Video para redes', date: 'Ayer, 16:18', status: 'Procesando', color: 'blue', duration: '00:28', costoCreditos: 30 },
  { id: 3, title: 'Curso de fotografía', type: 'Contenido educativo', date: '12 Sep, 09:06', status: 'Borrador', color: 'gold', duration: '01:14', costoCreditos: 50 },
]

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

function Sidebar({ active, setActive, onLogout, user, onRecargar }) {
  const items = [['grid', 'Resumen'], ['spark', 'Crear video'], ['folder', 'Mis proyectos']]
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <BrandMark />
        <strong>AIVA<span>.</span>studio</strong>
      </div>
      <div className="workspace-switcher">
        <span className="avatar avatar-peach">AS</span>
        <span><small>Espacio de trabajo</small><b>{user?.nombre || 'Andrés Studio'}</b></span>
        <span className="chevron">⌄</span>
      </div>
      <nav className="sidebar-nav">
        {items.map(([icon, label]) => (
          <button key={label} className={active === label ? 'active' : ''} onClick={() => setActive(label)}>
            <Icon name={icon} />
            {label}
            {label === 'Crear video' && <span className="nav-new">Nuevo</span>}
          </button>
        ))}
      </nav>

      {/* Regla 2: Recarga Rápida con Bonificación */}
      <div style={{ margin: '12px 14px', padding: '12px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', fontSize: '0.8rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ color: '#94a3b8' }}>Créditos:</span>
          <b style={{ color: '#f59e0b' }}>⚡ {user?.creditosDisponibles ?? 0}</b>
        </div>
        <button
          onClick={onRecargar}
          style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', background: '#4f46e5', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}
        >
          + Recargar (+20% Bono)
        </button>
      </div>

      <div className="sidebar-bottom">
        <button onClick={() => setActive('Configuración')}><Icon name="settings" />Configuración</button>
        <div className="profile">
          <span className="avatar avatar-yellow">AR</span>
          <span><b>{user?.nombre || 'Andrés Rojas'}</b><small>Plan Creator</small></span>
          <button className="logout" onClick={onLogout} aria-label="Cerrar sesión">↗</button>
        </div>
      </div>
    </aside>
  )
}

function CreateModal({ onClose, onCreate, creditosDisponibles }) {
  const [title, setTitle] = useState('')
  const [formato, setFormato] = useState('horizontal')
  const costoEstimado = 30 // Costo en créditos base

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="create-modal" onMouseDown={(event) => event.stopPropagation()}>
        <button className="close-button" onClick={onClose} aria-label="Cerrar"><Icon name="close" /></button>
        <div className="modal-kicker">
          <span className="modal-icon"><Icon name="spark" /></span>
          <span>CREAR VIDEO</span>
        </div>
        <h2>¿Qué vamos a contar hoy?</h2>
        <p className="muted">Dale un nombre a tu proyecto para comenzar a darle forma.</p>
        
        <label htmlFor="project-title">Nombre del proyecto</label>
        <input
          autoFocus
          id="project-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Ej. Campaña de verano"
        />

        <div className="format-grid">
          <button
            type="button"
            className={`format-card ${formato === 'horizontal' ? 'selected' : ''}`}
            onClick={() => setFormato('horizontal')}
          >
            <span className="format-square landscape" />
            <span><b>Video horizontal</b><small>Para YouTube y web</small></span>
          </button>
          <button
            type="button"
            className={`format-card ${formato === 'vertical' ? 'selected' : ''}`}
            onClick={() => setFormato('vertical')}
          >
            <span className="format-square portrait" />
            <span><b>Video vertical</b><small>Para Reels y TikTok</small></span>
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: '0.85rem', color: '#94a3b8' }}>
          <span>Costo estimado de render:</span>
          <strong style={{ color: '#f59e0b' }}>⚡ {costoEstimado} créditos</strong>
        </div>

        {creditosDisponibles < costoEstimado && (
          <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: '4px 0 10px' }}>
            ⚠️ Créditos insuficientes ({creditosDisponibles} disponibles). Recarga antes de renderizar.
          </p>
        )}

        <button
          className="primary-button modal-submit"
          onClick={() => onCreate(title || 'Nuevo proyecto', costoEstimado)}
        >
          Continuar <Icon name="arrow" />
        </button>
      </div>
    </div>
  )
}

function ProjectCard({ project }) {
  return (
    <article className={`project-card ${project.color}`}>
      <div className="project-preview">
        <span className="preview-noise" />
        <span className="preview-play"><Icon name="play" /></span>
        <small>{project.duration}</small>
      </div>
      <div className="project-info">
        <div>
          <h3>{project.title}</h3>
          <p>{project.type}</p>
        </div>
        <button className="more-button" aria-label={`Opciones de ${project.title}`}>•••</button>
      </div>
      <div className="project-meta">
        <span className={`status status-${project.status.toLowerCase()}`}><i />{project.status}</span>
        <span>{project.date}</span>
      </div>
    </article>
  )
}

function Dashboard({ user, setUser, onLogout }) {
  const [active, setActive] = useState('Resumen')
  const [projects, setProjects] = useState(initialProjects)
  const [isModalOpen, setModalOpen] = useState(false)
  const [query, setQuery] = useState('')

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(query.toLowerCase())
  )

  // Ejecución Regla de Negocio 1: Crear proyecto y descontar créditos
  async function createProject(title, costoCreditos = 30) {
    if (user.creditosDisponibles < costoCreditos) {
      alert(`No tienes créditos suficientes. Requieres ${costoCreditos} y tienes ${user.creditosDisponibles}.`)
      return
    }

    try {
      // Llamada real al servicio backend
      await aivaApi.crearProyecto({
        usuarioId: user.id,
        nombre: title,
        modeloIa: 'Lumina Video Pro v2',
        costoCreditos: costoCreditos,
        duracionSeg: 15
      })
    } catch (e) {
      console.warn('API Spring Boot no conectada, aplicando deducción localmente:', e.message)
    }

    // Descontar créditos en la sesión del usuario
    setUser((prev) => ({
      ...prev,
      creditosDisponibles: prev.creditosDisponibles - costoCreditos
    }))

    // Agregar nuevo proyecto a la lista
    setProjects([
      {
        id: Date.now(),
        title,
        type: 'Nuevo proyecto IA',
        date: 'Ahora',
        status: 'Procesando',
        color: 'green',
        duration: '00:15',
        costoCreditos
      },
      ...projects
    ])
    setModalOpen(false)
  }

  // Ejecución Regla de Negocio 2: Recarga de créditos con Bono del 20%
  async function handleRecargaCreditos() {
    const input = prompt('Ingresa la cantidad de créditos a recargar (Recargas >= 500 reciben 20% de bono extra):', '500')
    const cantidad = Number(input)
    if (!cantidad || cantidad <= 0) return

    let totalRecibido = cantidad
    if (cantidad >= 500) {
      totalRecibido += Math.floor(cantidad * 0.2) // Bono 20%
    }

    try {
      await aivaApi.recargarCreditos(user.id, cantidad)
    } catch (e) {
      console.warn('API Spring Boot no conectada, recargando localmente:', e.message)
    }

    setUser((prev) => ({
      ...prev,
      creditosDisponibles: prev.creditosDisponibles + totalRecibido
    }))

    alert(`¡Recarga exitosa! Se han agregado ${totalRecibido} créditos a tu cuenta.`)
  }

  return (
    <div className="app-shell">
      <Sidebar
        active={active}
        setActive={setActive}
        onLogout={onLogout}
        user={user}
        onRecargar={handleRecargaCreditos}
      />
      <main className="dashboard">
        <header className="dashboard-header">
          <div className="mobile-header-brand">
            <BrandMark />
            <strong>AIVA<span>.</span>studio</strong>
          </div>
          <div className="breadcrumbs">
            <span>Estudio</span>
            <b>/</b>
            <strong>{active}</strong>
          </div>
          <div className="header-actions">
            <div className="notification">◌<i /></div>
            <div className="header-user">
              <span className="avatar avatar-yellow">AR</span>
              <span><b>{user?.nombre || 'Andrés Rojas'}</b><small>⚡ {user?.creditosDisponibles} cr</small></span>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          <section className="welcome-row">
            <div>
              <p className="eyebrow">SÁBADO, 19 DE SEPTIEMBRE</p>
              <h1>Hola, {user?.nombre?.split(' ')[0] || 'Andrés'} <span>✦</span></h1>
              <p className="muted">¿Qué historia quieres crear hoy?</p>
            </div>
            <button className="primary-button create-button" onClick={() => setModalOpen(true)}>
              <Icon name="plus" />Nuevo video
            </button>
          </section>

          <section className="hero-banner">
            <div>
              <p className="eyebrow">TU CREATIVIDAD, POTENCIADA</p>
              <h2>Del primer pensamiento<br /><em>a la pantalla.</em></h2>
              <p>Describe tu idea. AIVA se encarga del resto.</p>
              <button className="banner-link" onClick={() => setModalOpen(true)}>
                Crear mi primer video <Icon name="arrow" />
              </button>
            </div>
            <div className="banner-shape">
              <span className="shape-ring" />
              <span className="shape-star">✦</span>
              <span className="shape-label">AI<br />VIDEO</span>
            </div>
          </section>

          <section className="projects-section">
            <div className="section-heading">
              <div>
                <h2>Mis proyectos</h2>
                <p>Todo lo que estás creando, en un solo lugar.</p>
              </div>
              <div className="section-tools">
                <div className="search-box">
                  <span>⌕</span>
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Buscar proyecto"
                  />
                </div>
                <button className="view-toggle active">▦</button>
                <button className="view-toggle">☷</button>
              </div>
            </div>

            <div className="projects-grid">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
              <button className="empty-project" onClick={() => setModalOpen(true)}>
                <span><Icon name="plus" /></span>
                <b>Crear un proyecto</b>
                <small>Empieza con una idea</small>
              </button>
            </div>
          </section>

          <section className="usage-row">
            <div className="usage-copy">
              <span className="usage-icon"><Icon name="spark" /></span>
              <div>
                <b>Tu saldo en el estudio</b>
                <p>Tienes {user?.creditosDisponibles} créditos listos para renderizar.</p>
              </div>
            </div>
            <div className="usage-bar">
              <span style={{ width: `${Math.min(100, ((user?.creditosDisponibles || 0) / 500) * 100)}%` }} />
            </div>
            <button onClick={handleRecargaCreditos}>Recargar <Icon name="arrow" /></button>
          </section>
        </div>
      </main>

      {isModalOpen && (
        <CreateModal
          onClose={() => setModalOpen(false)}
          onCreate={createProject}
          creditosDisponibles={user.creditosDisponibles}
        />
      )}
    </div>
  )
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