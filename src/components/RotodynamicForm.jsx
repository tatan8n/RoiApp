import React, { useState } from 'react'
import { ROTODYNAMIC_SECTIONS, ROTODYNAMIC_FIELDS, TURBINE_TYPES } from '../utils/constants'

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
      if (fieldId === 'internalLaborCost') {
        return `${currencyLabel}/h`
      }
      if (fieldId === 'fuelCost') {
        return `${currencyLabel}/kWh`
      }
      if (fieldId === 'billingAffected') {
        return `${currencyLabel}/año`
      }
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
      return `Gas: 100-600 MW; Vapor: 200-1000 MW; Hydro: 50-700 MW (Benchmark para ${selectedTurbineType.name}: ${turbineBenchmark.min}-${turbineBenchmark.max} ${turbineBenchmark.unit})`
    }
    if (fieldId === 'avgStopDuration' && turbineBenchmark) {
      return `Benchmark para ${selectedTurbineType.name}: ${turbineBenchmark.min}-${turbineBenchmark.max} ${turbineBenchmark.unit}. Con predictivo reduce 35-45%. Fuente: EPRI`
    }
    if (fieldId === 'mttr' && turbineBenchmark) {
      return `Benchmark para ${selectedTurbineType.name}: ${turbineBenchmark.min}-${turbineBenchmark.max} ${turbineBenchmark.unit}. Diagnóstico predictivo reduce MTTR 40%. Fuente: IEEE`
    }
    if (fieldId === 'criticalFailures' && turbineBenchmark) {
      return `Benchmark para ${selectedTurbineType.name}: ${turbineBenchmark.min}-${turbineBenchmark.max} ${turbineBenchmark.unit}. Con predictivo: 0.2-1.0`
    }
    if (fieldId === 'costPerHourStop' && turbineBenchmark) {
      return `VENS estimado para ${selectedTurbineType.name}: ~$${turbineBenchmark.vens} USD/MWh. Fuente: EPRI, XM`
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

  const isIntegerField = (fieldId) => {
    return fieldId === 'numTurbines' || fieldId === 'technology'
  }

  const renderSection = (section) => {
    const isExpanded = expandedSection === section.id
    const progress = getSectionProgress(section)
    const progressColor = progress.percent === 100 ? 'bg-green-500' : progress.percent > 0 ? 'bg-navy-400' : 'bg-navy-200'

    return (
      <div key={section.id} className="mb-4">
        <div
          onClick={() => toggleSection(section.id)}
          className="bg-white rounded-xl shadow-md cursor-pointer overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between p-4 border-b border-navy-100">
            <div className="flex items-center space-x-4">
              <span className="text-3xl">{section.icon}</span>
              <div>
                <h3 className="text-lg font-bold text-navy-900">{section.title}</h3>
                <p className="text-navy-500 text-sm">{section.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <span className="text-sm text-navy-500">{progress.filled}/{progress.total} preguntas</span>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-20 h-2 bg-navy-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${progressColor} rounded-full transition-all duration-300`}
                      style={{ width: `${progress.percent}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-navy-600">{progress.percent}%</span>
                </div>
              </div>
              <span className={`text-2xl text-navy-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </div>
          </div>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isExpanded ? 'max-h-[2000px] opacity-100 mt-2' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-navy-50 rounded-xl p-6 border border-navy-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {section.fields.map(fieldId => {
            const field = ROTODYNAMIC_FIELDS.find(f => f.id === fieldId)
            if (!field) return null

            if (fieldId === 'technology') {
              return (
                <div key={fieldId} className="md:col-span-2">
                  <label className="block text-sm font-medium text-navy-700 mb-1">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    value={data[fieldId] ?? ''}
                    onChange={(e) => onChange(fieldId, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-2 border border-navy-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500 text-navy-800"
                  />
                  {field.benchmarkHint && (
                    <p className="text-xs text-navy-400 mt-1">{getBenchmarkHint(fieldId)}</p>
                  )}
                </div>
              )
            }

            if (fieldId === 'numTurbines') {
              return (
                <div key={fieldId}>
                  <label className="block text-sm font-medium text-navy-700 mb-1">
                    {field.label}
                    <span className="text-navy-400 ml-1">({field.unit})</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={data[fieldId] ?? ''}
                    onChange={(e) => onChange(fieldId, e.target.value === '' ? null : parseInt(e.target.value, 10))}
                    onFocus={() => setFocusedFieldId(fieldId)}
                    onBlur={() => setFocusedFieldId(null)}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-2 border border-navy-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500 text-navy-800"
                  />
                  {focusedFieldId === fieldId && (
                    <p className="text-xs text-navy-400 mt-1">Usa punto (.) como separador decimal</p>
                  )}
                  {field.benchmarkHint && focusedFieldId !== fieldId && (
                    <p className="text-xs text-navy-400 mt-1">{getBenchmarkHint(fieldId)}</p>
                  )}
                </div>
              )
            }

            if (fieldId === 'nominalCapacity') {
              return (
                <div key={fieldId}>
                  <label className="block text-sm font-medium text-navy-700 mb-1">
                    {field.label}
                    <span className="text-navy-400 ml-1">({field.unit})</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={data[fieldId] ?? ''}
                    onChange={(e) => onChange(fieldId, e.target.value === '' ? null : parseFloat(e.target.value))}
                    onFocus={() => setFocusedFieldId(fieldId)}
                    onBlur={() => setFocusedFieldId(null)}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-2 border border-navy-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500 text-navy-800"
                  />
                  {focusedFieldId === fieldId && (
                    <p className="text-xs text-navy-400 mt-1">Usa punto (.) como separador decimal</p>
                  )}
                  {field.benchmarkHint && focusedFieldId !== fieldId && (
                    <p className="text-xs text-navy-400 mt-1">{getBenchmarkHint(fieldId)}</p>
                  )}
                </div>
              )
            }

            if (fieldId === 'heatRateDesign' || fieldId === 'heatRateActual') {
              return (
                <div key={fieldId}>
                  <label className="block text-sm font-medium text-navy-700 mb-1">
                    {field.label}
                    <span className="text-navy-400 ml-1">({field.unit})</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={data[fieldId] ?? ''}
                    onChange={(e) => onChange(fieldId, e.target.value === '' ? null : parseFloat(e.target.value))}
                    onFocus={() => setFocusedFieldId(fieldId)}
                    onBlur={() => setFocusedFieldId(null)}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-2 border border-navy-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500 text-navy-800"
                  />
                  {focusedFieldId === fieldId && (
                    <p className="text-xs text-navy-400 mt-1">Usa punto (.) como separador decimal</p>
                  )}
                  {field.benchmarkHint && focusedFieldId !== fieldId && (
                    <p className="text-xs text-navy-400 mt-1">{getBenchmarkHint(fieldId)}</p>
                  )}
                  {fieldId === 'heatRateActual' && data.heatRateDesign && data.heatRateActual < data.heatRateDesign && (
                    <p className="text-xs text-amber-600 mt-1">⚠️ El heat rate actual es menor que el de diseño (esto puede indicar buena condición)</p>
                  )}
                </div>
              )
            }

            return (
              <div key={fieldId}>
                <label className="block text-sm font-medium text-navy-700 mb-1">
                  {field.label}
                  <span className="text-navy-400 ml-1">({getFieldUnit(fieldId)})</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step={getStep(fieldId)}
                  value={data[fieldId] ?? ''}
                  onChange={(e) => {
                    const val = e.target.value
                    if (val === '') {
                      onChange(fieldId, null)
                    } else {
                      onChange(fieldId, parseFloat(val))
                    }
                  }}
                  onFocus={() => setFocusedFieldId(fieldId)}
                  onBlur={() => setFocusedFieldId(null)}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-2 border border-navy-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500 text-navy-800"
                />
                {focusedFieldId === fieldId && (
                  <p className="text-xs text-navy-400 mt-1">Usa punto (.) como separador decimal</p>
                )}
                {field.benchmarkHint && focusedFieldId !== fieldId && (
                  <p className="text-xs text-navy-400 mt-1">{getBenchmarkHint(fieldId)}</p>
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
    <div className="space-y-6">
      <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
        <div className="flex items-start">
          <span className="text-2xl mr-3">&#128161;</span>
          <div>
            <p className="text-green-800 font-medium">Nivel de Certeza</p>
            <p className="text-green-600 text-sm mt-1">
              Entre más campos completes, mayor será la certeza del cálculo del ROI.
              Los campos vacíos usarán valores de referencia de la industria.
            </p>
            <p className="text-green-600 text-sm mt-2">
              <strong>Nota:</strong> Los campos marcados como "{currencyLabel}" se ingresan en la unidad indicada.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <label className="block text-sm font-medium text-navy-700 mb-3">
          Tipo de turbina (opcional)
        </label>
        <p className="text-xs text-navy-500 mb-3">
          Selecciona el tipo de turbina para ver benchmarks específicos en cada campo. Si no conoces el tipo, puedes dejarlo vacío y usar los benchmarks generales.
        </p>
        <div className="flex flex-wrap gap-3">
          {TURBINE_TYPES.map(turbine => (
            <label
              key={turbine.id}
              className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                data.turbineType === turbine.id
                  ? 'border-navy-600 bg-navy-50'
                  : 'border-navy-200 hover:border-navy-400'
              }`}
            >
              <input
                type="radio"
                name="turbineType"
                value={turbine.id}
                checked={data.turbineType === turbine.id}
                onChange={() => onChange('turbineType', turbine.id)}
                className="w-4 h-4 text-navy-600"
              />
              <div className="ml-2">
                <span className="font-medium text-navy-800">{turbine.name}</span>
              </div>
            </label>
          ))}
          {data.turbineType && (
            <button
              onClick={() => onChange('turbineType', null)}
              className="text-xs text-navy-500 hover:text-navy-700 underline self-center"
            >
              Limpiar selección
            </button>
          )}
        </div>
      </div>

      {ROTODYNAMIC_SECTIONS.map(renderSection)}
    </div>
  )
}