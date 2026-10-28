import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { mockModelosIA } from '../data/mocks'
import { aivaApi } from '../api/api'
import { calculateCreditRecharge, calculateRenderCost, formatCredits } from '../helpers/businessRules'
import '../components/studio-workspace.css'

const initialProjects = [
  {
    id: 1,
    title: 'Lanzamiento Aurora',
    type: 'Video promocional',
    date: 'Hoy, 10:42',
    status: 'Listo',
    color: 'coral',
    duration: 42,
    modelId: 'lumina-v2',
    format: '16:9',
    costoCreditos: 40,
    prompt: 'Una campaña luminosa para el lanzamiento de una nueva marca.',
  },
  {
    id: 2,
    title: 'Historias que inspiran',
    type: 'Video para redes',
    date: 'Ayer, 16:18',
    status: 'Generando',
    color: 'blue',
    duration: 28,
    modelId: 'sora-api',
    format: '9:16',
    costoCreditos: 30,
    prompt: 'Una historia breve, cercana y optimista para redes sociales.',
  },
  {
    id: 3,
    title: 'Curso de fotografía',
    type: 'Contenido educativo',
    date: '12 oct, 09:06',
    status: 'Borrador',
    color: 'gold',
    duration: 74,
    modelId: 'runway-gen3',
    format: '16:9',
    costoCreditos: 50,
    prompt: 'Una introducción visual a los fundamentos de fotografía.',
  },
]

const modelDetails = {
  'lumina-v2': {
    category: 'Equilibrado',
    description: 'Una opción versátil para anuncios, historias y contenido diario.',
    color: 'coral',
  },
  'sora-api': {
    category: 'Alta fidelidad',
    description: 'Escenas detalladas y narrativas con acabado cinematográfico.',
    color: 'blue',
  },
  'runway-gen3': {
    category: 'Creativo',
    description: 'Ideal para explorar estilos, movimiento y conceptos visuales.',
    color: 'gold',
  },
  'svd-xl': {
    category: 'Ligero',
    description: 'Prueba ideas y conceptos con un consumo de créditos menor.',
    color: 'green',
  },
}

function getInitialTransactions(balance) {
  return [
    { id: 1, label: 'Recarga inicial', date: '21 oct, 09:12', amount: balance + 120 },
    { id: 2, label: 'Lanzamiento Aurora', date: '21 oct, 10:42', amount: -40 },
    { id: 3, label: 'Historias que inspiran', date: '20 oct, 16:18', amount: -30 },
    { id: 4, label: 'Curso de fotografía', date: '18 oct, 09:06', amount: -50 },
  ]
}

const navItems = [
  { label: 'Resumen', icon: 'grid' },
  { label: 'Crear video', icon: 'spark' },
  { label: 'Mis proyectos', icon: 'folder' },
  { label: 'Modelos IA', icon: 'models' },
  { label: 'Créditos', icon: 'wallet' },
]

