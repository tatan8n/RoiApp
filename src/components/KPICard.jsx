import React from 'react'
import { COLORS } from '../utils/constants'
import { ArrowUpIcon, ArrowDownIcon } from './Icons'

export default function KPICard({ title, value, subtitle, color = COLORS.navy[600], icon, trend }) {
  const isPositive = trend === 'up'
  const isNegative = trend === 'down'

  return (
    <div className="glass-panel p-5 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
      <div 
        className="absolute top-0 left-0 w-full h-1" 
        style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
      ></div>
      <div 
        className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full blur-[30px] opacity-20 pointer-events-none transition-opacity group-hover:opacity-40"
        style={{ backgroundColor: color }}
      ></div>
      
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
          <p 
            className="text-2xl font-black tracking-tight drop-shadow-md" 
            style={{ color }}
          >
            {value}
          </p>
          {subtitle && <p className="text-slate-600 text-xs mt-1.5 font-semibold">{subtitle}</p>}
        </div>
        {icon && (
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center border shadow-inner backdrop-blur-sm"
            style={{ 
              backgroundColor: `${color}15`, 
              borderColor: `${color}30`,
              color: color
            }}
          >
            <span className="text-2xl drop-shadow-sm">{icon}</span>
          </div>
        )}
      </div>
      {trend && (
        <div className={`mt-3 text-xs font-bold px-2.5 py-1 inline-flex items-center gap-1 rounded border ${isPositive ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
          {isPositive ? (
            <>
              <ArrowUpIcon className="w-3.5 h-3.5 text-green-700 shrink-0" />
              <span>Positivo</span>
            </>
          ) : (
            <>
              <ArrowDownIcon className="w-3.5 h-3.5 text-red-700 shrink-0" />
              <span>Negativo</span>
            </>
          )}
        </div>
      )}
    </div>
  )
}
