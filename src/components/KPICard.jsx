import React from 'react'
import { COLORS } from '../utils/constants'

export default function KPICard({ title, value, subtitle, color = COLORS.navy[600], icon, trend }) {
  const isPositive = trend === 'up'
  const isNegative = trend === 'down'

  return (
    <div className="bg-white rounded-xl shadow-md p-5 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-navy-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold mt-1" style={{ color }}>{value}</p>
          {subtitle && <p className="text-navy-300 text-xs mt-1">{subtitle}</p>}
        </div>
        {icon && (
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${color}20` }}
          >
            <span className="text-xl">{icon}</span>
          </div>
        )}
      </div>
      {trend && (
        <div className={`mt-2 text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? '↑ Positivo' : '↓ Negativo'}
        </div>
      )}
    </div>
  )
}