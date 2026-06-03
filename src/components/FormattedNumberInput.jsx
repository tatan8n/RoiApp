import React, { useState, useEffect, useRef } from 'react'

function formatNumberWithSeparators(value, decimalPlaces = null) {
  if (value === null || value === undefined || value === '') return ''
  const str = value.toString()
  if (str === '' || str === '-') return str

  const parts = str.split('.')
  const integerPart = parts[0]
  const decimalPart = parts[1]

  const cleanedInt = integerPart.replace(/[^\d-]/g, '')
  if (cleanedInt === '' || cleanedInt === '-') return cleanedInt

  const isNegative = cleanedInt.startsWith('-')
  const positiveInt = isNegative ? cleanedInt.slice(1) : cleanedInt
  const formattedInt = parseInt(positiveInt, 10).toLocaleString('es-CO')
  const result = isNegative ? '-' + formattedInt : formattedInt

  if (decimalPart !== undefined) {
    return result + '.' + decimalPart
  }
  return result
}

function parseFormattedNumber(value) {
  if (value === null || value === undefined || value === '') return null
  const cleaned = value.toString().replace(/[^\d.-]/g, '')
  if (cleaned === '' || cleaned === '-') return null
  const num = parseFloat(cleaned)
  return isNaN(num) ? null : num
}

export default function FormattedNumberInput({
  value,
  onChange,
  placeholder = '',
  step = 'any',
  className = '',
  inputClassName = '',
  unitLabel = '',
  unitClassName = 'absolute right-3 top-1/2 -translate-y-1/2 text-amaq-700 font-bold text-xs bg-slate-50 border border-slate-200 px-2 py-1 rounded',
  disabled = false,
  min = null,
  allowDecimals = true,
  size = 'normal',
  onFocus = null,
  onBlur = null
}) {
  const [displayValue, setDisplayValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (!isFocused) {
      if (value === null || value === undefined || value === '') {
        setDisplayValue('')
      } else {
        setDisplayValue(formatNumberWithSeparators(value.toString()))
      }
    }
  }, [value, isFocused])

  const handleChange = (e) => {
    const input = e.target.value
    if (input === '') {
      setDisplayValue('')
      onChange(null)
      return
    }

    const cleaned = input.replace(/[^\d.-]/g, '')
    const parts = cleaned.split('.')
    let valid = parts[0]
    if (parts.length > 1) {
      valid += '.' + parts.slice(1).join('').slice(0, 6)
    }

    if (!allowDecimals && valid.includes('.')) {
      return
    }

    setDisplayValue(valid)
    const parsed = parseFormattedNumber(valid)
    onChange(parsed)
  }

  const handleFocus = (e) => {
    setIsFocused(true)
    if (value !== null && value !== undefined) {
      setDisplayValue(value.toString())
    }
    if (onFocus) onFocus(e)
  }

  const handleBlur = (e) => {
    setIsFocused(false)
    const parsed = parseFormattedNumber(displayValue)
    if (parsed !== null) {
      setDisplayValue(formatNumberWithSeparators(parsed.toString()))
    } else {
      setDisplayValue('')
    }
    if (onBlur) onBlur(e)
  }

  const sizeClasses = size === 'large'
    ? 'px-5 py-4 pr-24 text-lg font-medium'
    : 'px-4 py-3 pr-24'

  const unitSizeClasses = size === 'large'
    ? 'absolute right-3 top-1/2 -translate-y-1/2 text-amaq-700 font-bold text-sm bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm'
    : unitClassName

  return (
    <div className={`relative ${className}`}>
      <input
        ref={inputRef}
        type="text"
        inputMode="decimal"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        min={min}
        className={`w-full ${sizeClasses} rounded-xl border-2 border-slate-200 bg-white text-slate-900 focus:border-amaq-400 focus:bg-slate-50 focus:shadow-glow outline-none transition-all duration-300 shadow-inner placeholder-slate-500 ${inputClassName} ${disabled ? 'bg-slate-50 text-slate-500 border-slate-50 opacity-60' : ''}`}
      />
      {unitLabel && (
        <span className={unitSizeClasses}>
          {unitLabel}
        </span>
      )}
    </div>
  )
}
