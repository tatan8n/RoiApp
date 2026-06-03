import React from 'react'
import { COLORS } from '../utils/constants'
import { CheckIcon, WarningIcon } from './Icons'

export default function CertaintyMeter({ certainty, missingFields = [], levelInfo }) {
  const percentage = Math.min(100, Math.max(0, certainty))
  const color = levelInfo?.color || COLORS.warning

  return (
    <div className="glass-panel p-6 relative overflow-hidden mt-6 mb-8">
      <div 
        className="absolute -left-10 -top-10 w-40 h-40 rounded-full blur-[50px] opacity-20 pointer-events-none"
        style={{ backgroundColor: color }}
      ></div>

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-glow border-2"
            style={{ backgroundColor: `${color}80`, borderColor: color }}
          >
            {levelInfo?.level === 'Alta' ? (
              <CheckIcon className="w-6 h-6 text-white" />
            ) : (
              <WarningIcon className="w-6 h-6 text-white" />
            )}
          </div>
          <div>
            <p className="text-amaq-700 font-bold tracking-wide">Nivel de Certeza del Análisis</p>
            <p className="text-3xl font-black flex items-baseline gap-2 mt-1" style={{ color }}>
              {percentage}%
              <span className="text-sm font-semibold text-slate-500 uppercase tracking-widest">
                ({levelInfo?.level || 'Media'})
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 relative z-10">
        <div className="w-full bg-slate-50 border border-slate-200 rounded-full h-3 overflow-hidden shadow-inner">
          <div
            className="h-3 rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${percentage}%`,
              backgroundColor: color,
              boxShadow: `0 0 10px ${color}`
            }}
          />
        </div>
      </div>

      {missingFields.length > 0 && (
        <div className="mt-5 p-4 bg-amber-50 border border-amber-200 rounded-xl relative z-10">
          <p className="text-amber-800 text-sm font-bold mb-2 flex items-center gap-2">
            <WarningIcon className="w-5 h-5 text-amber-600 shrink-0" />
            <span>Campos faltantes para mayor precisión:</span>
          </p>
          <ul className="text-amber-700 text-xs space-y-1.5 pl-6 list-disc">
            {missingFields.map((field, index) => (
              <li key={index}>{field}</li>
            ))}
          </ul>
        </div>
      )}

      {percentage < 50 && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl relative z-10">
          <p className="text-red-800 text-sm font-bold flex items-start gap-2">
            <WarningIcon className="w-5 h-5 text-red-600 shrink-0 mt-0.5" /> 
            <span>Este análisis tiene baja certeza. Los resultados deben considerarse solo como una estimación indicativa inicial.</span>
          </p>
        </div>
      )}
    </div>
  )
}
