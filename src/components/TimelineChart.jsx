import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { COLORS } from '../utils/constants'

export default function TimelineChart({ projection = [], investment = 0 }) {
  if (projection.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-navy-900 mb-4">Proyección de Beneficio Neto Acumulado</h3>
        <p className="text-navy-400 text-center py-8">No hay datos para mostrar la proyección.</p>
      </div>
    )
  }

  const data = [
    { year: 0, value: -investment, label: 'Inversión' },
    ...projection.map(p => ({
      year: p.year,
      value: p.cumulative,
      label: `Año ${p.year}`,
      annualSavings: p.annualSavings
    }))
  ]

  const minValue = Math.min(...data.map(d => d.value))
  const maxValue = Math.max(...data.map(d => d.value))
  const range = maxValue - minValue

  const formatValue = (value) => {
    if (Math.abs(value) >= 1000000000) {
      return `$${(value / 1000000000).toFixed(1)}B`
    }
    if (Math.abs(value) >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    }
    return `$${(value / 1000).toFixed(0)}K`
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-navy-200">
          <p className="font-bold text-navy-900">{data.label}</p>
          <p className="text-navy-600">
            Beneficio Neto: <span className={data.value >= 0 ? 'text-green-600' : 'text-red-600'}>
              {formatValue(data.value)}
            </span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-bold text-navy-900 mb-4">Proyección de Beneficio Neto Acumulado</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.navy[600]} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={COLORS.navy[600]} stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="label"
              tick={{ fontSize: 12, fill: '#6B7280' }}
            />
            <YAxis 
              tickFormatter={formatValue}
              tick={{ fontSize: 12, fill: '#6B7280' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={COLORS.navy[600]}
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div className="p-3 bg-navy-50 rounded-lg">
          <p className="text-navy-400 text-xs">Inversión Inicial</p>
          <p className="font-bold text-navy-900">{formatValue(-investment)}</p>
        </div>
        <div className="p-3 bg-green-50 rounded-lg">
          <p className="text-green-400 text-xs">Beneficio Final ({`Año ${projection.length}`})</p>
          <p className="font-bold text-green-600">{formatValue(projection[projection.length - 1]?.cumulative || 0)}</p>
        </div>
        <div className="p-3 bg-navy-50 rounded-lg">
          <p className="text-navy-400 text-xs">ROI Acumulado</p>
          <p className="font-bold text-navy-900">
            {investment > 0 ? `${Math.round((projection[projection.length - 1]?.cumulative / investment) * 100)}%` : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  )
}