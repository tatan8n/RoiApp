import React from 'react'
import { OPERATIONAL_FIELDS } from '../utils/constants'

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
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-navy-900 mb-2">
        📊 Datos Operativos de tu Planta
      </h2>
      <p className="text-navy-600 mb-8">
        Ingresa la información de tu operación. Estos datos nos permiten calcular el ROI de tu inversión.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {OPERATIONAL_FIELDS.map((field) => (
          <div key={field.id} className="relative">
            <label className="block text-navy-800 font-semibold mb-2">
              {field.label}
              <span className="text-navy-400 font-normal text-sm ml-2">({field.unit})</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={formatNumber(data[field.id])}
                onChange={(e) => handleChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-navy-200 focus:border-navy-500 focus:ring-2 focus:ring-navy-200 outline-none transition-all text-navy-900 text-lg"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-navy-400 text-sm">
                {field.unit}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-navy-50 rounded-xl border border-navy-200">
        <div className="flex items-start">
          <span className="text-2xl mr-3">💡</span>
          <div>
            <p className="text-navy-700 font-medium">¿No tienes estos datos exactos?</p>
            <p className="text-navy-500 text-sm mt-1">
              Ingresa estimaciones aproximadas. Los cálculos funcionarán igualmente y podrás ajustar después.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}