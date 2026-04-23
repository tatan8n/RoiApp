import React from 'react'
import { SECTORS } from '../utils/constants'
import InputField from './InputField'

export default function ClientForm({ data, onChange }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-navy-900 mb-6">Información del Cliente</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        <InputField
          label="Nombre de la Empresa"
          value={data.companyName}
          onChange={(value) => onChange('companyName', value)}
          placeholder="Ej: EPM, Celsia, Postobón"
        />
        
        <div className="mb-4">
          <label className="block text-navy-700 text-sm font-medium mb-1">
            Sector Industrial
          </label>
          <select
            value={data.sector}
            onChange={(e) => onChange('sector', e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-navy-200 bg-white focus:border-navy-500 focus:ring-2 focus:ring-navy-200 outline-none transition-all text-navy-900"
          >
            <option value="">Seleccionar sector...</option>
            {SECTORS.map(sector => (
              <option key={sector} value={sector}>{sector}</option>
            ))}
          </select>
        </div>

        <InputField
          label="Nombre del Contacto"
          value={data.contactName}
          onChange={(value) => onChange('contactName', value)}
          placeholder="Persona encargada de mantenimiento"
        />

        <InputField
          label="Cargo"
          value={data.position}
          onChange={(value) => onChange('position', value)}
          placeholder="Ej: Jefe de Mantenimiento"
        />

        <InputField
          label="Teléfono / Email"
          value={data.phoneEmail}
          onChange={(value) => onChange('phoneEmail', value)}
          placeholder="Datos de contacto"
        />

        <InputField
          label="Fecha de Evaluación"
          value={data.evaluationDate}
          onChange={(value) => onChange('evaluationDate', value)}
          type="date"
        />
      </div>
    </div>
  )
}