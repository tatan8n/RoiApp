import React from 'react'
import { BENCHMARK_FIELDS, COLORS } from '../utils/constants'
import InputField from './InputField'

export default function BenchmarkForm({ data, onChange }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-navy-900 mb-2">Factores de Mejora (Benchmarks)</h2>
      <p className="text-navy-400 text-sm mb-6">Porcentajes de mejora esperados según benchmarks de industria. Puede ajustarlos según su contexto.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        {BENCHMARK_FIELDS.map(field => (
          <div key={field.id} className="mb-4">
            <label className="block text-navy-700 text-sm font-medium mb-1">
              {field.label}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="100"
                value={(data[field.id] || 0) * 100}
                onChange={(e) => onChange(field.id, parseInt(e.target.value) / 100)}
                className="flex-1 h-2 bg-navy-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="w-16 text-right font-bold text-navy-700">
                {Math.round((data[field.id] || 0) * 100)}%
              </span>
            </div>
            <p className="text-navy-400 text-xs mt-1">
              Benchmark: {field.benchmark} | Peso: {field.weight}%
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}