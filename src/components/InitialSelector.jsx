import React from 'react'
import { PRODUCT_LINE, SERVICE_TYPES, EQUIPMENT_MODELS } from '../utils/constants'

export default function InitialSelector({ calculationType, serviceType, onCalculationTypeChange, onServiceTypeChange, onContinue }) {
  const selectedService = SERVICE_TYPES.find(s => s.id === serviceType)

  return (
    <div className="min-h-screen bg-navy-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-navy-900 mb-2">
            Calculadora ROI
          </h1>
          <p className="text-navy-600">
            Línea de Negocio: <span className="font-semibold">{PRODUCT_LINE.name}</span>
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold text-navy-800 mb-4">¿Qué deseas calcular?</h2>

          <div className="space-y-4">
            <label
              className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                calculationType === 'product'
                  ? 'border-navy-600 bg-navy-50'
                  : 'border-navy-200 hover:border-navy-400'
              }`}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  name="calculationType"
                  value="product"
                  checked={calculationType === 'product'}
                  onChange={() => onCalculationTypeChange('product')}
                  className="w-5 h-5 text-navy-600"
                />
                <div className="ml-3">
                  <span className="font-semibold text-navy-900">Producto</span>
                  <p className="text-sm text-navy-600 mt-1">
                    Selecciona un colector y calcula el ROI de inversión en equipos de monitoreo
                  </p>
                </div>
              </div>

              {calculationType === 'product' && (
                <div className="mt-4 ml-8 grid grid-cols-1 md:grid-cols-3 gap-3">
                  {EQUIPMENT_MODELS.map(model => (
                    <div
                      key={model.id}
                      className="p-3 rounded-lg border border-navy-300 bg-white"
                    >
                      <p className="font-semibold text-navy-800">{model.name}</p>
                      <p className="text-sm text-navy-500">{model.level}</p>
                    </div>
                  ))}
                </div>
              )}
            </label>

            <label
              className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                calculationType === 'service'
                  ? 'border-navy-600 bg-navy-50'
                  : 'border-navy-200 hover:border-navy-400'
              }`}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  name="calculationType"
                  value="service"
                  checked={calculationType === 'service'}
                  onChange={() => onCalculationTypeChange('service')}
                  className="w-5 h-5 text-navy-600"
                />
                <div className="ml-3">
                  <span className="font-semibold text-navy-900">Servicio</span>
                  <p className="text-sm text-navy-600 mt-1">
                    Calcula el ROI de servicios de mantenimiento y diagnóstico
                  </p>
                </div>
              </div>

              {calculationType === 'service' && (
                <div className="mt-4 ml-8 space-y-3">
                  {SERVICE_TYPES.map(service => (
                    <label
                      key={service.id}
                      className={`block p-3 rounded-lg border cursor-pointer transition-all ${
                        serviceType === service.id
                          ? 'border-navy-500 bg-white'
                          : 'border-navy-200 bg-white hover:border-navy-400'
                      }`}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="serviceType"
                          value={service.id}
                          checked={serviceType === service.id}
                          onChange={() => onServiceTypeChange(service.id)}
                          className="w-4 h-4 text-navy-600"
                        />
                        <div className="ml-2">
                          <span className="font-medium text-navy-800">{service.name}</span>
                          <p className="text-xs text-navy-500">{service.description}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </label>
          </div>
        </div>

        <button
          onClick={onContinue}
          disabled={calculationType === 'service' && !serviceType}
          className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
            calculationType === 'service' && !serviceType
              ? 'bg-navy-200 text-navy-400 cursor-not-allowed'
              : 'bg-navy-600 text-white hover:bg-navy-700'
          }`}
        >
          Continuar
        </button>
      </div>
    </div>
  )
}
