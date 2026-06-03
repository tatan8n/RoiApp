import React, { useState, useEffect, useRef } from 'react'
import { XIcon, SaveIcon, UserIcon } from './Icons'

export default function SaveModal({ isOpen, onClose, onSave, defaultName = '' }) {
  const [name, setName] = useState(defaultName)
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setName(defaultName)
      setError('')
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus()
      }, 100)
    }
  }, [isOpen, defaultName])

  useEffect(() => {
    if (!isOpen) return
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Por favor ingrese el nombre del analista.')
      return
    }
    onSave(trimmed)
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="glass-panel p-0 max-w-md w-full relative overflow-hidden animate-slide-up shadow-2xl border-2 border-amaq-500/30">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amaq-400 via-amaq-600 to-amaq-400"></div>
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-amaq-500/20 rounded-full blur-[60px] pointer-events-none"></div>

        <div className="p-6 border-b border-slate-200 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amaq-50 border-2 border-amaq-500/30 flex items-center justify-center shadow-glow">
              <SaveIcon className="w-6 h-6 text-amaq-700" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Guardar análisis</h2>
              <p className="text-slate-500 text-sm font-medium">Identifica al responsable del análisis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Cerrar"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 relative z-10">
          <label className="block text-sm font-bold text-slate-800 mb-2 tracking-wide flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-amaq-700" />
            <span>Nombre del analista</span>
          </label>
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (error) setError('')
            }}
            placeholder="Ej: Juan Pérez"
            className={`w-full px-4 py-3 rounded-xl border-2 bg-white text-slate-900 focus:outline-none transition-all duration-300 shadow-inner placeholder-slate-500 ${
              error
                ? 'border-red-300 focus:border-red-500 focus:bg-red-50'
                : 'border-slate-200 focus:border-amaq-400 focus:bg-slate-50 focus:shadow-glow'
            }`}
          />
          {error && (
            <p className="text-red-600 text-xs mt-2 font-semibold">{error}</p>
          )}
          <p className="text-xs text-slate-500 mt-2">
            Este nombre se mostrará junto al análisis guardado para identificar quién lo creó.
          </p>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg font-bold text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg font-bold text-sm text-white bg-gradient-to-r from-amaq-700 to-amaq-500 hover:from-amaq-600 hover:to-amaq-400 transition-all shadow-glow hover:shadow-glow-lg flex items-center gap-2"
            >
              <SaveIcon className="w-4 h-4" />
              <span>Guardar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
