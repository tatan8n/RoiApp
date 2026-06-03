import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { COLORS } from '../utils/constants'
import { ChartIcon } from './Icons'

// AMAQ Corporate Blues adjusted for dark mode
const FACTOR_COLORS = [
  '#00d4ff', // amaq-400 (Cyan bright)
  '#0088cc', // amaq-500
  '#005599', // amaq-600
  '#003366', // navy dark
  '#4da6ff', // Light blue
  '#80bfff', // Softer blue
  '#b3d9ff', // Pale blue
  '#e6f2ff'  // Ice
]

export default function BenefitsChart({ factors = {} }) {
  const data = Object.entries(factors)
    .filter(([key, factor]) => factor.answered && factor.savings > 0)
    .map(([key, factor], index) => ({
      name: factor.name,
      savings: Math.round(factor.savings / 1000000 * 100) / 100,
      baseValue: Math.round(factor.baseValue / 1000000 * 100) / 100,
      color: FACTOR_COLORS[index % FACTOR_COLORS.length]
    }))
    .sort((a, b) => b.savings - a.savings)

  if (data.length === 0) {
    return (
      <div className="glass-panel p-6 h-full flex flex-col justify-center min-h-[400px]">
        <h3 className="text-lg font-bold text-amaq-900 mb-4 tracking-wide">Distribución de Ahorros</h3>
        <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          <p className="text-slate-500 font-medium text-center">No hay datos suficientes para mostrar el gráfico.</p>
        </div>
      </div>
    )
  }

  const formatTooltip = (value) => `$${value} MM`

  return (
    <div className="glass-panel p-6 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-amaq-100/50 rounded-full blur-[60px] pointer-events-none"></div>
      
      <h3 className="text-lg font-bold text-amaq-900 mb-6 tracking-wide flex items-center gap-2">
        <ChartIcon className="w-5 h-5 text-amaq-700 shrink-0" />
        <span>Distribución de Ahorros por Factor</span>
      </h3>
      
      <div className="h-80 relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
            <XAxis 
              type="number" 
              tickFormatter={(v) => `$${v} MM`}
              tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              tick={{ fontSize: 12, fill: '#475569', fontWeight: 500 }}
              width={95}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={false}
            />
            <Tooltip 
              formatter={formatTooltip} 
              cursor={{ fill: '#e2e8f0', opacity: 0.4 }}
              contentStyle={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                color: '#0f172a'
              }}
              itemStyle={{ color: '#3B4DA0', fontWeight: 'bold' }}
            />
            <Bar dataKey="savings" radius={[0, 6, 6, 0]} barSize={24}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  style={{ filter: `drop-shadow(0 0 8px ${entry.color}40)` }} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
