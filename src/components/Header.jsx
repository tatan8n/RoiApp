import React from 'react'
import logoWhite from '../assets/logo-amaq-white.png'
import { HomeIcon } from './Icons'

export default function Header({ logoPath, onGoHome }) {
  const finalLogoPath = logoPath || logoWhite

  return (
    <header className="bg-amaq-brand sticky top-0 z-50 py-3 px-6 shadow-md border-b-4 border-amaq-light">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-5 group">
          <img
            src={finalLogoPath}
            alt="A-MAQ Logo"
            className="h-14 w-auto transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              // Only fallback to display none if both failed
              if (e.target.src !== logoWhite) {
                e.target.src = logoWhite;
              } else {
                e.target.style.display = 'none'
              }
            }}
          />
          <div>
            <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amaq-200 to-amaq-400 tracking-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>A-MAQ</h1>
            <p className="text-amaq-300 text-xs font-medium tracking-wide uppercase">Expertos en confiabilidad</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-white">Calculadora de ROI <span className="text-amaq-light font-black">Inteligente</span></p>
          </div>
          {onGoHome && (
            <button
              onClick={onGoHome}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-amaq-800 border border-amaq-600 text-white hover:bg-amaq-light hover:text-amaq-brand transition-all shadow-md"
              title="Volver al inicio"
            >
              <HomeIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
