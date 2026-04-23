import React from 'react'
import { COLORS } from '../utils/constants'

export default function InputField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  unit = '',
  error,
  hint,
  disabled = false,
  step = 'any'
}) {
  return (
    <div className="mb-4">
      <label className="block text-navy-700 text-sm font-medium mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          step={step}
          className={`w-full px-4 py-3 rounded-lg border ${
            error
              ? 'border-red-400 bg-red-50'
              : 'border-navy-200 bg-white focus:border-navy-500 focus:ring-2 focus:ring-navy-200'
          } outline-none transition-all text-navy-900 placeholder-navy-300 disabled:bg-navy-50 disabled:text-navy-400`}
        />
        {unit && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-navy-400 text-sm">
            {unit}
          </span>
        )}
      </div>
      {hint && !error && (
        <p className="text-navy-400 text-xs mt-1">{hint}</p>
      )}
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  )
}