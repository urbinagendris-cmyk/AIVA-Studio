const statusLabels = {
  EN_COLA: 'En cola',
  BORRADOR: 'Borrador',
  EN_PROCESO: 'Generando',
  COMPLETADO: 'Listo',
  ARCHIVADO: 'Archivado',
};

// El backend envía LocalDateTime con microsegundos (ej. 2026-11-05T19:53:40.830723).
const parseApiDate = (value) => new Date(String(value).replace(/(\.\d{3})\d+/, '$1'));

const dateFormatter = new Intl.DateTimeFormat('es-CO', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

const modelColors = {
  'lumina-v2': 'coral',
  'sora-api': 'blue',
  'runway-gen3': 'gold',
  'svd-xl': 'green',
};

export function toWorkspaceProject(project) {
  return {
    id: project.id,
    title: project.nombre,
    prompt: project.prompt || '',
    style: project.estilo,
    modelId: project.modelId,
    modelName: project.modeloIa,
    format: project.formato,
    duration: project.duracionSeg,
    costoCreditos: project.costoCreditos,
    type: project.estilo,
 date: dateFormatter.format(parseApiDate(project.fechaCreacion)),
    status: statusLabels[project.estado] || project.estado,
    color: modelColors[project.modelId] || 'coral',
  };
}

export function toWorkspaceMovement(movement) {
  return {
    id: movement.id,
    label: movement.label,
    date: dateFormatter.format(parseApiDate(movement.date)),
    amount: movement.amount,
  };
}
