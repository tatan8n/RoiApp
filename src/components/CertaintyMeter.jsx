import React from 'react'
import { COLORS } from '../utils/constants'

export default function CertaintyMeter({ certainty, missingFields = [], levelInfo }) {
  const percentage = Math.min(100, Math.max(0, certainty))

  return (
    <div className="bg-white rounded-xl shadow-md p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white"
            style={{ backgroundColor: levelInfo?.color || COLORS.warning }}
          >
            {levelInfo?.icon || '⚠'}
          </div>
          <div>
            <p className="text-navy-700 font-semibold">Nivel de Certeza del Análisis</p>
            <p className="text-2xl font-bold" style={{ color: levelInfo?.color || COLORS.warning }}>
              {percentage}%
              <span className="text-sm font-normal text-navy-400 ml-2">
                ({levelInfo?.level || 'Media'})
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="w-full bg-navy-100 rounded-full h-3">
          <div
            className="h-3 rounded-full transition-all duration-500"
            style={{
              width: `${percentage}%`,
              backgroundColor: levelInfo?.color || COLORS.warning
            }}
          />
        </div>
      </div>

      {missingFields.length > 0 && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-amber-800 text-sm font-medium mb-2">
            ⚠️ Campos no respondidos:
          </p>
          <ul className="text-amber-700 text-xs space-y-1">
            {missingFields.map((field, index) => (
              <li key={index}>• {field}</li>
            ))}
          </ul>
        </div>
      )}

      {percentage < 50 && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm font-medium">
            ⚠️ Este análisis tiene baja certeza. Los resultados deben considerarse como estimación indicativa.
          </p>
        </div>
      )}
    </div>
  )
}