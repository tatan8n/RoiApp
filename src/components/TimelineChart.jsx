import React from 'react'
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { COLORS } from '../utils/constants'
import { ChartIcon } from './Icons'

const MONTH_NAMES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

export default function TimelineChart({ projection = [], investment = 0, projectionYears }) {
  if (projection.length === 0) {
    return (
      <div className="glass-panel p-6 h-full flex flex-col justify-center min-h-[400px]">
        <h3 className="text-lg font-bold text-amaq-900 mb-4 tracking-wide">Proyección de Beneficio</h3>
        <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          <p className="text-slate-600 font-medium text-center">No hay datos para mostrar la proyección.</p>
        </div>
      </div>
    )
  }

  // Use months when the horizon is exactly 1 year
  const isMonthlyView = (projectionYears ?? projection.length) === 1

  let data
  if (isMonthlyView) {
    const annualSavings = projection[0]?.annualSavings ?? 0
    const monthlySavings = annualSavings / 12
    data = [
      { period: 0, value: -investment, label: 'Inicio' },
      ...Array.from({ length: 12 }, (_, i) => {
        const month = i + 1
        return {
          period: month,
          value: -investment + monthlySavings * month,
          label: MONTH_NAMES[i],
          annualSavings
        }
      })
    ]
  } else {
    data = [
      { period: 0, value: -investment, label: 'Inversión' },
      ...projection.map(p => ({
        period: p.year,
        value: p.cumulative,
        label: `Año ${p.year}`,
        annualSavings: p.annualSavings
      }))
    ]
  }

  const formatValue = (value) => {
    const millions = value / 1_000_000
    const absMillions = Math.abs(millions)
    let formatted
    if (absMillions >= 1000) {
      formatted = millions.toLocaleString('es-CO', { maximumFractionDigits: 0 })
    } else {
      formatted = millions.toFixed(1)
    }
    return `$${formatted} MM`
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const pt = payload[0].payload
      const isPositive = pt.value >= 0
      const periodLabel = isMonthlyView
        ? (pt.period === 0 ? 'Inicio' : `Mes ${pt.period} (${pt.label})`)
        : pt.label
      return (
        <div className="bg-white p-4 rounded-xl shadow-glow border border-slate-200 backdrop-blur-md">
          <p className="font-bold text-slate-900 mb-1 tracking-wide">{periodLabel}</p>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-sm font-medium">Beneficio Neto:</span>
            <span className={`font-black text-lg ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {formatValue(pt.value)}
            </span>
          </div>
        </div>
      )
    }
    return null
  }

  const finalPeriodLabel = isMonthlyView ? 'Mes 12' : `Año ${projection.length}`
  const finalValue = isMonthlyView
    ? data[data.length - 1]?.value
    : projection[projection.length - 1]?.cumulative ?? 0

  return (
    <div className="glass-panel p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-green-100/50 rounded-full blur-[60px] pointer-events-none"></div>

      <h3 className="text-lg font-bold text-amaq-900 mb-6 tracking-wide flex items-center gap-2">
        <ChartIcon className="w-7 h-7 text-amaq-700 shrink-0" />
        <span>Proyección de Beneficio Neto Acumulado</span>
        {isMonthlyView && (
          <span className="ml-auto text-xs font-semibold text-amaq-600 bg-amaq-50 border border-amaq-200 rounded-full px-3 py-0.5">
            Vista mensual
          </span>
        )}
      </h3>

      <div className="h-[280px] relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2e3192" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#2e3192" stopOpacity={0.0}/>
              </linearGradient>
              <linearGradient id="colorNegative" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f87171" stopOpacity={0.0}/>
                <stop offset="95%" stopColor="#f87171" stopOpacity={0.6}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={false}
              dy={10}
            />
            <YAxis
              tickFormatter={formatValue}
              tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={false}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="value"
              stroke="#2e3192"
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#colorValue)"
              activeDot={{ r: 8, fill: '#2e3192', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4 text-center relative z-10">
        <div className="p-4 bg-slate-50/60 rounded-xl border border-slate-200">
          <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-1">Inversión Inicial</p>
          <p className="font-black text-slate-900 text-lg">{formatValue(-investment)}</p>
        </div>
        <div className="p-4 bg-green-50 rounded-xl border border-green-200 shadow-sm">
          <p className="text-green-700 text-xs font-bold uppercase tracking-wider mb-1">Beneficio Final ({finalPeriodLabel})</p>
          <p className="font-black text-green-600 text-lg">{formatValue(finalValue)}</p>
        </div>
        <div className="p-4 bg-slate-50/60 rounded-xl border border-slate-200">
          <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-1">ROI Acumulado</p>
          <p className="font-black text-slate-900 text-lg">
            {investment > 0 ? `${Math.round((finalValue / investment) * 100)}%` : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  )
}
