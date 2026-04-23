import React from 'react'
import { EQUIPMENT_MODELS } from '../utils/constants'

function formatMM(value) {
  if (!value) return '$0'
  const millions = value / 1_000_000
  return `$ ${millions.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`
}

export default function EquipmentForm({ data, onChange }) {
  const selectedModel = EQUIPMENT_MODELS.find(m => m.id === data.modelId)

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-navy-900 mb-6">Selección del Equipo</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {EQUIPMENT_MODELS.map(model => {
          const priceMM = model.price / 1_000_000
          return (
            <div
              key={model.id}
              onClick={() => onChange('modelId', model.id)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                data.modelId === model.id
                  ? 'border-navy-600 bg-navy-50'
                  : 'border-navy-200 hover:border-navy-400'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-navy-900">{model.name}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  data.modelId === model.id ? 'bg-navy-600 text-white' : 'bg-navy-100 text-navy-600'
                }`}>
                  {model.level}
                </span>
              </div>
              <p className="text-2xl font-bold text-navy-700">
                $ {priceMM.toFixed(1)} <span className="text-sm font-normal text-navy-400">MM COP</span>
              </p>
              <p className="text-navy-400 text-sm mt-2">{model.features}</p>
            </div>
          )
        })}
      </div>

      <div className="bg-navy-50 rounded-xl p-4 border border-navy-200">
        <p className="text-navy-700 font-medium mb-3">Precio personalizado (en millones de pesos)</p>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-500 font-semibold">$</span>
          <input
            type="number"
            value={data.customPrice ?? ''}
            onChange={(e) => {
              const val = e.target.value === '' ? null : parseFloat(e.target.value)
              onChange('customPrice', val)
            }}
            placeholder="Ingrese precio si es diferente (en millones)"
            step="any"
            className="w-full pl-8 pr-20 py-3 rounded-xl border-2 border-navy-200 focus:border-navy-500 focus:ring-2 focus:ring-navy-200 outline-none transition-all text-navy-900 text-base bg-white"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-navy-400 text-sm bg-navy-50 px-2 py-1 rounded">
            MM COP
          </span>
        </div>
        <p className="text-navy-400 text-xs mt-2">
          Precio seleccionado: <strong>{selectedModel ? formatMM(selectedModel.price) : '$0'} MM COP</strong>
        </p>
      </div>
    </div>
  )
}