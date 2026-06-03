import React, { useEffect } from 'react'
import { CheckIcon, XIcon } from './Icons'

export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    if (!message) return
    const timer = setTimeout(() => onClose(), duration)
    return () => clearTimeout(timer)
  }, [message, duration, onClose])

  if (!message) return null

  const isSuccess = type === 'success'
  const bgColor = isSuccess ? 'bg-green-600 border-green-700' : 'bg-red-600 border-red-700'
  const Icon = isSuccess ? CheckIcon : XIcon

  return (
    <div className="fixed top-6 right-6 z-[200] animate-slide-up">
      <div className={`flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border-2 ${bgColor} text-white max-w-sm`}>
        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <p className="font-semibold text-sm flex-1">{message}</p>
        <button
          onClick={onClose}
          className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-white/20 transition-colors shrink-0"
          aria-label="Cerrar notificación"
        >
          <XIcon className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  )
}
