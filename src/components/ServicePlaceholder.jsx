import React from 'react'
import { CogIcon } from './Icons'

export default function ServicePlaceholder({ serviceType }) {
  return (
    <div className="glass-panel p-8 animate-fade-in relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amaq-400 to-amaq-600"></div>
      <h2 className="text-xl font-bold text-amaq-700 mb-4">Servicio: {serviceType}</h2>
      
      <div className="bg-amaq-50 rounded-xl p-6 border border-amaq-200">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-amaq-200/50 flex items-center justify-center mr-4 border border-amaq-300">
            <CogIcon className="w-6 h-6 text-amaq-700 shrink-0" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Metodología en desarrollo</h3>
            <p className="text-sm text-slate-600 font-medium">Preguntas específicas del servicio</p>
          </div>
        </div>
        
        <p className="text-slate-800 mb-4 font-medium">
          Estamos trabajando en la metodología de cálculo para este tipo de servicio. 
          Próximamente podrás responder las preguntas que te guiarán en el proceso.
        </p>
        
        <div className="bg-white rounded-lg p-4 border border-slate-200">
          <p className="text-sm text-slate-700">
            <strong>Nota:</strong> El equipo de ventas podrá continuar con el proceso de 
            cotización manualmente mientras tanto.
          </p>
        </div>
      </div>
    </div>
  )
}
