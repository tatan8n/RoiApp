import React, { useState } from 'react'
import { COLORS } from '../utils/constants'

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
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-navy-900">Pesos de los Factores</h2>
        {!isEditing && (
          <button
            onClick={handleStartEdit}
            className="px-4 py-2 text-sm bg-navy-100 text-navy-700 rounded-lg hover:bg-navy-200 transition-all"
          >
            Editar Pesos
          </button>
        )}
      </div>

      {showWarning && (
        <div className="mb-4 p-4 bg-amber-50 border border-amber-300 rounded-lg">
          <p className="text-amber-800 text-sm font-medium mb-2">
            ⚠️ Advertencia Importante
          </p>
          <p className="text-amber-700 text-xs">
            Los pesos fueron definidos según literatura técnica y investigación documentada 
            en la metodología A-MAQ (DOE, McKinsey, PWC, industria). 
            <strong> Modificarlos puede afectar la precisión del análisis.</strong>
            <br /><br />
            ¿Está seguro de que desea continuar?
          </p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleSave}
              className="px-3 py-1 text-xs bg-amber-600 text-white rounded hover:bg-amber-700"
            >
              Sí, continuar editando
            </button>
            <button
              onClick={() => setShowWarning(false)}
              className="px-3 py-1 text-xs bg-navy-100 text-navy-700 rounded hover:bg-navy-200"
            >
              No, cancelar
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {Object.entries(FACTOR_NAMES).map(([key, name]) => (
          <div key={key} className="flex items-center gap-4">
            <span className="w-40 text-sm text-navy-700">{name}</span>
            <div className="flex-1">
              <input
                type="range"
                min="0"
                max="30"
                value={localWeights[key]}
                onChange={(e) => handleWeightChange(key, parseInt(e.target.value))}
                disabled={!isEditing}
                className="w-full h-2 bg-navy-200 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed"
              />
            </div>
            <span className="w-12 text-right font-bold text-navy-700">
              {localWeights[key]}%
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-navy-200">
        <div className="flex items-center justify-between">
          <span className="text-navy-700 font-medium">Total:</span>
          <span className={`font-bold text-lg ${totalWeight === 100 ? 'text-green-600' : 'text-red-600'}`}>
            {totalWeight}%
          </span>
        </div>
        {totalWeight !== 100 && (
          <p className="text-red-500 text-xs mt-1">El total debe ser 100%</p>
        )}
      </div>

      {isEditing && (
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm bg-navy-100 text-navy-700 rounded-lg hover:bg-navy-200 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={totalWeight !== 100}
            className={`px-4 py-2 text-sm rounded-lg transition-all ${
              totalWeight !== 100
                ? 'bg-navy-200 text-navy-400 cursor-not-allowed'
                : 'bg-navy-600 text-white hover:bg-navy-700'
            }`}
          >
            Guardar Cambios
          </button>
        </div>
      )}
    </div>
  )
}