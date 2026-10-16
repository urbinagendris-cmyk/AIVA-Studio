// Datos simulados de AIVA Studio coherentes con el Backend Spring Boot

export const mockUsuario = {
  id: 1,
  email: "creador@aivastudio.com",
  creditosDisponibles: 250,
  suscripcionActiva: true,
  rol: "CREATOR"
};

export const mockModelosIA = [
  { id: "lumina-v2", nombre: "Lumina Video Pro v2", costoPorSegundo: 2 },
  { id: "sora-api", nombre: "Sora API Direct", costoPorSegundo: 5 },
  { id: "runway-gen3", nombre: "Runway Gen-3 Alpha", costoPorSegundo: 4 },
  { id: "svd-xl", nombre: "Stable Video Diffusion XL", costoPorSegundo: 1 }
];

export const mockProyectos = [
  {
    id: 101,
    nombre: "Teaser Comercial Tech 2026",
    modeloIa: "Lumina Video Pro v2",
    costoCreditos: 60,
    duracionSeg: 30,
    estado: "FINALIZADO",
    fechaCreacion: "2026-10-12T14:30:00",
    urlPreview: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 102,
    nombre: "Render Avatar Holográfico",
    modeloIa: "Sora API Direct",
    costoCreditos: 100,
    duracionSeg: 20,
    estado: "EN_PROCESO",
    fechaCreacion: "2026-10-15T09:15:00",
    urlPreview: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 103,
    nombre: "Intro Canal YouTube 4K",
    modeloIa: "Runway Gen-3 Alpha",
    costoCreditos: 40,
    duracionSeg: 10,
    estado: "FINALIZADO",
    fechaCreacion: "2026-10-10T18:45:00",
    urlPreview: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"
  }
];