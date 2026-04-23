import React from 'react'

export default function ServicePlaceholder({ serviceType }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-xl font-bold text-navy-900 mb-4">Servicio: {serviceType}</h2>
      
      <div className="bg-navy-50 rounded-xl p-6 border border-navy-200">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-navy-200 flex items-center justify-center mr-4">
            <span className="text-2xl">🔧</span>
          </div>
          <div>
            <h3 className="font-semibold text-navy-800">Metodología en desarrollo</h3>
            <p className="text-sm text-navy-600">Preguntas específicas del servicio</p>
          </div>
        </div>
        
        <p className="text-navy-700 mb-4">
          Estamos trabajando en la metodología de cálculo para este tipo de servicio. 
          Próximamente podrás responder las preguntas que te guiarán en el proceso.
        </p>
        
        <div className="bg-white rounded-lg p-4 border border-navy-200">
          <p className="text-sm text-navy-600">
            <strong>Nota:</strong> El equipo de ventas podrá continuar con el proceso de 
            cotización manualmente mientras tanto.
          </p>
        </div>
      </div>
    </div>
  )
}
