import React from 'react'

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

export default function CurrencyInput({ field, value, onChange }) {
  const isCurrency = field.isCurrency || false
  const unitLabel = isCurrency ? 'MM COP' : field.unit

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
          type="number"
          value={value ?? ''}
          onChange={(e) => {
            const val = e.target.value === '' ? null : parseFloat(e.target.value)
            onChange(field.id, val)
          }}
          placeholder={field.placeholder}
          step="any"
          className="w-full px-4 py-3 pr-20 rounded-xl border-2 border-navy-200 focus:border-navy-500 focus:ring-2 focus:ring-navy-200 outline-none transition-all text-navy-900 text-base bg-white"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-navy-400 text-sm bg-navy-50 px-2 py-1 rounded">
          {unitLabel}
        </span>
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