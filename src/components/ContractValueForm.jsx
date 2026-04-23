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

export default function ContractValueForm({ currency, annualContractValue, inflationRate, onChange }) {
  const currencyLabel = currency === 'USD' ? 'USD' : 'MM COP'
  const [localValue, setLocalValue] = useState('')
  const [localInflation, setLocalInflation] = useState('')
  const [isFocusedValue, setIsFocusedValue] = useState(false)
  const [isFocusedInflation, setIsFocusedInflation] = useState(false)

  const handleValueChange = useCallback((e) => {
    const raw = e.target.value
    let newValue = raw.replace(/[^\d.,]/g, '')
    const parts = newValue.split(/[.,]/)
    if (parts.length > 2) {
      newValue = parts[0] + '.' + parts.slice(1).join('')
    }
    const parsed = parseInput(newValue)
    setLocalValue(newValue)
    if (parsed !== null || newValue === '') {
      onChange('annualContractValue', parsed)
    }
  }, [onChange])

  const handleValueFocus = useCallback(() => {
    setIsFocusedValue(true)
    if (annualContractValue !== null && annualContractValue !== undefined) {
      setLocalValue(annualContractValue.toString())
    } else {
      setLocalValue('')
    }
  }, [annualContractValue])

  const handleValueBlur = useCallback(() => {
    setIsFocusedValue(false)
    if (annualContractValue !== null && annualContractValue !== undefined) {
      setLocalValue(formatWithSeparators(annualContractValue))
    }
  }, [annualContractValue])

  const handleInflationChange = useCallback((e) => {
    const raw = e.target.value
    let newValue = raw.replace(/[^\d.,]/g, '')
    const parts = newValue.split(/[.,]/)
    if (parts.length > 2) {
      newValue = parts[0] + '.' + parts.slice(1).join('')
    }
    const parsed = parseInput(newValue)
    setLocalInflation(newValue)
    if (parsed !== null || newValue === '') {
      onChange('inflationRate', parsed !== null ? parsed / 100 : null)
    }
  }, [onChange])

  const handleInflationFocus = useCallback(() => {
    setIsFocusedInflation(true)
    if (inflationRate !== null && inflationRate !== undefined) {
      setLocalInflation((inflationRate * 100).toString())
    } else {
      setLocalInflation('')
    }
  }, [inflationRate])

  const handleInflationBlur = useCallback(() => {
    setIsFocusedInflation(false)
    if (inflationRate !== null && inflationRate !== undefined) {
      setLocalInflation((inflationRate * 100).toFixed(0))
    }
  }, [inflationRate])

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
            📄
          </div>
          <div>
            <h3 className="font-semibold text-navy-800">Valor del Contrato Marco</h3>
            <p className="text-sm text-navy-500">Ingresa el valor anual del contrato de servicio</p>
          </div>
        </div>

        <div className="max-w-md mb-6">
          <label className="block text-sm font-medium text-navy-700 mb-2">
            Valor anual del contrato ({currencyLabel})
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="decimal"
              value={localValue}
              onChange={handleValueChange}
              onFocus={handleValueFocus}
              onBlur={handleValueBlur}
              placeholder="Ej: 120"
              className="w-full px-4 py-3 pr-16 rounded-xl border-2 border-navy-200 focus:border-navy-500 focus:ring-2 focus:ring-navy-200 outline-none transition-all text-navy-900 text-base bg-white"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-navy-400 text-sm bg-navy-50 px-2 py-1 rounded">
              {currencyLabel}
            </span>
          </div>
          {isFocusedValue && (
            <p className="text-xs text-navy-400 mt-1">Usa punto (.) como separador decimal</p>
          )}
          <p className="text-xs text-navy-400 mt-2">
            Ingresa el valor total anual del contrato de servicio.
            Este valor se incrementará anualmente según la inflación que definas.
          </p>
        </div>

        <div className="max-w-md">
          <label className="block text-sm font-medium text-navy-700 mb-2">
            Inflación anual estimada (%)
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="decimal"
              value={localInflation}
              onChange={handleInflationChange}
              onFocus={handleInflationFocus}
              onBlur={handleInflationBlur}
              placeholder="Ej: 4"
              className="w-full px-4 py-3 pr-16 rounded-xl border-2 border-navy-200 focus:border-navy-500 focus:ring-2 focus:ring-navy-200 outline-none transition-all text-navy-900 text-base bg-white"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-navy-400 text-sm bg-navy-50 px-2 py-1 rounded">
              %
            </span>
          </div>
          {isFocusedInflation && (
            <p className="text-xs text-navy-400 mt-1">Usa punto (.) como separador decimal</p>
          )}
          <p className="text-xs text-navy-400 mt-2">
            Inflación anual del contrato. Típico: 3-5%. Este valor incrementará el costo del contrato cada año.
          </p>
        </div>
      </div>
    </div>
  )
}