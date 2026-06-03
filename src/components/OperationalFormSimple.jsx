import React from 'react'
import { OPERATIONAL_FIELDS } from '../utils/constants'
import { FactoryIcon, LightbulbIcon } from './Icons'

export default function OperationalForm({ data, onChange }) {
  const formatNumber = (value) => {
    if (!value) return ''
    return new Intl.NumberFormat('es-CO').format(value)
  }

  const parseNumber = (value) => {
    if (!value) return null
    const clean = value.replace(/[^0-9]/g, '')
    return clean ? parseInt(clean) : null
  }

  const handleChange = (id, rawValue) => {
    const num = parseNumber(rawValue)
    onChange(id, num)
  }

  return (
    <div className="glass-panel p-8 relative overflow-hidden animate-fade-in">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amaq-400 to-amaq-600"></div>
      <h2 className="text-2xl font-black text-amaq-700 mb-2 flex items-center gap-3">
        <FactoryIcon className="w-7 h-7 text-amaq-700 shrink-0" />
        <span>Datos Operativos de tu Planta</span>
      </h2>
      <p className="text-slate-600 mb-8 font-medium">
        Ingresa la información de tu operación. Estos datos nos permiten calcular el ROI de tu inversión.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {OPERATIONAL_FIELDS.map((field) => (
          <div key={field.id} className="relative">
            <label className="block text-slate-700 font-semibold mb-2 text-sm tracking-wide">
              {field.label}
              <span className="text-slate-600 font-medium text-sm ml-2">({field.unit})</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={formatNumber(data[field.id])}
                onChange={(e) => handleChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-slate-200 bg-white text-slate-900 focus:border-amaq-400 focus:bg-slate-50 focus:shadow-glow outline-none transition-all duration-300 shadow-inner text-lg"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-amaq-700 text-sm font-medium">
                {field.unit}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-amaq-50 rounded-xl border border-amaq-200">
        <div className="flex items-start">
          <LightbulbIcon className="w-5 h-5 text-amaq-600 shrink-0 mr-3 mt-1" />
          <div>
            <p className="text-slate-800 font-bold">¿No tienes estos datos exactos?</p>
            <p className="text-slate-600 text-sm mt-1 font-medium">
              Ingresa estimaciones aproximadas. Los cálculos funcionarán igualmente y podrás ajustar después.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
