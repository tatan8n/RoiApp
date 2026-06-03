import React, { useState } from 'react'
import { ROTODYNAMIC_SECTIONS, ROTODYNAMIC_FIELDS, TURBINE_TYPES } from '../utils/constants'
import FormattedNumberInput from './FormattedNumberInput'
import { BanknotesIcon, WarningIcon, InfoIcon, ArrowDownIcon, LightbulbIcon, FactoryIcon, ChartIcon } from './Icons'

export default function RotodynamicForm({ data, onChange, currency }) {
  const [expandedSection, setExpandedSection] = useState('inventory')
  const [focusedFieldId, setFocusedFieldId] = useState(null)
  const currencyLabel = currency === 'USD' ? 'USD' : 'MM COP'

  const selectedTurbineType = TURBINE_TYPES.find(t => t.id === data.turbineType)

  const hasValue = (fieldId) => {
    const val = data[fieldId]
    return val !== null && val !== undefined && val !== ''
  }

  const getSectionProgress = (section) => {
    const filled = section.fields.filter(hasValue).length
    return { filled, total: section.fields.length, percent: Math.round((filled / section.fields.length) * 100) }
  }

  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId)
  }

  const getFieldUnit = (fieldId) => {
    const field = ROTODYNAMIC_FIELDS.find(f => f.id === fieldId)
    if (!field) return ''
    if (field.isCurrency) {
      if (fieldId === 'internalLaborCost') return currency === 'USD' ? 'USD/h' : 'COP/h'
      if (fieldId === 'fuelCost') return currency === 'USD' ? 'USD/kWh' : 'COP/kWh'
      if (fieldId === 'billingAffected') return `${currencyLabel}/año`
      if (fieldId === 'costPerHourStop') return `${currencyLabel}/h`
      if (fieldId === 'externalInterventionCost') return currencyLabel
      return currencyLabel
    }
    return field.unit
  }

  const getBenchmarkHint = (fieldId) => {
    const field = ROTODYNAMIC_FIELDS.find(f => f.id === fieldId)
    if (!field || !field.benchmarkHint) return null

    if (!selectedTurbineType || !selectedTurbineType.benchmarks[fieldId]) {
      return field.benchmarkHint
    }

    const turbineBenchmark = selectedTurbineType.benchmarks[fieldId]

    if (fieldId === 'nominalCapacity' && turbineBenchmark) {
      return `Benchmark para ${selectedTurbineType.name}: ${turbineBenchmark.min}-${turbineBenchmark.max} ${turbineBenchmark.unit}`
    }
    if (fieldId === 'avgStopDuration' && turbineBenchmark) {
      return `Benchmark para ${selectedTurbineType.name}: ${turbineBenchmark.min}-${turbineBenchmark.max} ${turbineBenchmark.unit}. Predictivo reduce 35-45%`
    }
    if (fieldId === 'mttr' && turbineBenchmark) {
      return `Benchmark para ${selectedTurbineType.name}: ${turbineBenchmark.min}-${turbineBenchmark.max} ${turbineBenchmark.unit}. Predictivo reduce 40%`
    }
    if (fieldId === 'criticalFailures' && turbineBenchmark) {
      return `Benchmark para ${selectedTurbineType.name}: ${turbineBenchmark.min}-${turbineBenchmark.max} ${turbineBenchmark.unit}. Predictivo baja a 0.2-1.0`
    }
    if (fieldId === 'costPerHourStop' && turbineBenchmark) {
      return `VENS estimado ${selectedTurbineType.name}: ~$${turbineBenchmark.vens} USD/MWh`
    }

    return field.benchmarkHint
  }

  const getStep = (fieldId) => {
    const field = ROTODYNAMIC_FIELDS.find(f => f.id === fieldId)
    if (!field) return 'any'
    if (field.step) return field.step
    if (field.isCurrency) return '0.01'
    if (fieldId === 'nominalCapacity') return '0.1'
    if (fieldId === 'yearsOfOperation') return '0.5'
    if (fieldId === 'avgStopDuration' || fieldId === 'mttr') return '0.5'
    if (fieldId === 'heatRateDesign' || fieldId === 'heatRateActual') return '1'
    return '1'
  }

  const renderSectionIcon = (id) => {
    switch (id) {
      case 'inventory':
        return <FactoryIcon className="w-8 h-8 text-amaq-700 shrink-0" />
      case 'failureParams':
        return <WarningIcon className="w-8 h-8 text-red-600 shrink-0" />
      case 'maintenanceCosts':
        return <BanknotesIcon className="w-8 h-8 text-amaq-700 shrink-0" />
      case 'efficiency':
        return <ChartIcon className="w-8 h-8 text-amaq-700 shrink-0" />
      default:
        return <InfoIcon className="w-8 h-8 text-amaq-700 shrink-0" />
    }
  }

  const renderSection = (section) => {
    const isExpanded = expandedSection === section.id
    const progress = getSectionProgress(section)
    const progressColor = progress.percent === 100 ? 'bg-amaq-400' : progress.percent > 0 ? 'bg-amaq-600' : 'bg-slate-200'

    return (
      <div key={section.id} className="mb-4 animate-fade-in">
        <div
          onClick={() => toggleSection(section.id)}
          className={`glass-panel cursor-pointer overflow-hidden transition-all duration-300 ${isExpanded ? 'border-amaq-500 shadow-glow' : 'hover:border-amaq-400 hover:bg-slate-50'}`}
        >
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-inner">
                {renderSectionIcon(section.id)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-wide">{section.title}</h3>
                <p className="text-slate-500 text-sm mt-0.5">{section.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-5">
              <div className="text-right hidden sm:block">
                <span className="text-sm text-slate-500 font-semibold">{progress.filled}/{progress.total} contestadas</span>
                <div className="flex items-center space-x-2 mt-1.5 justify-end">
                  <div className="w-24 h-1.5 bg-slate-100 border border-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${progressColor} rounded-full transition-all duration-500 ease-out`}
                      style={{ width: `${progress.percent}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-amaq-700 w-8 text-right">{progress.percent}%</span>
                </div>
              </div>
              <span className={`text-xl text-amaq-700 transition-transform duration-300 bg-slate-50 w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 ${isExpanded ? 'rotate-180 bg-slate-100' : ''}`}>
                <ArrowDownIcon className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>

        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isExpanded ? 'max-h-[2000px] opacity-100 mt-3 mb-6' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-white/40 rounded-2xl p-6 md:p-8 border border-slate-200 shadow-inner">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 items-end gap-y-6">
              {section.fields.map(fieldId => {
                const field = ROTODYNAMIC_FIELDS.find(f => f.id === fieldId)
                if (!field) return null

                const isTypeTechnology = fieldId === 'technology'
                const isIntegerField = fieldId === 'numTurbines'

                return (
                  <div key={fieldId} className={isTypeTechnology ? "md:col-span-2" : ""}>
                    <label className="block text-slate-800 font-semibold mb-2 text-sm tracking-wide">
                      {field.label}
                      {fieldId !== 'technology' && <span className="text-slate-600 font-medium ml-2">({getFieldUnit(fieldId)})</span>}
                    </label>
                    {isTypeTechnology ? (
                      <input
                        type="text"
                        value={data[fieldId] ?? ''}
                        onChange={(e) => onChange(fieldId, e.target.value)}
                        onFocus={() => setFocusedFieldId(fieldId)}
                        onBlur={() => setFocusedFieldId(null)}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-900 focus:border-amaq-400 focus:bg-slate-50 focus:shadow-glow outline-none transition-all duration-300 shadow-inner placeholder-slate-500"
                      />
                    ) : (
                      <FormattedNumberInput
                        value={data[fieldId]}
                        onChange={(val) => onChange(fieldId, val)}
                        placeholder={field.placeholder}
                        unitLabel={getFieldUnit(fieldId)}
                        min="0"
                        allowDecimals={!isIntegerField}
                        onFocus={() => setFocusedFieldId(fieldId)}
                        onBlur={() => setFocusedFieldId(null)}
                      />
                    )}
                    {focusedFieldId === fieldId && !isTypeTechnology && (
                      <p className="text-xs text-slate-500 mt-1.5 ml-1">Usa punto (.) como separador decimal</p>
                    )}
                    {field.benchmarkHint && focusedFieldId !== fieldId && (
                      <p className="text-xs text-slate-600 mt-1.5 ml-1 italic font-medium">{getBenchmarkHint(fieldId)}</p>
                    )}
                    {fieldId === 'heatRateActual' && data.heatRateDesign && data.heatRateActual < data.heatRateDesign && (
                      <p className="text-xs text-red-600 mt-1.5 ml-1 flex items-center gap-1 font-semibold">
                        <WarningIcon className="w-3.5 h-3.5 text-red-600 shrink-0" />
                        <span>Heat rate actual menor que diseño</span>
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="glass-panel p-8 relative overflow-hidden animate-fade-in">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amaq-400 to-amaq-600"></div>      
      <div className="mb-8">
        <h2 className="text-2xl font-black text-amaq-700 mb-3 flex items-center gap-3">
          <FactoryIcon className="w-7 h-7 text-amaq-700 shrink-0" />
          <span>Datos Operativos de la Planta</span>
        </h2>
        <p className="text-slate-600 font-medium">
          Complete la información de su operación. Si desconoce algún valor, déjelo en blanco; el simulador aplicará los valores típicos de la industria.
        </p>
      </div>

      <div className="mb-8 p-5 bg-amaq-50 rounded-2xl border border-amaq-200 shadow-glow relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-amaq-500/10 rounded-full blur-[40px] pointer-events-none"></div>
        <div className="flex items-start">
          <InfoIcon className="w-8 h-8 text-amaq-700 mr-4 shrink-0" />
          <div className="relative z-10">
            <p className="text-amaq-700 font-bold text-lg mb-1 tracking-wide">Nivel de Certeza</p>
            <p className="text-slate-900 text-sm mb-3 leading-relaxed">
              Entre más campos completes, mayor será la certeza del cálculo del ROI. Los campos vacíos usarán valores de referencia de la industria.
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

      <div className="glass-panel border-amaq-700/50 p-6 mb-8 relative overflow-hidden shadow-glow">
        <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-amaq-500/10 rounded-full blur-[30px] pointer-events-none"></div>
        <label className="block font-bold text-slate-800 mb-2 tracking-wide text-base">
          Tipo de turbina (opcional)
        </label>
        <p className="text-sm text-slate-600 mb-4 font-medium">
          Seleccione el tipo de turbina para ver benchmarks específicos. Si no lo conoce, puede dejarlo vacío.
        </p>
        <div className="flex flex-wrap gap-4">
          {TURBINE_TYPES.map(turbine => (
            <label
              key={turbine.id}
              className={`flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 flex-1 min-w-[120px] ${
                data.turbineType === turbine.id
                  ? 'border-amaq-700 bg-amaq-50 shadow-glow transform -translate-y-0.5'
                  : 'border-slate-200 bg-slate-50/50 hover:border-amaq-500 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="turbineType"
                value={turbine.id}
                checked={data.turbineType === turbine.id}
                onChange={() => onChange('turbineType', turbine.id)}
                className="w-4 h-4 text-amaq-700 bg-slate-50 border-slate-200 focus:ring-amaq-500"
              />
              <div className="ml-3">
                <span className="font-semibold text-slate-900">{turbine.name}</span>
              </div>
            </label>
          ))}
          {data.turbineType && (
            <button
              onClick={() => onChange('turbineType', null)}
              className="text-xs font-bold text-amaq-700 hover:text-amaq-900 underline self-center ml-2 transition-colors"
            >
              Limpiar selección
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {ROTODYNAMIC_SECTIONS.map(renderSection)}
      </div>
    </div>
  )
}
