// Datos simulados de AIVA Studio coherentes con el Backend Spring Boot y vistas React

export const mockUsuario = {
  id: 1,
  nombre: "Andrés Rojas",
  email: "creador@aivastudio.com",
  creditosDisponibles: 250,
  suscripcionActiva: true,
  rol: "CREATOR"
};

export const mockModelosIA = [
  {
    id: "lumina-v2",
    nombre: "Lumina Video Pro v2",
    costoPorSegundo: 2,
    categoria: "Equilibrado",
    descripcion: "Una opción versátil para anuncios, historias y contenido diario.",
    color: "coral"
  },
  {
    id: "sora-api",
    nombre: "Sora API Direct",
    costoPorSegundo: 5,
    categoria: "Alta fidelidad",
    descripcion: "Escenas detalladas y narrativas con acabado cinematográfico.",
    color: "blue"
  },
  {
    id: "runway-gen3",
    nombre: "Runway Gen-3 Alpha",
    costoPorSegundo: 4,
    categoria: "Creativo",
    descripcion: "Ideal para explorar estilos, movimiento y conceptos visuales.",
    color: "gold"
  },
  {
    id: "svd-xl",
    nombre: "Stable Video Diffusion XL",
    costoPorSegundo: 1,
    categoria: "Ligero",
    descripcion: "Prueba ideas y conceptos con un consumo de créditos menor.",
    color: "green"
  }
];

export const mockProyectos = [
  {
    id: 101,
    nombre: "Teaser Comercial Tech 2026",
    title: "Teaser Comercial Tech 2026",
    modeloIa: "Lumina Video Pro v2",
    modelId: "lumina-v2",
    costoCreditos: 60,
    duracionSeg: 30,
    duration: 30,
    formato: "16:9",
    format: "16:9",
    style: "Cinematográfico",
    prompt: "Una campaña luminosa y futurista para el lanzamiento de una marca tecnológica.",
    estado: "FINALIZADO",
    status: "Listo",
    fechaCreacion: "2026-10-12T14:30:00",
    date: "12 oct, 14:30",
    color: "coral",
    urlPreview: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 102,
    nombre: "Render Avatar Holográfico",
    title: "Render Avatar Holográfico",
    modeloIa: "Sora API Direct",
    modelId: "sora-api",
    costoCreditos: 100,
    duracionSeg: 20,
    duration: 20,
    formato: "9:16",
    format: "9:16",
    style: "Editorial",
    prompt: "Un holograma interactivo flotando sobre un escenario cyberpunk oscuro.",
    estado: "EN_PROCESO",
    status: "Generando",
    fechaCreacion: "2026-10-15T09:15:00",
    date: "15 oct, 09:15",
    color: "blue",
    urlPreview: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 103,
    nombre: "Intro Canal YouTube 4K",
    title: "Intro Canal YouTube 4K",
    modeloIa: "Runway Gen-3 Alpha",
    modelId: "runway-gen3",
    costoCreditos: 40,
    duracionSeg: 10,
    duration: 10,
    formato: "16:9",
    format: "16:9",
    style: "Animación",
    prompt: "Animación fluida con tipografía cinética y transiciones dinámicas.",
    estado: "FINALIZADO",
    status: "Listo",
    fechaCreacion: "2026-10-10T18:45:00",
    date: "10 oct, 18:45",
    color: "gold",
    urlPreview: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"
  }
];