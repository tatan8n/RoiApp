import React from 'react'
import { EQUIPMENT_MODELS } from '../utils/constants'
import InputField from './InputField'

export default function EquipmentForm({ data, onChange }) {
  const selectedModel = EQUIPMENT_MODELS.find(m => m.id === data.modelId)

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-navy-900 mb-6">Selección del Equipo</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {EQUIPMENT_MODELS.map(model => (
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
              ${model.price.toLocaleString('es-CO')}
            </p>
            <p className="text-navy-400 text-sm mt-2">{model.features}</p>
          </div>
        ))}
      </div>

      <div className="bg-navy-50 rounded-xl p-4 border border-navy-200">
        <p className="text-navy-700 font-medium mb-3">¿Precio personalizado?</p>
        <InputField
          label="Precio personalizado (COP)"
          value={data.customPrice}
          onChange={(value) => onChange('customPrice', value)}
          type="number"
          placeholder="Ingrese precio si es diferente a los anteriores"
          unit="COP"
        />
        <p className="text-navy-400 text-xs mt-1">
          Precio seleccionado: <strong>${selectedModel?.price.toLocaleString('es-CO') || 0}</strong>
        </p>
      </div>
    </div>
  )
}