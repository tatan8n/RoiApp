import React from 'react'
import { OPERATIONAL_FIELDS } from '../utils/constants'
import InputField from './InputField'

export default function OperationalForm({ data, onChange }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-navy-900 mb-2">Datos Operativos de la Planta</h2>
      <p className="text-navy-400 text-sm mb-6">Ingrese los datos de operación de su planta. Los campos marcados son los de mayor impacto en el ROI.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        {OPERATIONAL_FIELDS.map(field => (
          <InputField
            key={field.id}
            label={`${field.label}`}
            value={data[field.id]}
            onChange={(value) => onChange(field.id, value)}
            type="number"
            placeholder={`Ej: ${field.placeholder}`}
            unit={field.unit}
            hint={`Peso en cálculo: ${field.weight}%`}
            step={field.id === 'costPerHourStop' || field.id === 'correctiveExternalCost' || field.id === 'manHourCost' || field.id === 'scheduledStopCost' || field.id === 'sparePartsInventoryCost' || field.id === 'monthlyBilling' ? '1000' : 'any'}
          />
        ))}
      </div>

      <div className="mt-6 p-4 bg-navy-50 rounded-lg border border-navy-200">
        <p className="text-navy-700 text-sm">
          <strong>Nota:</strong> Los campos con mayor peso tienen mayor impacto en el resultado del ROI.
          Si no conoce algún valor, puede dejarlo en blanco y el cálculo se realizará con los datos proporcionados.
        </p>
      </div>
    </div>
  )
}