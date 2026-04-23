import React from 'react'
import { COLORS } from '../utils/constants'

export default function Header({ logoPath = '/logos/Logo A-MAQ (1)-02.png' }) {
  return (
    <header className="bg-navy-900 text-white py-4 px-6 shadow-lg">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <img 
            src={logoPath} 
            alt="A-MAQ Logo" 
            className="h-12 w-auto"
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
          <div>
            <h1 className="text-xl font-bold">Calculadora ROI</h1>
            <p className="text-navy-200 text-sm">Colectores de Vibración para Mantenimiento Predictivo</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold">A-MAQ S.A.</p>
          <p className="text-navy-300 text-xs">Mantenimiento Predictivo y Análisis de Vibración</p>
        </div>
      </div>
    </header>
  )
}