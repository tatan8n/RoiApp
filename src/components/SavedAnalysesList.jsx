import React from 'react'
import { FolderIcon, TrashIcon, XIcon, SaveIcon, CubeIcon, CogIcon, DocumentTextIcon, DocumentCheckIcon } from './Icons'

function formatDate(isoString) {
  try {
    const d = new Date(isoString)
    return d.toLocaleString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return isoString
  }
}

function getScenarioLabel(analysis) {
  if (analysis.calculationType === 'product') {
    return 'Producto / Equipo'
  }
  if (analysis.serviceType === 'rotodinamico') {
    return 'Servicio Rotodinámico'
  }
  if (analysis.serviceType === 'contrato_marco') {
    return 'Contrato Marco'
  }
  return 'Servicio'
}

function getCompanyName(analysis) {
  return analysis.formData?.client?.companyName || 'Sin empresa'
}

function getSector(analysis) {
  return analysis.formData?.client?.sector || 'Sin sector'
}

function ScenarioIcon({ analysis }) {
  const iconClass = "w-5 h-5 text-slate-600"
  if (analysis.calculationType === 'product') {
    return <CubeIcon className={iconClass} />
  }
  if (analysis.serviceType === 'rotodinamico') {
    return <CogIcon className={iconClass} />
  }
  if (analysis.serviceType === 'contrato_marco') {
    return <DocumentTextIcon className={iconClass} />
  }
  return <DocumentCheckIcon className={iconClass} />
}

export default function SavedAnalysesList({ analyses, onOpen, onDelete, onClearAll, onClose }) {
  if (!analyses || analyses.length === 0) {
    return null
  }

  return (
    <div className="mt-8 w-full max-w-2xl relative z-10">
      <div className="glass-panel p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amaq-400 to-amaq-600"></div>

        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amaq-50 border-2 border-amaq-500/30 flex items-center justify-center shadow-glow">
              <FolderIcon className="w-6 h-6 text-amaq-700" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Análisis guardados</h2>
              <p className="text-slate-500 text-xs font-semibold">{analyses.length} disponible{analyses.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {analyses.length > 1 && (
              <button
                onClick={() => {
                  if (window.confirm('¿Eliminar todos los análisis guardados? Esta acción no se puede deshacer.')) {
                    onClearAll()
                  }
                }}
                className="text-xs text-red-600 hover:text-red-800 font-semibold px-2 py-1 rounded hover:bg-red-50 transition-colors"
              >
                Borrar todos
              </button>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                aria-label="Cerrar lista"
              >
                <XIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
          {analyses.map((analysis) => (
            <div
              key={analysis.id}
              className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white/60 hover:bg-white hover:border-amaq-400 transition-all group"
            >
              <div className="w-11 h-11 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                <ScenarioIcon analysis={analysis} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900 truncate text-sm">
                  {analysis.analystName}
                </p>
                <p className="text-xs text-slate-600 font-medium truncate">
                  {getCompanyName(analysis)} · {getSector(analysis)}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-amaq-700 bg-amaq-50 px-2 py-0.5 rounded border border-amaq-200">
                    {getScenarioLabel(analysis)}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {formatDate(analysis.savedAt)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => onOpen(analysis)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-amaq-700 to-amaq-500 hover:from-amaq-600 hover:to-amaq-400 transition-all shadow-sm flex items-center gap-1.5"
                >
                  <SaveIcon className="w-3.5 h-3.5" />
                  <span>Abrir</span>
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`¿Eliminar el análisis de "${analysis.analystName}"?`)) {
                      onDelete(analysis.id)
                    }
                  }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                  aria-label="Eliminar análisis"
                  title="Eliminar análisis"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
