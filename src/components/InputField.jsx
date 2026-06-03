import React from 'react'
import { WarningIcon } from './Icons'

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
      <label className="block text-slate-700 text-sm font-semibold mb-1 tracking-wide">
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
          className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 outline-none shadow-inner ${
            error
              ? 'border-red-300 bg-red-50 text-red-900'
              : 'border-slate-200 bg-white text-slate-900 focus:border-amaq-400 focus:bg-slate-50 focus:shadow-glow'
          } placeholder-slate-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-50 disabled:opacity-60`}
        />
        {unit && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-amaq-700 font-medium text-sm">
            {unit}
          </span>
        )}
      </div>
      {hint && !error && (
        <p className="text-slate-600 font-medium text-xs mt-1.5 ml-1">{hint}</p>
      )}
      {error && (
        <p className="text-red-600 text-xs mt-1.5 ml-1 flex items-center gap-1">
          <WarningIcon className="w-3.5 h-3.5 text-red-600 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  )
}
