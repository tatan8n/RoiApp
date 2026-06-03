import React from 'react'
import { InfoIcon, LightbulbIcon, DocumentTextIcon } from './Icons'
import FormattedNumberInput from './FormattedNumberInput'

export default function ContractValueForm({ currency, annualContractValue, inflationRate, onChange }) {
  const currencyLabel = currency === 'USD' ? 'USD' : 'MM COP'

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
          <div className="w-14 h-14 rounded-full bg-slate-100 border-2 border-amaq-500/20 flex items-center justify-center mr-4 shadow-glow">
            <DocumentTextIcon className="w-7 h-7 text-amaq-700" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-wide">Valor del Contrato Marco</h3>
            <p className="text-sm text-slate-600 mt-1">Ingresa el valor anual del contrato de servicio</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2 tracking-wide">
              Valor anual del contrato ({currencyLabel})
            </label>
            <FormattedNumberInput
              value={annualContractValue}
              onChange={(val) => onChange('annualContractValue', val)}
              placeholder="Ej: 120"
              unitLabel={currencyLabel}
              min="0"
              size="large"
              className="bg-slate-50"
            />
            <p className="text-xs text-slate-600 mt-3 flex items-start gap-1.5 leading-relaxed font-semibold">
              <InfoIcon className="w-4 h-4 text-amaq-700 shrink-0 mt-0.5" />
              <span>Ingresa el valor total anual del contrato de servicio. Se incrementará anualmente según la inflación.</span>
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2 tracking-wide">
              Inflación anual estimada (%)
            </label>
            <FormattedNumberInput
              value={inflationRate !== null && inflationRate !== undefined ? inflationRate * 100 : null}
              onChange={(val) => onChange('inflationRate', val === null ? null : val / 100)}
              placeholder="Ej: 4"
              unitLabel="%"
              min="0"
              size="large"
              className="bg-slate-50"
            />
            <p className="text-xs text-slate-600 mt-3 flex items-start gap-1.5 leading-relaxed font-semibold">
              <InfoIcon className="w-4 h-4 text-amaq-700 shrink-0 mt-0.5" />
              <span>Inflación anual del contrato. Típico: 3-5%. Este valor incrementará el costo del contrato cada año.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
