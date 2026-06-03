import React from 'react'
import FormattedNumberInput from './FormattedNumberInput'

function formatWithSeparators(value) {
  if (value === null || value === undefined || value === '') return ''
  const parts = value.toString().split('.')
  const integerPart = parts[0]
  const decimalPart = parts[1]
  const formatted = parseInt(integerPart, 10).toLocaleString('es-CO')
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
    calculatedHint = `Costo hora-hombre calculado: ~${formatWithSeparators(Math.round(hourCost))} COP/h (salario x 1.75 / 240h)`
  }

  return (
    <div className="mb-5">
      <label className="block text-slate-800 font-semibold mb-2 text-sm tracking-wide">
        {field.label}
        {isCurrency ? (
          <span className="text-slate-600 font-normal ml-1">(en millones de pesos)</span>
        ) : (
          <span className="text-slate-600 font-normal ml-2">({field.unit})</span>
        )}
      </label>
      <FormattedNumberInput
        value={value}
        onChange={(val) => onChange(field.id, val)}
        placeholder={field.placeholder}
        unitLabel={unitLabel}
        min="0"
      />
      {calculatedHint && (
        <p className="text-xs text-slate-600 mt-1.5 ml-1 font-medium">{calculatedHint}</p>
      )}
      {field.benchmarkHint && !calculatedHint && (
        <p className="text-xs text-slate-600 mt-1.5 ml-1 italic font-medium">{field.benchmarkHint}</p>
      )}
    </div>
  )
}
