const statusLabels = {
  EN_COLA: 'En cola',
  EN_PROCESO: 'Generando',
  FINALIZADO: 'Listo',
  FALLIDO: 'Fallido',
};

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
    date: new Intl.DateTimeFormat('es-CO', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(project.fechaCreacion)),
    status: statusLabels[project.estado] || project.estado,
    color: modelColors[project.modelId] || 'coral',
  };
}

export function toWorkspaceMovement(movement) {
  return {
    id: movement.id,
    label: movement.label,
    date: new Intl.DateTimeFormat('es-CO', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(movement.date)),
    amount: movement.amount,
  };
}
