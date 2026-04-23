import React from 'react'
import InputField from './InputField'

export default function FinancialForm({ data, onChange, isContratoMarco, inflationRate, onInflationChange }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-navy-900 mb-6">Parámetros Financieros</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        <div className="mb-4">
          <label className="block text-navy-700 text-sm font-medium mb-1">
            Tasa de Descuento (anual)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="5"
              max="30"
              value={(data.discountRate || 0.12) * 100}
              onChange={(e) => onChange('discountRate', parseInt(e.target.value) / 100)}
              className="flex-1 h-2 bg-navy-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="w-16 text-right font-bold text-navy-700">
              {Math.round((data.discountRate || 0.12) * 100)}%
            </span>
          </div>
          <p className="text-navy-400 text-xs mt-1">
            Usada para calcular el Valor Actual Neto (VAN)
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-navy-700 text-sm font-medium mb-1">
            Horizonte de Proyección (años)
          </label>
          <select
            value={data.projectionYears || 5}
            onChange={(e) => onChange('projectionYears', parseInt(e.target.value))}
            className="w-full px-4 py-3 rounded-lg border border-navy-200 bg-white focus:border-navy-500 focus:ring-2 focus:ring-navy-200 outline-none transition-all text-navy-900"
          >
            {[3, 4, 5, 6, 7, 8, 10].map(year => (
              <option key={year} value={year}>{year} años</option>
            ))}
          </select>
        </div>

        {isContratoMarco && (
          <div className="mb-4 md:col-span-2">
            <label className="block text-navy-700 text-sm font-medium mb-1">
              Inflación Anual del Contrato
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="15"
                step="0.5"
                value={(inflationRate || 0.04) * 100}
                onChange={(e) => onInflationChange('inflationRate', parseFloat(e.target.value) / 100)}
                className="flex-1 h-2 bg-navy-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="w-16 text-right font-bold text-navy-700">
                {((inflationRate || 0.04) * 100).toFixed(1)}%
              </span>
            </div>
            <p className="text-navy-400 text-xs mt-1">
              Incremento anual del valor del contrato. Típico: 3-5%
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-navy-800 font-semibold mb-2">¿Qué es la Tasa de Descuento?</h3>
        <p className="text-navy-600 text-sm">
          La tasa de descuento representa el costo de oportunidad del capital y el riesgo del proyecto.
          Se usa para calcular el Valor Presente Neto (VAN) de los flujos de caja futuros.
          Una tasa mayor indica mayor percepción de riesgo.
        </p>
      </div>
    </div>
  )
}