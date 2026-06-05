import React from 'react'
import { COLORS } from '../utils/constants'
import { CheckIcon, WarningIcon } from './Icons'

export default function CertaintyMeter({
  certainty,
  userCertainty,
  missingFields = [],
  benchmarkFactors = [],
  benchmarkApplied = {},
  levelInfo
}) {
  const percentage = Math.min(100, Math.max(0, certainty))
  const userPct = Math.min(100, Math.max(0, userCertainty ?? certainty))
  const color = levelInfo?.color || COLORS.warning

  const hasBenchmarks = benchmarkFactors.length > 0
  const benchmarkBoost = percentage - userPct

  return (
    <div className="glass-panel p-6 relative overflow-hidden mt-6 mb-8">
      <div
        className="absolute -left-10 -top-10 w-40 h-40 rounded-full blur-[50px] opacity-20 pointer-events-none"
        style={{ backgroundColor: color }}
      ></div>

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-glow border-2"
            style={{ backgroundColor: `${color}80`, borderColor: color }}
          >
            {levelInfo?.level === 'Alta' ? (
              <CheckIcon className="w-6 h-6 text-white" />
            ) : (
              <WarningIcon className="w-6 h-6 text-white" />
            )}
          </div>
          <div>
            <p className="text-amaq-700 font-bold tracking-wide">Nivel de Certeza del Análisis</p>
            <p className="text-3xl font-black flex items-baseline gap-2 mt-1" style={{ color }}>
              {percentage}%
              <span className="text-sm font-semibold text-slate-500 uppercase tracking-widest">
                ({levelInfo?.level || 'Media'})
              </span>
            </p>
            {hasBenchmarks && benchmarkBoost > 0 && (
              <p className="text-xs text-slate-500 mt-0.5">
                {userPct}% datos propios · +{benchmarkBoost}% benchmarks de industria
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Stacked certainty bar: user data (solid) + benchmark boost (striped) */}
      <div className="mt-6 relative z-10">
        <div className="w-full bg-slate-50 border border-slate-200 rounded-full h-3 overflow-hidden shadow-inner relative">
          {/* User data portion */}
          <div
            className="absolute left-0 top-0 h-3 rounded-l-full transition-all duration-1000 ease-out"
            style={{
              width: `${userPct}%`,
              backgroundColor: color,
              boxShadow: `0 0 8px ${color}`
            }}
          />
          {/* Benchmark boost portion */}
          {hasBenchmarks && benchmarkBoost > 0 && (
            <div
              className="absolute top-0 h-3 transition-all duration-1000 ease-out"
              style={{
                left: `${userPct}%`,
                width: `${benchmarkBoost}%`,
                background: `repeating-linear-gradient(45deg, ${color}60, ${color}60 3px, transparent 3px, transparent 6px)`,
              }}
            />
          )}
        </div>
        {hasBenchmarks && (
          <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-2 rounded inline-block" style={{ backgroundColor: color }}></span>
              Datos propios
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="w-3 h-2 rounded inline-block"
                style={{ background: `repeating-linear-gradient(45deg, ${color}80, ${color}80 2px, transparent 2px, transparent 4px)` }}
              ></span>
              Benchmark de industria
            </span>
          </div>
        )}
      </div>

      {/* Benchmark-estimated factors */}
      {hasBenchmarks && (
        <div className="mt-5 p-4 bg-blue-50 border border-blue-200 rounded-xl relative z-10">
          <p className="text-blue-800 text-sm font-bold mb-2 flex items-center gap-2">
            <span className="text-blue-600">📊</span>
            <span>Factores estimados con benchmarks de industria:</span>
          </p>
          <ul className="text-blue-700 text-xs space-y-1 pl-5 list-disc">
            {benchmarkFactors.map((name, i) => (
              <li key={i}>{name}</li>
            ))}
          </ul>
          <div className="mt-3 pt-3 border-t border-blue-200">
            <p className="text-blue-600 text-xs font-semibold mb-1.5">Valores utilizados:</p>
            <div className="grid grid-cols-1 gap-1">
              {Object.entries(benchmarkApplied).map(([field, info]) => (
                <div key={field} className="flex items-start justify-between gap-2">
                  <span className="text-blue-700 text-xs">{info.label}</span>
                  <span className="text-blue-800 text-xs font-semibold whitespace-nowrap">
                    {typeof info.value === 'number' && info.value % 1 !== 0
                      ? info.value.toFixed(1)
                      : info.value}
                    <span className="text-blue-500 font-normal ml-1">· {info.source}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-blue-600 text-xs mt-2 italic">
            Complete los datos reales del cliente para mayor precisión y certeza.
          </p>
        </div>
      )}

      {missingFields.length > 0 && (
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl relative z-10">
          <p className="text-amber-800 text-sm font-bold mb-2 flex items-center gap-2">
            <WarningIcon className="w-5 h-5 text-amber-600 shrink-0" />
            <span>Factores sin datos (no calculados):</span>
          </p>
          <ul className="text-amber-700 text-xs space-y-1.5 pl-6 list-disc">
            {missingFields.map((field, index) => (
              <li key={index}>{field}</li>
            ))}
          </ul>
        </div>
      )}

      {percentage < 50 && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl relative z-10">
          <p className="text-red-800 text-sm font-bold flex items-start gap-2">
            <WarningIcon className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <span>Certeza baja — los resultados deben considerarse una estimación orientativa inicial.</span>
          </p>
        </div>
      )}
    </div>
  )
}
