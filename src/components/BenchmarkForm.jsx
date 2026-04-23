import React from 'react'
import { BENCHMARK_FIELDS, COLORS } from '../utils/constants'

export default function BenchmarkForm({ data, onChange }) {
  const getBenchmarkColor = (value) => {
    if (value >= 0.4) return 'bg-green-100 border-green-300 text-green-800'
    if (value >= 0.25) return 'bg-amber-100 border-amber-300 text-amber-800'
    return 'bg-red-100 border-red-300 text-red-800'
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-navy-900 mb-1">Factores de Mejora (Benchmarks)</h2>
      <p className="text-sm text-navy-500 mb-6">
        Porcentajes de mejora esperados según benchmarks de industria. Puede ajustarlos según su contexto.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {BENCHMARK_FIELDS.map(field => {
          const value = data[field.id] ?? field.default
          const percentage = (value * 100).toFixed(0)

          return (
            <div key={field.id} className="p-4 bg-navy-50 rounded-xl border border-navy-200">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-navy-700">
                  {field.label}
                </label>
                <span className={`text-sm font-bold px-2 py-1 rounded-full ${getBenchmarkColor(value)}`}>
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
                className="w-full h-2 bg-navy-200 rounded-lg appearance-none cursor-pointer accent-navy-600"
              />

              <div className="flex justify-between mt-2">
                <span className="text-xs text-navy-400">0%</span>
                <span className="text-xs text-navy-400">100%</span>
              </div>

              <p className="text-xs text-navy-400 mt-2">
                Benchmark: {field.benchmark}
              </p>
            </div>
          )
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <p className="text-sm text-blue-700">
          <strong>Nota:</strong> Los valores sugeridos están basados en estudios de DOE, McKinsey, Aberdeen Group y casos de éxito en plantas industriales de Latinoamérica.
          Puedes ajustarlos según la realidad de tu planta.
        </p>
      </div>
    </div>
  )
}