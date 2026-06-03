import React from 'react'
import { SERVICE_TYPES, EQUIPMENT_MODELS, CURRENCIES } from '../utils/constants'
import { InfoIcon, FolderIcon, ChevronDownIcon, ChevronUpIcon } from './Icons'
import logoDark from '../assets/logo-amaq.png'
import SavedAnalysesList from './SavedAnalysesList'

export default function InitialSelector({
  calculationType,
  serviceType,
  currency,
  onCalculationTypeChange,
  onServiceTypeChange,
  onCurrencyChange,
  onContinue,
  analyses = [],
  showAnalysesList = false,
  onToggleAnalysesList,
  onOpenAnalysis,
  onDeleteAnalysis,
  onClearAllAnalyses
}) {
  const selectedService = SERVICE_TYPES.find(s => s.id === serviceType)
  const isRotodynamic = serviceType === 'rotodinamico'
  const hasAnalyses = analyses.length > 0

  return (
    <div className="min-h-screen bg-slate-50 bg-premium-gradient flex flex-col items-center justify-start px-4 py-12 gap-4">
      <div className="glass-panel p-8 max-w-2xl w-full relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-amaq-700/30 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-64 h-64 bg-amaq-500/20 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="text-center mb-8 relative z-10">
          <img
            src={logoDark}
            alt="A-MAQ Logo"
            className="h-24 w-auto mx-auto mb-6"
            onError={(e) => {
              if (e.target.src !== logoDark) {
                e.target.src = logoDark;
              } else {
                e.target.style.display = 'none';
              }
            }}
          />
          <h1 className="text-4xl font-black text-amaq-700 tracking-tight mb-2">
            Calculadora ROI Inteligente
          </h1>
          <p className="text-slate-600 font-semibold">Seleccione el escenario a simular</p>
        </div>

        <div className="mb-8 relative z-10">
          <div className="space-y-4">
            <label
              className={`block p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                calculationType === 'product'
                  ? 'border-amaq-700 bg-amaq-50 shadow-glow'
                  : 'border-slate-200 bg-slate-50/50 hover:border-amaq-500 hover:bg-slate-50/80'
              }`}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  name="calculationType"
                  value="product"
                  checked={calculationType === 'product'}
                  onChange={() => onCalculationTypeChange('product')}
                  className="w-5 h-5 text-amaq-700 bg-slate-50 border-slate-200 focus:ring-amaq-500"
                />
                <div className="ml-4">
                  <span className="font-bold text-lg text-slate-900 tracking-wide">Producto / Equipo</span>
                  <p className="text-sm text-slate-600 font-medium mt-1">
                    Calcula el retorno de inversión para la adquisición de equipos de monitoreo
                  </p>
                </div>
              </div>

              {calculationType === 'product' && (
                <div className="mt-5 ml-9 grid grid-cols-1 md:grid-cols-3 gap-3 animate-fade-in">
                  {EQUIPMENT_MODELS.map(model => (
                    <div
                      key={model.id}
                      className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
                    >
                      <p className="font-bold text-slate-950">{model.name}</p>
                      <p className="text-xs text-amaq-700 font-medium">{model.level}</p>
                    </div>
                  ))}
                </div>
              )}
            </label>

            <label
              className={`block p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                calculationType === 'service'
                  ? 'border-amaq-700 bg-amaq-50 shadow-glow'
                  : 'border-slate-200 bg-slate-50/50 hover:border-amaq-500 hover:bg-slate-50/80'
              }`}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  name="calculationType"
                  value="service"
                  checked={calculationType === 'service'}
                  onChange={() => onCalculationTypeChange('service')}
                  className="w-5 h-5 text-amaq-700 bg-slate-50 border-slate-200 focus:ring-amaq-500"
                />
                <div className="ml-4">
                  <span className="font-bold text-lg text-slate-900 tracking-wide">Servicio Predictivo</span>
                  <p className="text-sm text-slate-600 font-medium mt-1">
                    Calcula el retorno de inversión de servicios de diagnóstico y confiabilidad
                  </p>
                </div>
              </div>

              {calculationType === 'service' && (
                <div className="mt-5 ml-9 space-y-3 animate-fade-in">
                  {SERVICE_TYPES.map(service => (
                    <label
                      key={service.id}
                      className={`block p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                        serviceType === service.id
                          ? 'border-amaq-700 bg-amaq-100/50'
                          : 'border-slate-200 bg-slate-50/40 hover:border-amaq-500'
                      }`}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="serviceType"
                          value={service.id}
                          checked={serviceType === service.id}
                          onChange={() => onServiceTypeChange(service.id)}
                          className="w-4 h-4 text-amaq-700 bg-slate-50 border-slate-200 focus:ring-amaq-500"
                        />
                        <div className="ml-3">
                          <span className="font-semibold text-slate-900">{service.name}</span>
                          <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">{service.description}</p>
                        </div>
                      </div>
                    </label>
                  ))}

                  {isRotodynamic && (
                    <div className="mt-5 p-5 bg-white/80 rounded-xl border border-slate-200 shadow-inner">
                      <p className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">Moneda de trabajo</p>
                      <div className="flex flex-col sm:flex-row gap-4">
                        {CURRENCIES.map(curr => (
                          <label
                            key={curr.id}
                            className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all duration-300 flex-1 ${
                              currency === curr.id
                                ? 'border-amaq-700 bg-amaq-50 shadow-glow'
                                : 'border-slate-200 bg-slate-50/50 hover:border-amaq-500'
                            }`}
                          >
                            <input
                              type="radio"
                              name="currency"
                              value={curr.id}
                              checked={currency === curr.id}
                              onChange={() => onCurrencyChange(curr.id)}
                              className="w-4 h-4 text-amaq-700 bg-slate-50 border-slate-200 focus:ring-amaq-500"
                            />
                            <div className="ml-3">
                              <span className="font-semibold text-slate-900">{curr.name}</span>
                              <span className="text-xs text-amaq-700 ml-2 block sm:inline">({curr.description})</span>
                            </div>
                          </label>
                        ))}
                      </div>
                      <p className="text-xs text-slate-600 mt-3 flex items-center gap-1.5 font-medium">
                        <InfoIcon className="w-4 h-4 text-amaq-700 shrink-0" />
                        <span>Todos los cálculos y proyecciones se ajustarán automáticamente a la moneda seleccionada.</span>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </label>
          </div>
        </div>

        <button
          onClick={onContinue}
          disabled={calculationType === 'service' && !serviceType}
          className={`w-full py-4 rounded-xl font-bold text-lg tracking-wide uppercase transition-all duration-300 relative z-10 ${
            calculationType === 'service' && !serviceType
              ? 'bg-slate-200 text-slate-500 cursor-not-allowed opacity-50'
              : 'bg-gradient-to-r from-amaq-700 to-amaq-500 text-white hover:from-amaq-600 hover:to-amaq-400 shadow-glow hover:shadow-glow-lg transform hover:-translate-y-1'
          }`}
        >
          Comenzar Simulación
        </button>

        {hasAnalyses && (
          <div className="mt-5 pt-5 border-t border-slate-200 relative z-10">
            <button
              onClick={onToggleAnalysesList}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/60 hover:bg-white border-2 border-slate-200 hover:border-amaq-400 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amaq-50 border border-amaq-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FolderIcon className="w-5 h-5 text-amaq-700" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-900 text-sm">Abrir análisis guardado</p>
                  <p className="text-xs text-slate-500 font-medium">
                    {analyses.length} análisis disponible{analyses.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              {showAnalysesList
                ? <ChevronUpIcon className="w-5 h-5 text-amaq-700" />
                : <ChevronDownIcon className="w-5 h-5 text-amaq-700" />
              }
            </button>
          </div>
        )}
      </div>

      {showAnalysesList && hasAnalyses && (
        <SavedAnalysesList
          analyses={analyses}
          onOpen={onOpenAnalysis}
          onDelete={onDeleteAnalysis}
          onClearAll={onClearAllAnalyses}
          onClose={() => onToggleAnalysesList && onToggleAnalysesList()}
        />
      )}
    </div>
  )
}