function StudioIcon({ name }) {
  const paths = {
    grid: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
    spark: 'M12 3l1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3z',
    folder: 'M3 6.5A1.5 1.5 0 014.5 5H10l2 2h7.5A1.5 1.5 0 0121 8.5v9a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 17V6.5z',
    models: 'M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1m0-12.8-2.1 2.1m-8.6 8.6-2.1 2.1M12 8a4 4 0 100 8 4 4 0 000-8z',
    wallet: 'M4 6.5A2.5 2.5 0 016.5 4H19v16H6.5A2.5 2.5 0 014 17.5v-11zM4 7h15M15 13h4',
    arrow: 'M5 12h13M13 7l5 5-5 5',
    plus: 'M12 5v14M5 12h14',
    close: 'M6 6l12 12M18 6L6 18',
    play: 'M8 5v14l11-7L8 5z',
    search: 'M11 19a8 8 0 110-16 8 8 0 010 16zm6-2 4 4',
    clock: 'M12 8v4l2.5 2.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  }

  return (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  )
}

function BrandMark() {
  return <span className="brand-mark" aria-hidden="true"><span /></span>
}

function Sidebar({ active, onNavigate, onLogout, user }) {
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
      <nav className="sidebar-nav" aria-label="Navegación principal">
        {navItems.map(({ icon, label }) => (
          <button
            key={label}
            className={active === label ? 'active' : ''}
            onClick={() => onNavigate(label)}
            aria-current={active === label ? 'page' : undefined}
          >
            <StudioIcon name={icon} />
            {label}
            {label === 'Crear video' && <span className="nav-new">Nuevo</span>}
          </button>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <button className={active === 'Configuración' || active === 'Preferencias' ? 'active' : ''} onClick={() => onNavigate('Preferencias')}>
          <StudioIcon name="models" />Preferencias
        </button>
        <div className="profile">
          <span className="avatar avatar-yellow">{(user?.nombre || 'AR').slice(0, 2).toUpperCase()}</span>
          <span><b>{user?.nombre || 'Andrés Rojas'}</b><small>Plan Creator</small></span>
          <button className="logout" onClick={onLogout} aria-label="Cerrar sesión">↗</button>
        </div>
      </div>
    </aside>
  )
}

function PageHeading({ eyebrow, title, description, action }) {
  return (
    <div className="workspace-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="muted">{description}</p>
      </div>
      {action}
    </div>
  )
}

function ProjectCard({ project, onOpen }) {
  const model = mockModelosIA.find((item) => item.id === project.modelId)
  const seconds = Number(project.duration) || 0
  const duration = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`
  const statusClass = (project.status || '').toLowerCase().replace(/\s+/g, '-')

  return (
    <article className={`project-card ${project.color || 'coral'}`}>
      <button className="project-preview" onClick={() => onOpen(project)} aria-label={`Ver detalles de ${project.title}`}>
        <span className="preview-noise" />
        <span className="preview-play"><StudioIcon name="play" /></span>
        <small>{duration}</small>
      </button>
      <div className="project-info">
        <div>
          <h3>{project.title}</h3>
          <p>{project.type || model?.nombre || 'Proyecto de video'}</p>
        </div>
        <button className="more-button" onClick={() => onOpen(project)} aria-label={`Detalles de ${project.title}`}>•••</button>
      </div>
      <div className="project-meta">
        <span className={`status status-${statusClass}`}><i />{project.status}</span>
        <span>{project.date}</span>
      </div>
      <div className="project-extra">
        <span>{model?.nombre || project.modelName || 'Modelo AIVA'}</span>
        <span>{project.format || '16:9'} · ⚡ {formatCredits(project.costoCreditos)} cr</span>
      </div>
    </article>
  )
}

function VideoCreatorModal({ onClose, onCreate, creditosDisponibles, initialModelId }) {
  const [step, setStep] = useState(1)
  const [brief, setBrief] = useState({
    title: '',
    prompt: '',
    modelId: initialModelId || mockModelosIA[0].id,
    duration: 15,
    format: '9:16',
    style: 'Cinematográfico',
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const model = mockModelosIA.find((item) => item.id === brief.modelId) || mockModelosIA[0]
  const cost = calculateRenderCost(brief.duration, model.costoPorSegundo)

  function updateBrief(key, value) {
    setBrief((current) => ({ ...current, [key]: value }))
    setError('')
  }

  async function continueFlow() {
    if (step === 1 && !brief.title.trim()) {
      setError('Escribe un nombre para tu proyecto.')
      return
    }
    if (step === 1 && brief.prompt.trim().length < 12) {
      setError('Describe tu idea con al menos 12 caracteres.')
      return
    }
    if (step === 2 && cost > creditosDisponibles) {
      setError(`Te faltan ${formatCredits(cost - creditosDisponibles)} créditos para este render.`)
      return
    }
    if (step < 3) {
      setStep((current) => current + 1)
      setError('')
      return
    }

    setSubmitting(true)
    try {
      await onCreate({ ...brief, cost, modelName: model.nombre })
    } catch (submitError) {
      setError(submitError.message || 'No se pudo enviar el proyecto.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section className="create-modal video-creator-modal" role="dialog" aria-modal="true" aria-labelledby="creator-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="close-button" onClick={onClose} aria-label="Cerrar"><StudioIcon name="close" /></button>
        <div className="modal-kicker">
          <span className="modal-icon"><StudioIcon name="spark" /></span>
          <span>NUEVO PROYECTO · PASO {step} DE 3</span>
        </div>
        <div className="creator-progress" aria-label={`Paso ${step} de 3`}>
          {[1, 2, 3].map((item) => <span key={item} className={item <= step ? 'complete' : ''} />)}
        </div>

        {step === 1 && (
          <>
            <h2 id="creator-title">Dale forma a tu idea.</h2>
            <p className="muted">Cuéntanos qué quieres mostrar. Puedes ajustar el estilo y el modelo después.</p>
            <label htmlFor="project-title">Nombre del proyecto</label>
            <input id="project-title" autoFocus maxLength={80} value={brief.title} onChange={(event) => updateBrief('title', event.target.value)} placeholder="Ej. Campaña de verano" />
            <label htmlFor="project-prompt" className="field-spaced">Describe tu video</label>
            <textarea id="project-prompt" rows={4} maxLength={1000} value={brief.prompt} onChange={(event) => updateBrief('prompt', event.target.value)} placeholder="Una escena cálida de una cafetería al amanecer, luz natural, cámara lenta..." />
            <div className="field-hint">{brief.prompt.length}/1000 · Sé específico sobre la escena, el movimiento y la atmósfera.</div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 id="creator-title">Configura tu render.</h2>
            <p className="muted">El costo se calcula según el modelo elegido y la duración del video.</p>
            <label htmlFor="model-select">Modelo de video IA</label>
            <select id="model-select" value={brief.modelId} onChange={(event) => updateBrief('modelId', event.target.value)}>
              {mockModelosIA.map((item) => <option key={item.id} value={item.id}>{item.nombre} · {item.costoPorSegundo} cr/seg</option>)}
            </select>
            <div className="creator-options">
              <div>
                <label htmlFor="duration-select">Duración</label>
                <select id="duration-select" value={brief.duration} onChange={(event) => updateBrief('duration', Number(event.target.value))}>
                  {[5, 10, 15, 30, 45, 60].map((seconds) => <option key={seconds} value={seconds}>{seconds} segundos</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="style-select">Estilo visual</label>
                <select id="style-select" value={brief.style} onChange={(event) => updateBrief('style', event.target.value)}>
                  {['Cinematográfico', 'Producto', 'Animación', 'Editorial', 'Realista'].map((style) => <option key={style}>{style}</option>)}
                </select>
              </div>
            </div>
            <label className="field-spaced">Formato</label>
            <div className="format-grid">
              {[
                { id: '16:9', title: 'Horizontal', detail: 'YouTube y web', shape: 'landscape' },
                { id: '9:16', title: 'Vertical', detail: 'Reels y TikTok', shape: 'portrait' },
                { id: '1:1', title: 'Cuadrado', detail: 'Feed social', shape: 'square' },
              ].map((format) => (
                <button key={format.id} type="button" className={`format-card ${brief.format === format.id ? 'selected' : ''}`} onClick={() => updateBrief('format', format.id)}>
                  <span className={`format-square ${format.shape}`} />
                  <span><b>{format.title}</b><small>{format.detail}</small></span>
                </button>
              ))}
            </div>
            <div className="cost-estimate"><span>Estimado · {model.costoPorSegundo} créditos × {brief.duration} s</span><strong>⚡ {formatCredits(cost)} créditos</strong></div>
            {cost > creditosDisponibles && <p className="creator-error">Saldo disponible: {formatCredits(creditosDisponibles)} créditos. Reduce la duración o cambia de modelo.</p>}
          </>
        )}

        {step === 3 && (
          <>
            <h2 id="creator-title">Revisa antes de enviar.</h2>
            <p className="muted">Confirma los detalles de tu solicitud de generación.</p>
            <div className="creator-review">
              <div><small>PROYECTO</small><strong>{brief.title}</strong></div>
              <div><small>MODELO</small><strong>{model.nombre}</strong></div>
              <div><small>FORMATO Y DURACIÓN</small><strong>{brief.format} · {brief.duration} segundos · {brief.style}</strong></div>
              <div><small>PROMPT</small><p>{brief.prompt}</p></div>
              <div className="cost-estimate"><span>Se descontarán de tu saldo</span><strong>⚡ {formatCredits(cost)} créditos</strong></div>
            </div>
            <p className="demo-callout">La interfaz guardará esta solicitud como una demostración. La generación real se conectará desde el backend.</p>
          </>
        )}

        {error && <p className="creator-error" role="alert">{error}</p>}
        <div className="creator-actions">
          {step > 1 && <button type="button" className="secondary-button" onClick={() => { setStep((current) => current - 1); setError('') }}>Volver</button>}
          <button type="button" className="primary-button modal-submit" onClick={continueFlow} disabled={submitting || (step === 2 && cost > creditosDisponibles)}>
            {submitting ? 'Enviando...' : step === 3 ? 'Enviar a la cola' : 'Continuar'} <StudioIcon name="arrow" />
          </button>
        </div>
      </section>
    </div>
  )
}

function ProjectDetailsModal({ project, onClose }) {
  const model = mockModelosIA.find((item) => item.id === project.modelId)
  const statusClass = (project.status || '').toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section className="create-modal project-details-modal" role="dialog" aria-modal="true" aria-labelledby="project-details-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="close-button" onClick={onClose} aria-label="Cerrar"><StudioIcon name="close" /></button>
        <div className="modal-kicker"><StudioIcon name="folder" /><span>DETALLE DEL PROYECTO</span></div>
        <h2 id="project-details-title">{project.title}</h2>
        <div className="detail-status"><span className={`status status-${statusClass}`}><i />{project.status}</span><span>{project.date}</span></div>
        <dl className="project-detail-list">
          <div><dt>Modelo IA</dt><dd>{model?.nombre || project.modelName || 'Modelo AIVA'}</dd></div>
          <div><dt>Duración</dt><dd>{project.duration} segundos</dd></div>
          <div><dt>Formato</dt><dd>{project.format || '16:9'}</dd></div>
          <div><dt>Créditos usados</dt><dd>⚡ {formatCredits(project.costoCreditos)}</dd></div>
          <div><dt>Estilo</dt><dd>{project.style || 'Cinematográfico'}</dd></div>
        </dl>
        <div className="prompt-preview"><small>PROMPT</small><p>{project.prompt || 'Este proyecto no incluye un prompt guardado.'}</p></div>
      </section>
    </div>
  )
}

function SummaryView({ user, projects, onCreate, onNavigate, onOpenProject }) {
  const completed = projects.filter((project) => project.status === 'Listo').length
  const processing = projects.filter((project) => project.status === 'Generando' || project.status === 'En cola').length
  const recent = projects.slice(0, 3)

  return (
    <>
      <PageHeading
        eyebrow="TU ESTUDIO CREATIVO"
        title={`Hola, ${user?.nombre?.split(' ')[0] || 'creador'} ✦`}
        description="¿Qué historia quieres crear hoy?"
        action={<button className="primary-button create-button" onClick={onCreate}><StudioIcon name="plus" />Nuevo video</button>}
      />
      <section className="hero-banner">
        <div>
          <p className="eyebrow">TU CREATIVIDAD, POTENCIADA</p>
          <h2>Del primer pensamiento<br /><em>a la pantalla.</em></h2>
          <p>Escribe tu idea, elige un modelo y prepara el siguiente video.</p>
          <button className="banner-link" onClick={onCreate}>Crear mi próximo video <StudioIcon name="arrow" /></button>
        </div>
        <div className="banner-shape"><span className="shape-ring" /><span className="shape-star">✦</span><span className="shape-label">AI<br />VIDEO</span></div>
      </section>
      <section className="metric-grid">
        <article className="metric-card"><span className="metric-icon peach"><StudioIcon name="folder" /></span><div><small>PROYECTOS</small><strong>{projects.length}</strong><span>en tu biblioteca</span></div></article>
        <article className="metric-card"><span className="metric-icon mint"><StudioIcon name="play" /></span><div><small>VIDEOS LISTOS</small><strong>{completed}</strong><span>listos para revisar</span></div></article>
        <article className="metric-card"><span className="metric-icon lilac"><StudioIcon name="clock" /></span><div><small>EN PROCESO</small><strong>{processing}</strong><span>en cola de generación</span></div></article>
        <article className="metric-card"><span className="metric-icon gold">⚡</span><div><small>CRÉDITOS</small><strong>{formatCredits(user?.creditosDisponibles ?? 0)}</strong><span>disponibles para crear</span></div></article>
      </section>
      <section className="projects-section">
        <div className="section-heading">
          <div><h2>Actividad reciente</h2><p>Continúa trabajando en tus últimas ideas.</p></div>
          <button className="text-link" onClick={() => onNavigate('Mis proyectos')}>Ver todos <StudioIcon name="arrow" /></button>
        </div>
        <div className="projects-grid">
          {recent.map((project) => <ProjectCard key={project.id} project={project} onOpen={onOpenProject} />)}
          <button className="empty-project" onClick={onCreate}><span><StudioIcon name="plus" /></span><b>Crear un proyecto</b><small>Empieza con una idea</small></button>
        </div>
      </section>
      <section className="usage-row">
        <div className="usage-copy"><span className="usage-icon"><StudioIcon name="spark" /></span><div><b>Tu saldo en el estudio</b><p>Tienes {formatCredits(user?.creditosDisponibles ?? 0)} créditos listos para renderizar.</p></div></div>
        <div className="usage-bar"><span style={{ width: `${Math.min(100, ((user?.creditosDisponibles || 0) / 500) * 100)}%` }} /></div>
        <button onClick={() => onNavigate('Créditos')}>Ver créditos <StudioIcon name="arrow" /></button>
      </section>
    </>
  )
}

function ProjectsView({ projects, onCreate, onOpenProject }) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('Todos')
  const filters = ['Todos', 'En cola', 'Generando', 'Listo', 'Borrador', 'Fallido']
  const statusCounts = filters.reduce((counts, item) => {
    counts[item] = item === 'Todos'
      ? projects.length
      : projects.filter((project) => project.status === item).length
    return counts
  }, {})
  const filteredProjects = projects.filter((project) => {
    const matchesQuery = `${project.title || ''} ${project.type || ''} ${project.modelName || ''} ${project.prompt || ''}`.toLowerCase().includes(query.toLowerCase())
    return matchesQuery && (status === 'Todos' || project.status === status)
  })

  return (
    <>
      <PageHeading eyebrow="TU BIBLIOTECA CREATIVA" title="Mis proyectos" description="Encuentra tus creaciones, revisa su estado y continúa trabajando en tus ideas." action={<button className="primary-button create-button" onClick={onCreate}><StudioIcon name="plus" />Nuevo video</button>} />
      <section className="workspace-panel">
        <div className="projects-overview" aria-label="Resumen de proyectos">
          <div><strong>{projects.length}</strong><span>Proyectos</span></div>
          <div><strong>{statusCounts.Listo}</strong><span>Listos</span></div>
          <div><strong>{statusCounts.Generando + statusCounts['En cola']}</strong><span>En proceso</span></div>
          <div><strong>{statusCounts.Borrador}</strong><span>Borradores</span></div>
        </div>
        <div className="project-toolbar">
          <div className="project-toolbar-heading"><div><h2>Todos tus proyectos</h2><p>{filteredProjects.length} {filteredProjects.length === 1 ? 'resultado' : 'resultados'}</p></div></div>
          <div className="search-box"><StudioIcon name="search" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nombre, modelo o prompt" aria-label="Buscar proyectos" /></div>
          <div className="status-filters" aria-label="Filtrar proyectos">
            {filters.map((item) => <button key={item} className={status === item ? 'selected' : ''} onClick={() => setStatus(item)}>{item}<span>{statusCounts[item]}</span></button>)}
          </div>
        </div>
        {filteredProjects.length ? (
          <div className="projects-grid">
            {filteredProjects.map((project) => <ProjectCard key={project.id} project={project} onOpen={onOpenProject} />)}
          </div>
        ) : (
          <div className="empty-state"><span><StudioIcon name="folder" /></span><h2>No encontramos proyectos</h2><p>Prueba con otro nombre o crea un video nuevo.</p><button className="primary-button create-button" onClick={onCreate}><StudioIcon name="plus" />Crear video</button></div>
        )}
      </section>
    </>
  )
}

function ModelsView({ onChooseModel }) {
  return (
    <>
      <PageHeading eyebrow="CATÁLOGO CREATIVO" title="Modelos IA" description="Compara los modelos disponibles y elige el que mejor encaje con tu idea." />
      <div className="model-grid">
        {mockModelosIA.map((model) => {
          const details = modelDetails[model.id] || { category: 'Video IA', description: 'Modelo de generación de video disponible en AIVA Studio.', color: 'coral' }
          return (
            <article className={`model-card ${details.color}`} key={model.id}>
              <div className="model-card-top"><span className="model-symbol"><StudioIcon name="spark" /></span><span className="model-tag">{details.category}</span></div>
              <h2>{model.nombre}</h2><p>{details.description}</p>
              <div className="model-cost"><strong>{model.costoPorSegundo} <small>créditos</small></strong><span>por segundo</span></div>
              <button className="secondary-button" onClick={() => onChooseModel(model.id)}>Crear con este modelo <StudioIcon name="arrow" /></button>
            </article>
          )
        })}
      </div>
      <p className="subtle-note">Catálogo demostrativo: disponibilidad, precios y capacidades se configurarán desde el backend.</p>
    </>
  )
}

function CreditsView({ user, onRecharge, transactions }) {
  const [amount, setAmount] = useState(500)
  const rechargeCalc = calculateCreditRecharge(amount)

  return (
    <>
      <PageHeading eyebrow="TU CUENTA" title="Créditos y consumo" description="Consulta tu saldo y revisa el historial de actividad de tu estudio." />
      <div className="credits-layout">
        <section className="credits-balance">
          <p className="eyebrow">SALDO DISPONIBLE</p><strong>⚡ {formatCredits(user?.creditosDisponibles ?? 0)}</strong><span>créditos para tus proyectos</span>
          <div className="credits-progress"><span style={{ width: `${Math.min(100, ((user?.creditosDisponibles || 0) / 1000) * 100)}%` }} /></div>
          <small>La recarga con bono es una simulación de interfaz hasta integrar pagos.</small>
        </section>
        <section className="recharge-card">
          <div><p className="eyebrow">RECARGA DE PRUEBA</p><h2>Más créditos, más historias.</h2><p>Las recargas de 500 créditos o más muestran un bono promocional del 20%.</p></div>
          <label htmlFor="credit-amount">Cantidad de créditos</label>
          <input id="credit-amount" type="number" min="50" step="50" value={amount} onChange={(event) => setAmount(event.target.value)} />
          <div className="recharge-total">
            <span>Recibirás</span>
            <strong>
              {formatCredits(rechargeCalc.total)} créditos {rechargeCalc.hasBonus && <small>(+{formatCredits(rechargeCalc.bonus)} bono)</small>}
            </strong>
          </div>
          <button className="primary-button create-button" onClick={() => onRecharge(Number(amount))} disabled={!Number(amount) || Number(amount) < 50}>Simular recarga</button>
        </section>
      </div>
      <section className="workspace-panel transaction-panel">
        <div className="section-heading"><div><h2>Actividad reciente</h2><p>Movimientos de créditos de tu cuenta.</p></div></div>
        <div className="transaction-list">
          {transactions.map((item) => (
            <div className="transaction-row" key={item.id}>
              <span className={`transaction-icon ${item.amount > 0 ? 'added' : 'used'}`}>{item.amount > 0 ? '+' : '−'}</span>
              <span className="transaction-label"><b>{item.label}</b><small>{item.date}</small></span>
              <strong className={item.amount > 0 ? 'positive' : ''}>{item.amount > 0 ? '+' : ''}{item.amount} cr</strong>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

function PreferencesView({ user }) {
  return (
    <>
      <PageHeading eyebrow="TU CUENTA" title="Preferencias" description="Información del espacio de trabajo activo." />
      <section className="workspace-panel preference-card">
        <span className="avatar avatar-peach">{(user?.nombre || 'AR').slice(0, 2).toUpperCase()}</span>
        <div><p className="eyebrow">PERFIL CREADOR</p><h2>{user?.nombre || 'Andrés Rojas'}</h2><p>{user?.email || 'creador@aiva.studio'}</p></div>
        <span className="preference-plan">Plan Creator</span>
      </section>
      <p className="subtle-note">La gestión de cuenta, preferencias de render y notificaciones se habilitarán al conectar el backend.</p>
    </>
  )
}

export function StudioWorkspace({ user: propUser, setUser: propSetUser, onLogout: propLogout }) {
  const { pathname } = useLocation()
  const initialViews = {
    '/proyectos': 'Mis proyectos',
    '/modelos': 'Modelos IA',
    '/creditos': 'Créditos',
    '/preferencias': 'Preferencias',
  }
  const [internalUser, setInternalUser] = useState({
    id: 1,
    nombre: 'Andrés Rojas',
    email: 'creador@aiva.studio',
    creditosDisponibles: 120,
  })

  const user = propUser || internalUser
  const setUser = propSetUser || setInternalUser
  const onLogout = propLogout || (() => window.location.href = '/login')

  const [active, setActive] = useState(() => initialViews[pathname] || 'Resumen')
  const [projects, setProjects] = useState(initialProjects)
  const [transactions, setTransactions] = useState(() => getInitialTransactions(user?.creditosDisponibles ?? 0))
  const [isCreatorOpen, setCreatorOpen] = useState(false)
  const [selectedModelId, setSelectedModelId] = useState(mockModelosIA[0].id)
  const [selectedProject, setSelectedProject] = useState(null)
  const [notice, setNotice] = useState('')
  const [noticeType, setNoticeType] = useState('info')

  const activeTitle = useMemo(() => active === 'Configuración' ? 'Preferencias' : active, [active])

  function navigate(label) {
    setActive(label)
    if (label === 'Crear video') {
      setSelectedModelId(mockModelosIA[0].id)
      setCreatorOpen(true)
    }
  }

  async function createProject(brief) {
    if (brief.cost > user.creditosDisponibles) {
      throw new Error('No tienes créditos suficientes para enviar esta solicitud.')
    }

    try {
      await aivaApi.crearProyecto({
        usuarioId: user.id,
        nombre: brief.title,
        modeloIa: brief.modelName,
        costoCreditos: brief.cost,
        duracionSeg: brief.duration,
      })
      setNotice('Solicitud registrada. El render se mostrará como pendiente hasta conectar el proveedor de video.')
      setNoticeType('success')
    } catch (error) {
      setNotice(`Modo demostración: no se pudo guardar en el servidor (${error.message}). La solicitud solo se conservará en esta sesión.`)
      setNoticeType('warning')
    }

    const now = new Date()
    const project = {
      id: now.getTime(),
      title: brief.title.trim(),
      prompt: brief.prompt.trim(),
      style: brief.style,
      modelId: brief.modelId,
      modelName: brief.modelName,
      format: brief.format,
      duration: brief.duration,
      costoCreditos: brief.cost,
      type: brief.style,
      date: 'Ahora',
      status: 'En cola',
      color: modelDetails[brief.modelId]?.color || 'coral',
    }
    setProjects((current) => [project, ...current])
    setTransactions((current) => [{ id: project.id, label: `Generación · ${project.title}`, date: 'Ahora', amount: -brief.cost }, ...current])
    setUser((current) => ({ ...current, creditosDisponibles: current.creditosDisponibles - brief.cost }))
    setCreatorOpen(false)
    setActive('Mis proyectos')
  }

  async function recharge(amount) {
    if (!Number.isFinite(amount) || amount < 50) {
      setNotice('La recarga mínima de demostración es de 50 créditos.')
      setNoticeType('warning')
      return
    }

    const rechargeCalc = calculateCreditRecharge(amount)

    try {
      await aivaApi.recargarCreditos(user.id, amount)
      setNotice('La recarga se registró en la API. El pago real requiere integración con una pasarela.')
      setNoticeType('success')
    } catch (error) {
      setNotice(`Modo demostración: la API de créditos no está disponible (${error.message}). El saldo solo se actualizará en esta sesión.`)
      setNoticeType('warning')
    }

    setUser((current) => ({ ...current, creditosDisponibles: current.creditosDisponibles + rechargeCalc.total }))
    setTransactions((current) => [
      {
        id: Date.now(),
        label: rechargeCalc.hasBonus ? `Recarga de prueba (+${formatCredits(rechargeCalc.bonus)} bono)` : 'Recarga de prueba',
        date: 'Ahora',
        amount: rechargeCalc.total,
      },
      ...current,
    ])
  }

  function chooseModel(modelId) {
    setSelectedModelId(modelId)
    setActive('Crear video')
    setCreatorOpen(true)
  }

  function openCreator() {
    setSelectedModelId(mockModelosIA[0].id)
    setActive('Crear video')
    setCreatorOpen(true)
  }

  return (
    <div className="app-shell">
      <Sidebar active={active} onNavigate={navigate} onLogout={onLogout} user={user} />
      <main className="dashboard">
        <header className="dashboard-header">
          <div className="mobile-header-brand"><BrandMark /><strong>AIVA<span>.</span>studio</strong></div>
          <div className="breadcrumbs"><span>Estudio</span><b>/</b><strong>{activeTitle}</strong></div>
          <div className="header-actions">
            <span className="studio-mode">FRONTEND DEMO</span>
            <div className="header-user"><span className="avatar avatar-yellow">{(user?.nombre || 'AR').slice(0, 2).toUpperCase()}</span><span><b>{user?.nombre || 'Andrés Rojas'}</b><small>⚡ {formatCredits(user?.creditosDisponibles ?? 0)} cr</small></span></div>
          </div>
        </header>
        <nav className="mobile-studio-nav" aria-label="Navegación móvil">
          {[...navItems, { label: 'Preferencias', icon: 'models' }].map(({ icon, label }) => (
            <button key={label} className={active === label ? 'active' : ''} onClick={() => navigate(label)}>
              <StudioIcon name={icon} /><span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="dashboard-content">
          {notice && <div className={`workspace-notice ${noticeType}`} role="status"><span>{notice}</span><button onClick={() => setNotice('')} aria-label="Cerrar aviso">×</button></div>}
          {active === 'Resumen' && <SummaryView user={user} projects={projects} onCreate={openCreator} onNavigate={navigate} onOpenProject={setSelectedProject} />}
          {active === 'Mis proyectos' && <ProjectsView projects={projects} onCreate={openCreator} onOpenProject={setSelectedProject} />}
          {active === 'Modelos IA' && <ModelsView onChooseModel={chooseModel} />}
          {active === 'Créditos' && <CreditsView user={user} onRecharge={recharge} transactions={transactions} />}
          {(active === 'Configuración' || active === 'Preferencias') && <PreferencesView user={user} />}
          {active === 'Crear video' && (
            <section className="create-landing">
              <PageHeading eyebrow="ESTUDIO DE GENERACIÓN" title="Crea tu próximo video." description="Convierte una descripción en una solicitud de video lista para renderizar." action={<button className="primary-button create-button" onClick={openCreator}><StudioIcon name="plus" />Comenzar</button>} />
              <div className="creator-steps">
                <article><span>01</span><h2>Describe la idea</h2><p>Escribe el concepto, la escena y el tono que quieres transmitir.</p></article>
                <article><span>02</span><h2>Elige el modelo</h2><p>Compara modelos, formato y duración con el costo estimado.</p></article>
                <article><span>03</span><h2>Envía a la cola</h2><p>Revisa la solicitud y sigue su estado desde Mis proyectos.</p></article>
              </div>
              <section className="workspace-panel quick-models"><div className="section-heading"><div><h2>Modelos disponibles</h2><p>Comienza con uno de los modelos de AIVA Studio.</p></div><button className="text-link" onClick={() => setActive('Modelos IA')}>Ver catálogo <StudioIcon name="arrow" /></button></div><div className="quick-model-list">{mockModelosIA.slice(0, 3).map((model) => <button key={model.id} onClick={() => chooseModel(model.id)}><span><b>{model.nombre}</b><small>{model.costoPorSegundo} créditos por segundo</small></span><StudioIcon name="arrow" /></button>)}</div></section>
            </section>
          )}
        </div>
      </main>
      {isCreatorOpen && <VideoCreatorModal onClose={() => setCreatorOpen(false)} onCreate={createProject} creditosDisponibles={user?.creditosDisponibles ?? 0} initialModelId={selectedModelId} />}
      {selectedProject && <ProjectDetailsModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </div>
  )
}

export default StudioWorkspace