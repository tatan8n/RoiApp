import React, { useState, useCallback } from 'react'

function formatForDisplay(value) {
  if (value === null || value === undefined || value === '') return ''
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return ''
  return num.toLocaleString('de-DE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
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
  const [localValue, setLocalValue] = useState(serviceValue ?? '')
  const [isFocused, setIsFocused] = useState(false)

  const handleChange = useCallback((e) => {
    const raw = e.target.value
    const parsed = parseInput(raw)
    setLocalValue(raw)
    onChange('serviceValue', parsed)
  }, [onChange])

  const handleFocus = useCallback(() => {
    setIsFocused(true)
    setLocalValue(serviceValue ?? '')
  }, [serviceValue])

  const handleBlur = useCallback(() => {
    setIsFocused(false)
    setLocalValue(serviceValue ?? '')
  }, [serviceValue])

  const displayValue = isFocused
    ? (localValue ?? '')
    : formatForDisplay(serviceValue)

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
          <p className="text-xs text-navy-400 mt-2">
            Ingresa el valor total del servicio de diagnóstico rotodinámico.
            Este será usado como inversión inicial para el cálculo del ROI.
          </p>
        </div>
      </div>
    </div>
  )
}