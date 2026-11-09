import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Swal from 'sweetalert2'
import { aivaApi } from '../api/api'
import { calculateCreditRecharge, calculateRenderCost, formatCredits } from '../helpers/businessRules'
import { toWorkspaceMovement, toWorkspaceProject } from '../helpers/aivaMappers'
import '../Components/studio-workspace.css'

const navItems = [
  { label: 'Inicio', icon: 'grid' },
  { label: 'Crear video', icon: 'spark' },
  { label: 'Mis proyectos', icon: 'folder' },
  { label: 'Modelos IA', icon: 'models' },
  { label: 'Créditos', icon: 'wallet' },
]
const HOME_LABEL = navItems[0].label

// Botones fijos en la barra lateral. Todo lo demás va en el menú desplegable.
const SIDEBAR_LABELS = [HOME_LABEL, 'Modelos IA']

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
    logout: 'M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9',
    chevron: 'M6 9l6 6 6-6',
    user: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z',
    trash: 'M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12M9 7V4h6v3',
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

function WorkspaceMenu({ user, active, onNavigate }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onClickOutside = (event) => {
      if (!menuRef.current?.contains(event.target)) setOpen(false)
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const initials = (user?.nombre || 'AS').slice(0, 2).toUpperCase()

  return (
    <div className="workspace-menu" ref={menuRef}>
      <button
        type="button"
        className="workspace-switcher workspace-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="avatar avatar-peach">{initials}</span>
        <span><b>{user?.nombre || 'Andrés Studio'}</b></span>
        <span className={`chevron ${open ? 'open' : ''}`}><StudioIcon name="chevron" /></span>
      </button>

      {open && (
        <div className="workspace-dropdown" role="menu">
          {navItems.filter((item) => !SIDEBAR_LABELS.includes(item.label)).map(({ icon, label }) => (
            <button
              key={label}
              type="button"
              role="menuitem"
              className={active === label ? 'active' : ''}
              onClick={() => { setOpen(false); onNavigate(label) }}
            >
              <StudioIcon name={icon} />
              {label}
              {label === 'Crear video' && <span className="nav-new">Nuevo</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function Sidebar({ active, onNavigate, user }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <BrandMark />
        <strong>AIVA<span>.</span>studio</strong>
      </div>
      <WorkspaceMenu user={user} active={active} onNavigate={onNavigate} />
      <nav className="sidebar-nav" aria-label="Navegación principal">
        {navItems.filter((item) => SIDEBAR_LABELS.includes(item.label)).map(({ icon, label }) => (
          <button
            key={label}
            type="button"
            className={active === label ? 'active' : ''}
            onClick={() => onNavigate(label)}
            aria-current={active === label ? 'page' : undefined}
          >
            <StudioIcon name={icon} />
            {label}
          </button>
        ))}
      </nav>
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

function ProjectCard({ project, models, onOpen }) {
  const model = models.find((item) => item.id === project.modelId)
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

function VideoCreatorModal({ models, onClose, onCreate, creditosDisponibles, initialModelId }) {
  const [step, setStep] = useState(1)
  const [brief, setBrief] = useState({
    title: '',
    prompt: '',
    modelId: initialModelId || models[0]?.id || '',
    duration: 15,
    format: '9:16',
    style: 'Cinematográfico',
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const model = models.find((item) => item.id === brief.modelId)
  const cost = model ? calculateRenderCost(brief.duration, model.costoPorSegundo) : 0

  function updateBrief(key, value) {
    setBrief((current) => ({ ...current, [key]: value }))
    setError('')
  }

  async function continueFlow() {
    if (!model) {
      setError('No hay modelos de video disponibles en este momento.')
      return
    }
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
              {models.map((item) => <option key={item.id} value={item.id}>{item.nombre} · {item.costoPorSegundo} cr/seg</option>)}
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
            <p className="demo-callout">La solicitud se guardará en tu cuenta y quedará en cola. Aún no hay un proveedor de generación de video conectado.</p>
          </>
        )}

        {error && <p className="creator-error" role="alert">{error}</p>}
        <div className="creator-actions">
          {step > 1 && <button type="button" className="secondary-button" onClick={() => { setStep((current) => current - 1); setError('') }}>Volver</button>}
          <button type="button" className="primary-button modal-submit" onClick={continueFlow} disabled={submitting || !model || (step === 2 && cost > creditosDisponibles)}>
            {submitting ? 'Enviando...' : step === 3 ? 'Enviar a la cola' : 'Continuar'} <StudioIcon name="arrow" />
          </button>
        </div>
      </section>
    </div>
  )
}

function ProjectDetailsModal({ project, models, onClose, onDelete }) {
  const model = models.find((item) => item.id === project.modelId)
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
        <div className="creator-actions">
          <button type="button" className="danger-button" onClick={() => onDelete(project)} aria-label="Eliminar proyecto">
            <StudioIcon name="trash" />
            Eliminar proyecto
          </button>
        </div>
      </section>
    </div>
  )
}

function SummaryView({ user, projects, models, onCreate, onNavigate, onOpenProject }) {
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
          {recent.map((project) => <ProjectCard key={project.id} project={project} models={models} onOpen={onOpenProject} />)}
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

function ProjectsView({ projects, models, onCreate, onOpenProject }) {
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
            {filteredProjects.map((project) => <ProjectCard key={project.id} project={project} models={models} onOpen={onOpenProject} />)}
          </div>
        ) : (
          <div className="empty-state"><span><StudioIcon name="folder" /></span><h2>No encontramos proyectos</h2><p>Prueba con otro nombre o crea un video nuevo.</p><button className="primary-button create-button" onClick={onCreate}><StudioIcon name="plus" />Crear video</button></div>
        )}
      </section>
    </>
  )
}

function ModelsView({ models, onChooseModel }) {
  return (
    <>
      <PageHeading eyebrow="CATÁLOGO CREATIVO" title="Modelos IA" description="Compara los modelos disponibles y elige el que mejor encaje con tu idea." />
      <div className="model-grid">
        {models.map((model) => {
          return (
            <article className={`model-card ${model.color || 'coral'}`} key={model.id}>
              <div className="model-card-top"><span className="model-symbol"><StudioIcon name="spark" /></span><span className="model-tag">{model.categoria || 'Video IA'}</span></div>
              <h2>{model.nombre}</h2><p>{model.descripcion}</p>
              <div className="model-cost"><strong>{model.costoPorSegundo} <small>créditos</small></strong><span>por segundo</span></div>
              <button className="secondary-button" onClick={() => onChooseModel(model.id)}>Crear con este modelo <StudioIcon name="arrow" /></button>
            </article>
          )
        })}
      </div>
      <p className="subtle-note">Disponibilidad, precios y descripciones se consultan desde el backend.</p>
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
          <button className="primary-button create-button" onClick={() => onRecharge(Number(amount))} disabled={!Number(amount) || Number(amount) < 50}>Recargar</button>
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
      <p className="subtle-note">Puedes editar tu nombre, correo y contraseña desde el menú de tu usuario. Las preferencias de render y las notificaciones aún no tienen endpoints disponibles.</p>
    </>
  )
}

function UserMenu({ user, onEditAccount, onNavigate }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onClickOutside = (event) => {
      if (!menuRef.current?.contains(event.target)) setOpen(false)
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const initials = (user?.nombre || 'AR').slice(0, 2).toUpperCase()

  return (
    <div className="user-menu" ref={menuRef}>
      <button
        type="button"
        className="header-user user-menu-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="avatar avatar-yellow">{initials}</span>
        <span><b>{user?.nombre}</b><small>⚡ {formatCredits(user?.creditosDisponibles ?? 0)} cr</small></span>
        <span className={`chevron ${open ? 'open' : ''}`}><StudioIcon name="chevron" /></span>
      </button>

      {open && (
        <div className="user-menu-dropdown" role="menu">
          <div className="user-menu-info"><b>{user?.nombre}</b><small>{user?.email}</small></div>
          <button type="button" role="menuitem" onClick={() => { setOpen(false); onEditAccount() }}>
            <StudioIcon name="user" />Editar cuenta
          </button>
          <button type="button" role="menuitem" onClick={() => { setOpen(false); onNavigate('Preferencias') }}>
            <StudioIcon name="models" />Preferencias
          </button>
        </div>
      )}
    </div>
  )
}

function EditAccountModal({ user, onClose, onSave }) {
  const [form, setForm] = useState({
    nombre: user?.nombre || '',
    email: user?.email || '',
    passwordActual: '',
    passwordNueva: '',
    confirmar: '',
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const wantsPasswordChange = Boolean(form.passwordActual || form.passwordNueva || form.confirmar)

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
    setError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!form.nombre.trim()) return setError('El nombre es obligatorio.')
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return setError('Ingresa un correo electrónico válido.')
    if (wantsPasswordChange) {
      if (!form.passwordActual) return setError('Ingresa tu contraseña actual para cambiarla.')
      if (form.passwordNueva.length < 6 || form.passwordNueva.length > 72) {
        return setError('La nueva contraseña debe tener entre 6 y 72 caracteres.')
      }
      if (form.passwordNueva !== form.confirmar) return setError('Las contraseñas nuevas no coinciden.')
    }

    setSubmitting(true)
    try {
      await onSave(
        { nombre: form.nombre.trim(), email: form.email.trim() },
        wantsPasswordChange ? { passwordActual: form.passwordActual, passwordNueva: form.passwordNueva } : null,
      )
      onClose()
    } catch (saveError) {
      setError(saveError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <form className="create-modal" role="dialog" aria-modal="true" aria-labelledby="edit-account-title"
        onMouseDown={(event) => event.stopPropagation()} onSubmit={handleSubmit}>
        <button type="button" className="close-button" onClick={onClose} aria-label="Cerrar"><StudioIcon name="close" /></button>
        <div className="modal-kicker"><StudioIcon name="user" /><span>TU CUENTA</span></div>
        <h2 id="edit-account-title">Editar cuenta</h2>
        <p className="muted">Actualiza tu nombre, correo o contraseña.</p>

        <label htmlFor="account-name">Nombre</label>
        <input id="account-name" value={form.nombre} maxLength={80} onChange={(e) => update('nombre', e.target.value)} />

        <label htmlFor="account-email" className="field-spaced">Correo electrónico</label>
        <input id="account-email" type="email" value={form.email} maxLength={254} onChange={(e) => update('email', e.target.value)} />

        <p className="account-divider">CAMBIAR CONTRASEÑA (OPCIONAL)</p>
        <label htmlFor="account-pass-current">Contraseña actual</label>
        <input id="account-pass-current" type="password" autoComplete="current-password" value={form.passwordActual} onChange={(e) => update('passwordActual', e.target.value)} />

        <label htmlFor="account-pass-new" className="field-spaced">Nueva contraseña</label>
        <input id="account-pass-new" type="password" autoComplete="new-password" value={form.passwordNueva} onChange={(e) => update('passwordNueva', e.target.value)} />

        <label htmlFor="account-pass-confirm" className="field-spaced">Confirmar nueva contraseña</label>
        <input id="account-pass-confirm" type="password" autoComplete="new-password" value={form.confirmar} onChange={(e) => update('confirmar', e.target.value)} />

        {error && <p className="creator-error" role="alert">{error}</p>}
        <div className="creator-actions">
          <button type="button" className="secondary-button" onClick={onClose}>Cancelar</button>
          <button type="submit" className="primary-button modal-submit" disabled={submitting}>
            {submitting ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </div>
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
  const [internalUser, setInternalUser] = useState(null)

  const user = propUser || internalUser
  const setUser = propSetUser || setInternalUser

  const [active, setActive] = useState(() => initialViews[pathname] || HOME_LABEL)
  const [projects, setProjects] = useState([])
  const [transactions, setTransactions] = useState([])
  const [models, setModels] = useState([])
  const [isCreatorOpen, setCreatorOpen] = useState(false)
  const [selectedModelId, setSelectedModelId] = useState('')
  const [selectedProject, setSelectedProject] = useState(null)
  const [notice, setNotice] = useState('')
  const [noticeType, setNoticeType] = useState('info')
  const [isAccountOpen, setAccountOpen] = useState(false)

  useEffect(() => {
    const userId = localStorage.getItem('aiva_user_id')
    if (!localStorage.getItem('aiva_token') || !userId) {
      window.location.href = '/login'
      return
    }

    let activeRequest = true
    const redirectOnUnauthorized = () => window.location.replace('/login')
    window.addEventListener('aiva:unauthorized', redirectOnUnauthorized)

    Promise.all([
      aivaApi.obtenerPerfil(userId),
      aivaApi.listarProyectos(userId),
      aivaApi.listarMovimientos(userId),
      aivaApi.listarModelos(),
    ])
      .then(([profile, savedProjects, movements, availableModels]) => {
        if (!activeRequest) return
        setUser(profile)
        setProjects(savedProjects.map(toWorkspaceProject))
        setTransactions(movements.map(toWorkspaceMovement))
        setModels(availableModels)
        setSelectedModelId(availableModels[0]?.id || '')
      })
      .catch((error) => {
        if (activeRequest) {
          setNotice(error.message)
          setNoticeType('warning')
        }
      })

    return () => {
      activeRequest = false
      window.removeEventListener('aiva:unauthorized', redirectOnUnauthorized)
    }
  }, [setUser])

  async function logout() {
    try {
      await aivaApi.logout()
    } catch (error) {
      setNotice(error.message)
      setNoticeType('warning')
    }
    window.location.href = '/login'
  }

  const onLogout = propLogout || logout

  async function confirmLogout() {
    const { isConfirmed } = await Swal.fire({
      icon: 'question',
      title: '¿Cerrar sesión?',
      text: 'Tendrás que iniciar sesión de nuevo para volver a tu estudio.',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
      background: '#1e293b',
      color: '#f8fafc',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#334155',
    })
    if (isConfirmed) onLogout()
  }

  async function saveAccount(profileData, passwordData) {
    const updated = await aivaApi.actualizarPerfil(user.id, profileData)
    setUser((current) => ({ ...current, ...updated }))
    localStorage.setItem('aiva_user', JSON.stringify(updated))

    if (passwordData) {
      try {
        await aivaApi.cambiarPassword(user.id, passwordData)
      } catch (error) {
        throw new Error(`Tus datos se actualizaron, pero la contraseña no cambió: ${error.message}`)
      }
    }
    setNotice(passwordData ? 'Cuenta y contraseña actualizadas.' : 'Cuenta actualizada correctamente.')
    setNoticeType('success')
  }

  const activeTitle = useMemo(() => active === 'Configuración' ? 'Preferencias' : active, [active])

  function navigate(label) {
    setActive(label)
    if (label === 'Crear video') {
      setSelectedModelId(models[0]?.id || '')
      setCreatorOpen(true)
    }
  }

    async function createProject(brief) {
    if (!user || brief.cost > user.creditosDisponibles) {
      throw new Error('No tienes créditos suficientes para enviar esta solicitud.')
    }

    try {
      const savedProject = await aivaApi.crearProyecto({
        usuarioId: user.id,
        nombre: brief.title.trim(),
        prompt: brief.prompt.trim(),
        modelId: brief.modelId,
        modeloIa: brief.modelName,
        costoCreditos: brief.cost,
        duracionSeg: brief.duration,
        formato: brief.format,
        estilo: brief.style,
      })
      const project = toWorkspaceProject(savedProject)
      setProjects((current) => [project, ...current])
      setTransactions((current) => [{
        id: savedProject.id,
        label: `Generación · ${savedProject.nombre}`,
        date: 'Ahora',
        amount: -savedProject.costoCreditos,
      }, ...current])
      setUser((current) => ({
        ...current,
        creditosDisponibles: savedProject.creditosDisponibles,
      }))
      renderToStaticMarkup.fire({icon: 'success', title: 'Solicitud guardada en la cola'})
    } catch (error) {
      setNotice(`No se pudo guardar la solicitud: ${error.message}`)
      setNoticeType('warning')
      throw error
    }
    setCreatorOpen(false)
    setActive('Mis proyectos')
  }

    async function deleteProject(project) {
    console.log('[eliminar] 1. función iniciada, id =', project.id)

    const result = await Swal.fire({
      icon: 'warning',
      title: '¿Eliminar proyecto?',
      text: `Se eliminará "${project.title}". No podrás recuperarlo y los créditos no se devolverán.`,
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#1e293b',
      color: '#f8fafc',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#334155',
    })
    console.log('[eliminar] 2. resultado de la confirmación:', result)

    if (!result.isConfirmed) return

    try {
      console.log('[eliminar] 3. llamando a la API')
      await aivaApi.eliminarProyecto(project.id)
      console.log('[eliminar] 4. la API respondió bien')

      setProjects((current) => current.filter((item) => item.id !== project.id))
      setSelectedProject(null)
      setNotice('Proyecto eliminado.')
      setNoticeType('success')
    } catch (error) {
      console.error('[eliminar] error:', error)
      await Swal.fire({
        icon: 'error',
        title: 'No se pudo eliminar el proyecto',
        text: error.message,
        background: '#1e293b',
        color: '#f8fafc',
        confirmButtonColor: '#6366f1',
      })
    }
  }

  async function recharge(amount) {
    if (!Number.isFinite(amount) || amount < 50) {
      setNotice('La recarga mínima de demostración es de 50 créditos.')
      setNoticeType('warning')
      return
    }

    try {
      const result = await aivaApi.recargarCreditos(user.id, amount)
      setUser((current) => ({
        ...current,
        creditosDisponibles: result.creditosDisponibles,
      }))
      setTransactions((current) => [{
        id: Date.now(),
        label: result.bonificacion > 0
          ? `Recarga de prueba (+${formatCredits(result.bonificacion)} bono)`
          : 'Recarga de prueba',
        date: 'Ahora',
        amount: result.totalRecargado,
      }, ...current])
      setNotice('Recarga de prueba guardada. El pago real requiere una pasarela.')
      setNoticeType('success')
    } catch (error) {
      setNotice(`No se pudo guardar la recarga: ${error.message}`)
      setNoticeType('warning')
      return
    }
  }

  function chooseModel(modelId) {
    setSelectedModelId(modelId)
    setActive('Crear video')
    setCreatorOpen(true)
  }

  function openCreator() {
    if (!models.length) {
      setNotice('No hay modelos de video disponibles en este momento.')
      setNoticeType('warning')
      return
    }
    setSelectedModelId(models[0].id)
    setActive('Crear video')
    setCreatorOpen(true)
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-12 text-center text-slate-200">
        {notice || 'Cargando tu espacio AIVA...'}
      </main>
    )
  }

  return (
    <div className="app-shell">
      <Sidebar active={active} onNavigate={navigate} onLogout={confirmLogout} user={user} />
      <main className="dashboard">
        <header className="dashboard-header">
          <div className="mobile-header-brand"><BrandMark /><strong>AIVA<span>.</span>studio</strong></div>
          <div className="breadcrumbs"><span>Estudio</span><b>/</b><strong>{activeTitle}</strong></div>
          <div className="header-actions">
            <span className="studio-mode">AIVA STUDIO</span>
            <UserMenu user={user} onEditAccount={() => setAccountOpen(true)} onNavigate={navigate} />
            <button type="button" className="header-logout" onClick={confirmLogout} aria-label="Cerrar sesión" title="Cerrar sesión">
              <StudioIcon name="logout" /><span>Salir</span>
            </button>
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
          {active === HOME_LABEL && <SummaryView user={user} projects={projects} models={models} onCreate={openCreator} onNavigate={navigate} onOpenProject={setSelectedProject} />}
          {active === 'Mis proyectos' && <ProjectsView projects={projects} models={models} onCreate={openCreator} onOpenProject={setSelectedProject} />}
          {active === 'Modelos IA' && <ModelsView models={models} onChooseModel={chooseModel} />}
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
              <section className="workspace-panel quick-models"><div className="section-heading"><div><h2>Modelos disponibles</h2><p>Comienza con uno de los modelos de AIVA Studio.</p></div><button className="text-link" onClick={() => setActive('Modelos IA')}>Ver catálogo <StudioIcon name="arrow" /></button></div><div className="quick-model-list">{models.slice(0, 3).map((model) => <button key={model.id} onClick={() => chooseModel(model.id)}><span><b>{model.nombre}</b><small>{model.costoPorSegundo} créditos por segundo</small></span><StudioIcon name="arrow" /></button>)}</div></section>
            </section>
          )}
        </div>
      </main>
      {isCreatorOpen && <VideoCreatorModal models={models} onClose={() => setCreatorOpen(false)} onCreate={createProject} creditosDisponibles={user?.creditosDisponibles ?? 0} initialModelId={selectedModelId} />}
      {selectedProject && <ProjectDetailsModal project={selectedProject} models={models} onClose={() => setSelectedProject(null)} onDelete={deleteProject}/>}
      {isAccountOpen && <EditAccountModal user={user} onClose={() => setAccountOpen(false)} onSave={saveAccount} />}
    </div>
  )
}

export default StudioWorkspace