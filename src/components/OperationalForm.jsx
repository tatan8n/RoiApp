import React, { useState } from 'react'
import { OPERATIONAL_SECTIONS, OPERATIONAL_FIELDS } from '../utils/constants'
import CurrencyInput from './CurrencyInput'
import FormattedNumberInput from './FormattedNumberInput'
import { CogIcon, WarningIcon, ClockIcon, ArchiveBoxIcon, InfoIcon, ArrowDownIcon, LightbulbIcon, FactoryIcon } from './Icons'

export default function OperationalForm({ data, onChange }) {
  const [expandedSection, setExpandedSection] = useState('equipment')
  const [focusedFieldId, setFocusedFieldId] = useState(null)

  const getFieldValue = (fieldId) => data[fieldId]

  const hasValue = (fieldId) => {
    const val = getFieldValue(fieldId)
    return val !== null && val !== undefined && val !== ''
  }

  const getSectionProgress = (section) => {
    const filled = section.fields.filter(hasValue).length
    return { filled, total: section.fields.length, percent: Math.round((filled / section.fields.length) * 100) }
  }

  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId)
  }

  const renderField = (fieldId) => {
    const field = OPERATIONAL_FIELDS.find(f => f.id === fieldId)
    if (!field) return null

    if (field.isCurrency) {
      return (
        <CurrencyInput
          key={field.id}
          field={field}
          value={getFieldValue(field.id)}
          onChange={onChange}
        />
      )
    }

    return (
      <div key={field.id} className="mb-5">
        <label className="block text-slate-800 font-semibold mb-2 text-sm">
          {field.label}
          <span className="text-slate-500 font-normal ml-2">({field.unit})</span>
        </label>
        <FormattedNumberInput
          value={getFieldValue(field.id)}
          onChange={(val) => onChange(field.id, val)}
          placeholder={field.placeholder}
          unitLabel={field.unit}
          min="0"
          onFocus={() => setFocusedFieldId(field.id)}
          onBlur={() => setFocusedFieldId(null)}
        />
        {focusedFieldId === field.id && (
          <p className="text-xs text-slate-500 mt-1">Usa punto (.) como separador decimal</p>
        )}
        {field.benchmarkHint && focusedFieldId !== field.id && (
          <p className="text-xs text-blue-600 mt-1 italic font-medium">{field.benchmarkHint}</p>
        )}
      </div>
    )
  }

  const renderSectionIcon = (id) => {
    switch (id) {
      case 'equipment':
        return <FactoryIcon className="w-8 h-8 text-amaq-700 shrink-0" />
      case 'unplannedStops':
        return <WarningIcon className="w-8 h-8 text-red-600 shrink-0" />
      case 'corrective':
        return <CogIcon className="w-8 h-8 text-amaq-700 shrink-0" />
      case 'reactive':
        return <ClockIcon className="w-8 h-8 text-amaq-700 shrink-0" />
      case 'inventoryScheduled':
        return <ArchiveBoxIcon className="w-8 h-8 text-amaq-700 shrink-0" />
      default:
        return <InfoIcon className="w-8 h-8 text-amaq-700 shrink-0" />
    }
  }

  const renderSection = (section) => {
    const isExpanded = expandedSection === section.id
    const progress = getSectionProgress(section)
    const progressColor = progress.percent === 100 ? 'bg-green-600' : progress.percent > 0 ? 'bg-amaq-700' : 'bg-slate-200'

    return (
      <div key={section.id} className="mb-4">
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
                  <span className="text-xs font-bold text-slate-700 w-8 text-right">{progress.percent}%</span>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 items-end">
              {section.fields.map(renderField)}
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
          Completa la información de tu operación. Si no conoces algún valor, puedes dejarlo en blanco — el ROI se calculará con los datos de referencia.
        </p>
      </div>

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
                <span>Nota: Los campos marcados como "MM COP" se ingresan en millones de pesos. Ejemplo: si el valor es 400 millones, escriba 400.</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {OPERATIONAL_SECTIONS.map(renderSection)}
      </div>
    </div>
  )
}