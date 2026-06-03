import React from 'react'
import { SECTORS } from '../utils/constants'
import InputField from './InputField'
import { ClipboardIcon, ArrowDownIcon } from './Icons'

export default function ClientForm({ data, onChange }) {
  return (
    <div className="glass-panel p-8 animate-fade-in relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amaq-400 to-amaq-600"></div>
      <h2 className="text-2xl font-black text-amaq-700 mb-8 flex items-center gap-3">
        <ClipboardIcon className="w-7 h-7 text-amaq-700 shrink-0" />
        <span>Información del Cliente</span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        <InputField
          label="Nombre de la Empresa"
          value={data.companyName}
          onChange={(value) => onChange('companyName', value)}
          placeholder="Ej: EPM, Celsia, Postobón"
        />
        
        <div className="mb-4">
          <label className="block text-slate-700 text-sm font-semibold mb-1 tracking-wide">
            Sector Industrial
          </label>
          <div className="relative">
            <select
              value={data.sector}
              onChange={(e) => onChange('sector', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-900 focus:border-amaq-400 focus:bg-slate-50 focus:shadow-glow outline-none transition-all duration-300 shadow-inner appearance-none cursor-pointer"
            >
              <option value="" className="bg-slate-50 text-slate-500">Seleccionar sector...</option>
              {SECTORS.map(sector => (
                <option key={sector} value={sector} className="bg-slate-50 text-slate-900">{sector}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-amaq-700">
              <ArrowDownIcon className="w-4 h-4" />
            </div>
          </div>
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
