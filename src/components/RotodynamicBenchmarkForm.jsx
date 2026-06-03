import React from 'react'
import { ROTODYNAMIC_BENCHMARK_FIELDS } from '../utils/constants'
import { ChartIcon } from './Icons'

export default function RotodynamicBenchmarkForm({ benchmarks, onChange }) {
  const getBenchmarkColor = (value) => {
    if (value >= 0.4) return 'bg-green-50 border-green-200 text-green-800'
    if (value >= 0.25) return 'bg-yellow-50 border-yellow-200 text-yellow-800'
    return 'bg-red-50 border-red-200 text-red-800'
  }

  return (
    <div className="glass-panel p-8 relative overflow-hidden animate-fade-in">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amaq-400 to-amaq-600"></div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-black text-amaq-700 mb-3 flex items-center gap-3">
          <ChartIcon className="w-7 h-7 text-amaq-700 shrink-0" />
          <span>Factores de Mejora Esperados</span>
        </h2>
        <p className="text-slate-600 font-semibold">
          Ajusta los porcentajes de mejora que esperas obtener con el servicio rotodinámico.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {ROTODYNAMIC_BENCHMARK_FIELDS.map(field => {
          const value = benchmarks[field.id] ?? field.default
          const percentage = (value * 100).toFixed(0)

          return (
            <div key={field.id} className="p-5 bg-slate-50/60 rounded-2xl border border-slate-200 shadow-inner hover:border-amaq-500/50 transition-colors duration-300">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-bold text-slate-900 tracking-wide pr-4">
                  {field.label}
                </label>
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getBenchmarkColor(value)} shadow-sm`}>
                  {percentage}%
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={percentage}
                onChange={(e) => onChange(field.id, parseInt(e.target.value) / 100)}
                className="w-full h-2 bg-slate-100 border border-slate-200 rounded-lg appearance-none cursor-pointer accent-amaq-500 hover:accent-amaq-400 transition-all"
              />

              <div className="flex justify-between mt-3">
                <span className="text-xs font-semibold text-slate-500">0%</span>
                <span className="text-xs font-semibold text-slate-500">100%</span>
              </div>

              <p className="text-xs text-slate-700 mt-4 bg-white p-2 rounded-lg border border-slate-200 font-medium">
                <span className="font-semibold text-amaq-700">Ref:</span> {field.benchmark}
              </p>
            </div>
          )
        })}
      </div>

      <div className="p-5 bg-amaq-50 border border-amaq-200 rounded-xl shadow-glow">
        <p className="text-sm text-slate-800 leading-relaxed font-semibold">
          <strong className="text-amaq-700">Nota:</strong> Los valores sugeridos están basados en estudios de EPRI, McKinsey y casos de éxito en plantas de generación eléctrica de Latinoamérica.
          Puedes ajustarlos según la realidad de tu central.
        </p>
      </div>
    </div>
  )
}
