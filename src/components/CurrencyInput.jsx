import React, { useState, useRef, useEffect, useCallback } from 'react'

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

function getCursorPosition(value, cursorPos, oldValue, oldCursorPos) {
  if (!value || value.length <= 1) return cursorPos

  const oldLength = oldValue ? oldValue.length : 0
  const newLength = value.length

  const diff = newLength - oldLength

  if (diff > 0) {
    const addedChar = value[cursorPos - 1]
    if (addedChar === ',' || addedChar === '.') {
      return cursorPos
    }
    if (diff > 1) {
      return cursorPos
    }
    const oldFormatted = oldValue ? formatWithSeparators(parseInput(oldValue)) : ''
    const oldCommaCount = (oldFormatted.match(/,/g) || []).length
    const newCommaCount = (value.match(/,/g) || []).length

    if (newCommaCount > oldCommaCount) {
      return cursorPos + 1
    }
  } else if (diff < 0) {
    return cursorPos
  }

  return cursorPos
}

export default function CurrencyInput({ field, value, onChange }) {
  const isCurrency = field.isCurrency || false
  const [localValue, setLocalValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef(null)

  const unitLabel = isCurrency ? 'MM COP' : field.unit

  useEffect(() => {
    if (!isFocused && value !== null && value !== undefined) {
      const formatted = formatWithSeparators(value)
      setLocalValue(formatted)
    }
  }, [value, isFocused])

  const handleChange = useCallback((e) => {
    const raw = e.target.value
    const oldValue = localValue

    let newValue = raw

    if (isFocused) {
      newValue = raw.replace(/[^\d.,]/g, '')

      const parts = newValue.split(/[.,]/)
      if (parts.length > 2) {
        newValue = parts[0] + '.' + parts.slice(1).join('')
      }
    }

    const parsed = parseInput(newValue)
    setLocalValue(newValue)

    if (parsed !== null || newValue === '') {
      onChange(field.id, parsed)
    }
  }, [field.id, onChange, isFocused, localValue])

  const handleFocus = useCallback(() => {
    setIsFocused(true)
    if (value !== null && value !== undefined) {
      setLocalValue(value.toString())
    } else {
      setLocalValue('')
    }
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.select()
      }
    }, 0)
  }, [value])

  const handleBlur = useCallback(() => {
    setIsFocused(false)
    if (value !== null && value !== undefined) {
      const formatted = formatWithSeparators(value)
      setLocalValue(formatted)
    }
  }, [value])

  const displayValue = localValue

  let calculatedHint = null
  if (isCurrency && field.id === 'technicianMonthlySalary' && value !== null && value > 0) {
    const fullSalary = value * 1_000_000
    const hourCost = (fullSalary * 1.75) / 240
    calculatedHint = `Costo hora-hombre calculado: ~${formatWithSeparators(Math.round(hourCost))} COP/h (salario × 1.75 / 240h)`
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
          className="w-full px-4 py-3 pr-20 rounded-xl border-2 border-navy-200 focus:border-navy-500 focus:ring-2 focus:ring-navy-200 outline-none transition-all text-navy-900 text-base bg-white"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-navy-400 text-sm bg-navy-50 px-2 py-1 rounded">
          {unitLabel}
        </span>
      </div>
      {isFocused && (
        <p className="text-xs text-navy-400 mt-1">Usa punto (.) como separador decimal</p>
      )}
      {calculatedHint && (
        <p className="text-xs text-green-600 mt-1">{calculatedHint}</p>
      )}
      {field.benchmarkHint && !calculatedHint && (
        <p className="text-xs text-blue-500 mt-1 italic">{field.benchmarkHint}</p>
      )}
    </div>
  )
}