import React from 'react'
import { InfoIcon, LightbulbIcon, CurrencyDollarIcon } from './Icons'
import FormattedNumberInput from './FormattedNumberInput'

export default function ServiceValueForm({ serviceType, currency, serviceValue, onChange }) {
  const isRotodynamic = serviceType === 'rotodinamico'
  const currencyLabel = currency === 'USD' ? 'USD' : 'MM COP'

  if (!isRotodynamic) {
    return (
      <div className="glass-panel p-8 relative overflow-hidden animate-fade-in">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amaq-400 to-amaq-600"></div>
        <div className="mb-6 p-5 bg-amaq-50 rounded-2xl border border-amaq-200 shadow-glow relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-amaq-500/10 rounded-full blur-[40px] pointer-events-none"></div>
          <div className="flex items-start">
            <InfoIcon className="w-8 h-8 text-amaq-700 mr-4 shrink-0" />
            <div className="relative z-10">
              <p className="text-amaq-700 font-bold text-lg mb-1 tracking-wide">Nivel de Certeza</p>
              <p className="text-slate-900 text-sm leading-relaxed">
                Entre más campos completes, mayor será la certeza del cálculo del ROI.
                Los campos vacíos usarán valores de referencia de la industria.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white/40 rounded-2xl p-6 border border-slate-200 shadow-inner">
          <p className="text-slate-700 font-medium text-center py-4">
            Ingresa el valor del servicio en el bloque anterior para calcular el ROI.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="glass-panel p-8 relative overflow-hidden animate-fade-in">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amaq-400 to-amaq-600"></div>
      
      <div className="mb-8 p-5 bg-amaq-50 rounded-2xl border border-amaq-200 shadow-glow relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-amaq-500/10 rounded-full blur-[40px] pointer-events-none"></div>
        <div className="flex items-start">
          <InfoIcon className="w-8 h-8 text-amaq-700 mr-4 shrink-0" />
          <div className="relative z-10">
            <p className="text-amaq-700 font-bold text-lg mb-1 tracking-wide">Nivel de Certeza</p>
            <p className="text-slate-900 text-sm mb-3 leading-relaxed">
              Entre más campos completes, mayor será la certeza del cálculo del ROI.
              Los campos vacíos usarán valores de referencia de la industria.
            </p>
            <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-200">
              <p className="text-slate-800 text-xs font-semibold flex items-center gap-2">
                <LightbulbIcon className="w-4 h-4 text-amaq-600 shrink-0" />
                <span>Nota: Los campos marcados como "{currencyLabel}" se ingresan en la unidad indicada.</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/40 rounded-2xl p-8 border border-slate-200 shadow-inner relative">
        <div className="flex items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-slate-100 border-2 border-amaq-500/20 flex items-center justify-center mr-4 text-amaq-700 shadow-glow">
            <CurrencyDollarIcon className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-wide">Valor del Servicio</h3>
            <p className="text-sm text-slate-600 mt-1">Ingresa el valor personalizado del servicio de análisis rotodinámico</p>
          </div>
        </div>

        <div className="max-w-md">
          <label className="block text-sm font-bold text-slate-800 mb-2 tracking-wide">
            Inversión requerida ({currencyLabel})
          </label>
          <FormattedNumberInput
            value={serviceValue}
            onChange={(val) => onChange('serviceValue', val)}
            placeholder="Ej: 500"
            unitLabel={currencyLabel}
            min="0"
            size="large"
            className="bg-slate-50"
          />
          <p className="text-xs text-slate-600 mt-3 flex items-center gap-1.5 leading-relaxed font-medium">
            <InfoIcon className="w-4 h-4 text-amaq-700 shrink-0" />
            <span>Este valor será usado como la <strong>inversión inicial</strong> para el cálculo del Retorno de Inversión (ROI).</span>
          </p>
        </div>
      </div>
    </div>
  )
}
