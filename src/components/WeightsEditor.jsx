import React, { useState } from 'react'
import { COLORS } from '../utils/constants'
import { WarningIcon } from './Icons'

const DEFAULT_WEIGHTS = {
  f1: 15,
  f2: 10,
  f3: 8,
  f4: 6,
  f5: 5,
  f6: 5,
  f7: 4,
  f8: 4
}

const FACTOR_NAMES = {
  f1: 'Lucro Cesante Evitado',
  f2: 'Correctivo Externo Evitado',
  f3: 'Optimización HH Reactivo',
  f4: 'Inventario y Demoras',
  f5: 'Paros Programados Evitados',
  f6: 'Vida Útil Diferida',
  f7: 'Ahorro Energético',
  f8: 'Seguridad y Seguros'
}

export default function WeightsEditor({ weights = DEFAULT_WEIGHTS, onChange, isEditing, setIsEditing }) {
  const [localWeights, setLocalWeights] = useState(weights)
  const [showWarning, setShowWarning] = useState(false)

  const totalWeight = Object.values(localWeights).reduce((a, b) => a + b, 0)

  const handleWeightChange = (factor, value) => {
    const newWeights = { ...localWeights, [factor]: value }
    setLocalWeights(newWeights)
  }

  const handleSave = () => {
    onChange(localWeights)
    setIsEditing(false)
    setShowWarning(false)
  }

  const handleCancel = () => {
    setLocalWeights(weights)
    setIsEditing(false)
    setShowWarning(false)
  }

  const handleStartEdit = () => {
    setShowWarning(true)
    setIsEditing(true)
  }

  return (
    <div className="glass-panel p-6 animate-fade-in relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amaq-400 to-amaq-600"></div>
      
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-amaq-700">Pesos de los Factores</h2>
        {!isEditing && (
          <button
            onClick={handleStartEdit}
            className="px-4 py-2 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all font-semibold"
          >
            Editar Pesos
          </button>
        )}
      </div>

      {showWarning && (
        <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg animate-fade-in">
          <p className="text-amber-800 text-sm font-bold mb-2 flex items-center gap-1.5">
            <WarningIcon className="w-5 h-5 text-amber-600 shrink-0" />
            <span>Advertencia Importante</span>
          </p>
          <p className="text-amber-800 text-xs leading-relaxed">
            Los pesos fueron definidos según literatura técnica y la investigación documentada 
            en la metodología A-MAQ (DOE, McKinsey, PWC, industria). 
            <strong> Modificarlos puede afectar la precisión del análisis.</strong>
            <br /><br />
            ¿Está seguro de que desea continuar?
          </p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleSave}
              className="px-3 py-1.5 text-xs bg-amber-600 text-white rounded hover:bg-amber-700 font-semibold"
            >
              Sí, continuar editando
            </button>
            <button
              onClick={() => setShowWarning(false)}
              className="px-3 py-1.5 text-xs bg-slate-100 text-slate-700 rounded hover:bg-slate-200 font-semibold"
            >
              No, cancelar
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {Object.entries(FACTOR_NAMES).map(([key, name]) => (
          <div key={key} className="flex items-center gap-4">
            <span className="w-40 text-sm text-slate-800 font-semibold">{name}</span>
            <div className="flex-1">
              <input
                type="range"
                min="0"
                max="30"
                value={localWeights[key]}
                onChange={(e) => handleWeightChange(key, parseInt(e.target.value))}
                disabled={!isEditing}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed"
              />
            </div>
            <span className="w-12 text-right font-bold text-slate-800">
              {localWeights[key]}%
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <span className="text-slate-800 font-semibold">Total:</span>
          <span className={`font-bold text-lg ${totalWeight === 100 ? 'text-green-600' : 'text-red-600'}`}>
            {totalWeight}%
          </span>
        </div>
        {totalWeight !== 100 && (
          <p className="text-red-600 text-xs mt-1 font-semibold">El total debe sumar exactamente 100%</p>
        )}
      </div>

      {isEditing && (
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all font-semibold"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={totalWeight !== 100}
            className={`px-4 py-2 text-sm rounded-lg transition-all font-bold ${
              totalWeight !== 100
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-amaq-700 text-white hover:bg-amaq-600 shadow-glow'
            }`}
          >
            Guardar Cambios
          </button>
        </div>
      )}
    </div>
  )
}
