import React, { useState, useCallback } from 'react'

function formatWithSeparators(value) {
  if (value === null || value === undefined || value === '') return ''
  const parts = value.toString().split('.')
  const integerPart = parts[0]
  const decimalPart = parts[1]
  const formatted = parseInt(integerPart, 10).toLocaleString('de-DE')
  if (decimalPart !== undefined) {
    return formatted + '.' + decimalPart
  }
  return formatted
}

function parseInput(raw) {
  if (!raw || raw.trim() === '') return null
  const cleaned = raw.replace(/\s/g, '').replace(/\./g, '').replace(',', '.')
  const num = parseFloat(cleaned)
  return isNaN(num) ? null : num
}

export default function ServiceValueForm({ serviceType, currency, serviceValue, onChange }) {
  const isRotodynamic = serviceType === 'rotodinamico'
  const currencyLabel = currency === 'USD' ? 'USD' : 'MM COP'
  const [localValue, setLocalValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const handleChange = useCallback((e) => {
    const raw = e.target.value
    let newValue = raw.replace(/[^\d.,]/g, '')
    const parts = newValue.split(/[.,]/)
    if (parts.length > 2) {
      newValue = parts[0] + '.' + parts.slice(1).join('')
    }
    const parsed = parseInput(newValue)
    setLocalValue(newValue)
    if (parsed !== null || newValue === '') {
      onChange('serviceValue', parsed)
    }
  }, [onChange])

  const handleFocus = useCallback(() => {
    setIsFocused(true)
    if (serviceValue !== null && serviceValue !== undefined) {
      setLocalValue(serviceValue.toString())
    } else {
      setLocalValue('')
    }
  }, [serviceValue])

  const handleBlur = useCallback(() => {
    setIsFocused(false)
    if (serviceValue !== null && serviceValue !== undefined) {
      setLocalValue(formatWithSeparators(serviceValue))
    }
  }, [serviceValue])

  const displayValue = localValue

  if (!isRotodynamic) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
          <div className="flex items-start">
            <span className="text-2xl mr-3">&#128161;</span>
            <div>
              <p className="text-green-800 font-medium">Nivel de Certeza</p>
              <p className="text-green-600 text-sm mt-1">
                Entre más campos completes, mayor será la certeza del cálculo del ROI.
                Los campos vacíos usarán valores de referencia de la industria.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-navy-50 rounded-xl p-6 border border-navy-200">
          <p className="text-navy-600">
            Ingresa el valor del servicio para calcular el ROI.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
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

      <div className="bg-navy-50 rounded-xl p-6 border border-navy-200">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-navy-200 flex items-center justify-center mr-3 text-xl">
            💰
          </div>
          <div>
            <h3 className="font-semibold text-navy-800">Valor del Servicio</h3>
            <p className="text-sm text-navy-500">Ingresa el valor personalizado del servicio de análisis rotodinámico</p>
          </div>
        </div>

        <div className="max-w-md">
          <label className="block text-sm font-medium text-navy-700 mb-2">
            Valor del servicio ({currencyLabel})
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="decimal"
              value={displayValue}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="Ej: 500"
              className="w-full px-4 py-3 pr-16 rounded-xl border-2 border-navy-200 focus:border-navy-500 focus:ring-2 focus:ring-navy-200 outline-none transition-all text-navy-900 text-base bg-white"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-navy-400 text-sm bg-navy-50 px-2 py-1 rounded">
              {currencyLabel}
            </span>
          </div>
          {isFocused && (
            <p className="text-xs text-navy-400 mt-1">Usa punto (.) como separador decimal</p>
          )}
          <p className="text-xs text-navy-400 mt-2">
            Ingresa el valor total del servicio de diagnóstico rotodinámico.
            Este será usado como inversión inicial para el cálculo del ROI.
          </p>
        </div>
      </div>
    </div>
  )
}