import React, { useState, useRef, useEffect, useCallback } from 'react'

function formatForDisplay(value, isCurrency) {
  if (value === null || value === undefined || value === '') return ''
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return ''
  if (isCurrency) {
    const formatted = num.toLocaleString('de-DE', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })
    return `$ ${formatted}`
  }
  return num.toLocaleString('de-DE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })
}

function parseInput(raw) {
  if (!raw || raw.trim() === '') return null
  const cleaned = raw.replace(/\s/g, '').replace(/\./g, '').replace(',', '.')
  const num = parseFloat(cleaned)
  return isNaN(num) ? null : num
}

export default function CurrencyInput({ field, value, onChange }) {
  const isCurrency = field.isCurrency || false
  const [localValue, setLocalValue] = useState(value ?? '')
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef(null)

  const unitLabel = isCurrency ? 'MM COP' : field.unit

  useEffect(() => {
    if (!isFocused) {
      setLocalValue(value ?? '')
    }
  }, [value, isFocused])

  const handleChange = useCallback((e) => {
    const raw = e.target.value
    const parsed = parseInput(raw)
    setLocalValue(raw)
    onChange(field.id, parsed)
  }, [field.id, onChange])

  const handleFocus = useCallback(() => {
    setIsFocused(true)
    setLocalValue(value ?? '')
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.select()
      }
    }, 0)
  }, [value])

  const handleBlur = useCallback(() => {
    setIsFocused(false)
    setLocalValue(value ?? '')
  }, [value])

  const displayValue = isFocused
    ? (localValue ?? '')
    : formatForDisplay(value, isCurrency)

  let calculatedHint = null
  if (isCurrency && field.id === 'technicianMonthlySalary' && value && value > 0) {
    const fullSalary = value * 1_000_000
    const hourCost = (fullSalary * 1.75) / 240
    const hourCostFormatted = formatForDisplay(Math.round(hourCost / 1_000_000 * 100) / 100, true)
    calculatedHint = `Costo hora-hombre calculado: ~${formatForDisplay(Math.round(hourCost), false)} COP/h (salario × 1.75 / 240h)`
  }

  return (
    <div className="mb-5">
      <label className="block text-navy-800 font-medium mb-2 text-sm">
        {field.label}
        {isCurrency ? (
          <span className="text-navy-400 font-normal ml-1">(en millones de pesos)</span>
        ) : (
          <span className="text-navy-400 font-normal ml-2">({field.unit})</span>
        )}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={field.placeholder}
          className={`w-full px-4 py-3 rounded-xl border-2 border-navy-200 focus:border-navy-500 focus:ring-2 focus:ring-navy-200 outline-none transition-all text-navy-900 text-base bg-white ${isCurrency ? 'pl-8' : ''} pr-20`}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-navy-400 text-sm bg-navy-50 px-2 py-1 rounded">
          {unitLabel}
        </span>
        {isCurrency && isFocused && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-500 font-semibold pointer-events-none">$</span>
        )}
      </div>
      {calculatedHint && (
        <p className="text-xs text-green-600 mt-1">{calculatedHint}</p>
      )}
      {field.benchmarkHint && !calculatedHint && (
        <p className="text-xs text-blue-500 mt-1 italic">{field.benchmarkHint}</p>
      )}
    </div>
  )
}