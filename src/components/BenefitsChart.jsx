import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { COLORS } from '../utils/constants'

const FACTOR_COLORS = [
  COLORS.navy[600],
  COLORS.navy[500],
  COLORS.navy[400],
  COLORS.navy[300],
  '#6699CC',
  '#99B3D9',
  '#B3CCE6',
  '#CCE5FF'
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
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-navy-900 mb-4">Distribución de Ahorros por Factor</h3>
        <p className="text-navy-400 text-center py-8">No hay datos suficientes para mostrar el gráfico.</p>
      </div>
    )
  }

  const formatTooltip = (value) => `$${value} MM COP`

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-bold text-navy-900 mb-4">Distribución de Ahorros por Factor</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              type="number" 
              tickFormatter={(v) => `$${v} MM`}
              tick={{ fontSize: 12, fill: '#6B7280' }}
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              tick={{ fontSize: 12, fill: '#374151' }}
              width={95}
            />
            <Tooltip formatter={formatTooltip} />
            <Bar dataKey="savings" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}