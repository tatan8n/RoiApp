import React, { useState } from 'react'
import { OPERATIONAL_SECTIONS, OPERATIONAL_FIELDS } from '../utils/constants'
import CurrencyInput from './CurrencyInput'

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

  const isCurrencyField = (fieldId) => {
    const field = OPERATIONAL_FIELDS.find(f => f.id === fieldId)
    return field && (field.isCurrency || false)
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
        <label className="block text-navy-800 font-medium mb-2 text-sm">
          {field.label}
          <span className="text-navy-400 font-normal ml-2">({field.unit})</span>
        </label>
        <div className="relative">
          <input
            type="number"
            value={getFieldValue(field.id) ?? ''}
            onChange={(e) => {
              const val = e.target.value === '' ? null : parseFloat(e.target.value)
              onChange(field.id, val)
            }}
            onFocus={() => setFocusedFieldId(field.id)}
            onBlur={() => setFocusedFieldId(null)}
            placeholder={field.placeholder}
            className="w-full px-4 py-3 pr-14 rounded-xl border-2 border-navy-200 focus:border-navy-500 focus:ring-2 focus:ring-navy-200 outline-none transition-all text-navy-900 text-base bg-white"
            step="any"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-navy-400 text-sm bg-navy-50 px-2 py-1 rounded">
            {field.unit}
          </span>
        </div>
        {focusedFieldId === field.id && (
          <p className="text-xs text-navy-400 mt-1">Usa punto (.) como separador decimal</p>
        )}
        {field.benchmarkHint && focusedFieldId !== field.id && (
          <p className="text-xs text-blue-500 mt-1 italic">{field.benchmarkHint}</p>
        )}
      </div>
    )
  }

  const renderSection = (section) => {
    const isExpanded = expandedSection === section.id
    const progress = getSectionProgress(section)
    const progressColor = progress === 100 ? 'bg-green-500' : progress > 0 ? 'bg-navy-400' : 'bg-navy-200'

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 items-end">
              {section.fields.map(renderField)}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-navy-900 mb-2">
          Datos Operativos de tu Planta
        </h2>
        <p className="text-navy-600">
          Completa la información de tu operación. Si no conoces algún valor, puedes dejarlo en blanco — el ROI se calculará con los datos disponibles.
        </p>
      </div>

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
              <strong>Nota:</strong> Los campos marcados como "MM COP" se ingresan en millones de pesos. Ejemplo: si el valor es 400 millones, escriba 400.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {OPERATIONAL_SECTIONS.map(renderSection)}
      </div>
    </div>
  )
}