import React from 'react'
import { COLORS } from '../utils/constants'

export default function Header({ logoPath = '/logos/Logo A-MAQ (1)_Mesa de trabajo 1.png', onGoHome }) {
  return (
    <header className="bg-white border-b-4 border-navy-900 py-3 px-6 shadow-md">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-5">
          <img
            src={logoPath}
            alt="A-MAQ Logo"
            className="h-16 w-auto"
            style={{ filter: 'brightness(0) contrast(1.2)' }}
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
          <div>
            <h1 className="text-2xl font-black text-navy-900 tracking-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>A-MAQ</h1>
            <p className="text-navy-400 text-xs font-medium">Expertos en confiabilidad</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-bold text-navy-800">Calculadora de ROI para inversiones de mantenimiento predictivo</p>
          </div>
          {onGoHome && (
            <button
              onClick={onGoHome}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-navy-100 text-navy-700 hover:bg-navy-200 transition-all text-xl"
              title="Volver al inicio"
            >
              🏠
            </button>
          )}
        </div>
      </div>
    </header>
  )
}