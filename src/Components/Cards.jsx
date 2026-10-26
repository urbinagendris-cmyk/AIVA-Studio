export const Card = ({ proyecto }) => {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-sm hover:border-slate-600 transition-all flex flex-col">
      <img
        src={proyecto.urlPreview}
        alt={proyecto.nombre}
        className="w-full h-36 object-cover opacity-80 hover:opacity-100 transition-opacity"
      />
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-2 mb-1">
            <h3 className="font-semibold text-white text-base truncate">{proyecto.nombre}</h3>
            <span
              className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                proyecto.estado === "FINALIZADO"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/20"
              }`}
            >
              {proyecto.estado}
            </span>
          </div>
          <p className="text-xs text-indigo-400 font-medium">{proyecto.modeloIa}</p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-700/60 flex justify-between items-center text-xs text-slate-400">
          <span>⏱ {proyecto.duracionSeg} seg</span>
          <span>⚡ {proyecto.costoCreditos} cr</span>
        </div>
      </div>
    </div>
  );
};

export default Card;