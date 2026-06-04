import React from 'react'
import { FactoryIcon, InfoIcon, ArrowDownIcon } from './Icons'

export default function FinancialForm({ data, onChange, isContratoMarco, inflationRate, onInflationChange }) {
  return (
    <div className="glass-panel p-8 relative overflow-hidden animate-fade-in">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amaq-400 to-amaq-600"></div>
      <h2 className="text-2xl font-black text-amaq-700 mb-8 flex items-center gap-3">
        <FactoryIcon className="w-7 h-7 text-amaq-700 shrink-0" />
        <span>Parámetros Financieros</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div className="p-5 bg-slate-50/60 rounded-2xl border border-slate-200 shadow-inner">
          <label className="block text-slate-700 font-bold mb-2 tracking-wide text-sm">
            Tasa de Descuento (anual)
          </label>
          <div className="flex items-center gap-4 mt-4">
            <input
              type="range"
              min="5"
              max="30"
              value={(data.discountRate || 0.12) * 100}
              onChange={(e) => onChange('discountRate', parseInt(e.target.value) / 100)}
              className="flex-1 h-2 bg-white rounded-lg appearance-none cursor-pointer accent-amaq-500 hover:accent-amaq-400"
            />
            <span className="w-16 text-center font-bold text-amaq-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              {Math.round((data.discountRate || 0.12) * 100)}%
            </span>
          </div>
          <p className="text-slate-500 text-xs mt-3 flex items-center gap-1.5 font-medium">
            <InfoIcon className="w-4 h-4 text-amaq-700 shrink-0" />
            <span>Usada para calcular el Valor Actual Neto (VAN)</span>
          </p>
        </div>

        <div className="p-5 bg-slate-50/60 rounded-2xl border border-slate-200 shadow-inner">
          <label className="block text-slate-700 font-bold mb-2 tracking-wide text-sm">
            Horizonte de Proyección (años)
          </label>
          <div className="relative mt-2">
            <select
              value={data.projectionYears || 5}
              onChange={(e) => onChange('projectionYears', parseInt(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-900 focus:border-amaq-400 focus:bg-slate-50 focus:shadow-glow outline-none transition-all duration-300 shadow-inner appearance-none cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(year => (
                <option key={year} value={year} className="bg-slate-50 text-slate-900">{year} años</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-amaq-700">
              <ArrowDownIcon className="w-4 h-4" />
            </div>
          </div>
        </div>

        {isContratoMarco && (
          <div className="p-5 bg-slate-50/60 rounded-2xl border border-slate-200 shadow-inner md:col-span-2">
            <label className="block text-slate-700 font-bold mb-2 tracking-wide text-sm">
              Inflación Anual del Contrato
            </label>
            <div className="flex items-center gap-4 mt-4">
              <input
                type="range"
                min="0"
                max="15"
                step="0.5"
                value={(inflationRate || 0.04) * 100}
                onChange={(e) => onInflationChange('inflationRate', parseFloat(e.target.value) / 100)}
                className="flex-1 h-2 bg-white rounded-lg appearance-none cursor-pointer accent-amaq-500 hover:accent-amaq-400"
              />
              <span className="w-16 text-center font-bold text-amaq-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                {((inflationRate || 0.04) * 100).toFixed(1)}%
              </span>
            </div>
            <p className="text-slate-500 text-xs mt-3 flex items-center gap-1.5 font-medium">
              <InfoIcon className="w-4 h-4 text-amaq-700 shrink-0" />
              <span>Incremento anual del valor del contrato. Típico: 3-5%</span>
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 p-5 bg-amaq-50 border border-amaq-200 rounded-xl shadow-glow relative overflow-hidden">
        <div className="absolute -right-5 -bottom-5 w-24 h-24 bg-amaq-500/10 rounded-full blur-[20px] pointer-events-none"></div>
        <h3 className="text-slate-900 font-bold mb-2 tracking-wide">¿Qué es la Tasa de Descuento?</h3>
        <p className="text-slate-900 text-sm leading-relaxed">
          La tasa de descuento representa el costo de oportunidad del capital y el riesgo del proyecto.
          Se usa para calcular el Valor Presente Neto (VAN) de los flujos de caja futuros.
          Una tasa mayor indica mayor percepción de riesgo.
        </p>
      </div>
    </div>
  )
}
