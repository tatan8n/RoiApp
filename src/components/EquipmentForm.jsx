import React from 'react'
import { EQUIPMENT_MODELS } from '../utils/constants'
import { CubeIcon, LightbulbIcon } from './Icons'
import FormattedNumberInput from './FormattedNumberInput'

function formatMM(value) {
  if (!value) return '$0'
  const millions = value / 1_000_000
  return `$ ${millions.toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`
}

export default function EquipmentForm({ data, onChange }) {
  const selectedModel = EQUIPMENT_MODELS.find(m => m.id === data.modelId)

  return (
    <div className="glass-panel p-8 relative overflow-hidden animate-fade-in">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amaq-400 to-amaq-600"></div>
      <h2 className="text-2xl font-black text-amaq-700 mb-8 flex items-center gap-3">
        <CubeIcon className="w-7 h-7 text-amaq-700 shrink-0" />
        <span>Selección del Equipo</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {EQUIPMENT_MODELS.map(model => {
          const priceMM = model.price / 1_000_000
          return (
            <div
              key={model.id}
              onClick={() => onChange('modelId', model.id)}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                data.modelId === model.id
                  ? 'border-amaq-700 bg-amaq-50 shadow-glow transform -translate-y-1'
                  : 'border-slate-200 bg-white/50 hover:border-amaq-500 hover:bg-slate-50/80'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-slate-900 tracking-wide">{model.name}</h3>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                  data.modelId === model.id ? 'bg-amaq-700 text-white shadow-glow' : 'bg-slate-50 text-amaq-700 border border-slate-200'
                }`}>
                  {model.level}
                </span>
              </div>
              <p className="text-3xl font-black text-amaq-700">
                $ {priceMM.toFixed(1)} <span className="text-sm font-semibold text-slate-600">MM COP</span>
              </p>
              <p className="text-slate-600 text-sm mt-3 leading-relaxed font-semibold">{model.features}</p>
            </div>
          )
        })}
      </div>

      <div className="bg-white/80 rounded-2xl p-6 border border-slate-200 shadow-inner relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-amaq-600/10 rounded-full blur-[40px] pointer-events-none"></div>
        <p className="text-slate-700 font-bold mb-3 tracking-wide text-sm uppercase">Precio personalizado</p>
        <FormattedNumberInput
          value={data.customPrice}
          onChange={(val) => onChange('customPrice', val)}
          placeholder="Ingrese precio si es diferente (en millones)"
          unitLabel="MM COP"
          min="0"
          size="large"
          className="bg-slate-50"
        />
        <p className="text-slate-600 text-xs mt-3 flex items-center gap-2 font-medium">
          <LightbulbIcon className="w-4 h-4 text-amaq-600 shrink-0" />
          <span>Precio base seleccionado: <strong className="text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{selectedModel ? formatMM(selectedModel.price) : '$0'} MM COP</strong></span>
        </p>
      </div>
    </div>
  )
}
