import React, { useState, useEffect } from 'react'
import { SparklesIcon, CheckIcon, ArrowRightIcon, ArrowLeftIcon, LightbulbIcon } from './Icons'

export default function GuidedAssistant({
  formData,
  currentStep,
  updateClient,
  updateEquipment,
  updateOperational,
  updateBenchmarks,
  updateRotodynamicBenchmarks,
  updateFinancial,
  updateRotodynamic,
  updateContratoMarco,
  nextStep
}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  useEffect(() => {
    setCurrentQuestionIndex(0)
  }, [currentStep])

  const isProduct = formData.calculationType === 'product'
  const isService = formData.calculationType === 'service'
  const isRotodynamic = formData.serviceType === 'rotodinamico'
  const isContratoMarco = isService && formData.serviceType === 'contrato_marco'

  const getQuestions = () => {
    let qs = []

    if (currentStep === 1) {
      qs.push(
        { id: 'client.companyName', label: '¿Cuál es el nombre de la empresa?', type: 'text', update: updateClient, field: 'companyName', hint: 'Ej: EPM, Celsia, Postobón' },
        { id: 'client.contactName', label: '¿Cuál es el nombre del contacto principal?', type: 'text', update: updateClient, field: 'contactName', hint: 'Persona encargada del análisis' },
        { id: 'client.sector', label: '¿En qué sector industrial opera?', type: 'text', update: updateClient, field: 'sector', hint: 'Ej: Hidroeléctrica, Manufactura, Oil & Gas' }
      )

      if (isProduct) {
        qs.push(
          { id: 'equipment.modelId', label: '¿Qué equipo de monitoreo se va a adquirir?', type: 'select', options: ['vibriom', 'va3pro', 'va5pro'], optionLabels: ['VibrioM (Básico)', 'VA3pro (Intermedio)', 'VA5pro (Full)'], update: updateEquipment, field: 'modelId' }
        )
      } else if (isRotodynamic) {
        qs.push(
          { id: 'rotodynamic.serviceValue', label: '¿Cuál es el valor anual del servicio rotodinámico?', type: 'currency', update: updateRotodynamic, field: 'serviceValue', hint: 'En millones de pesos' }
        )
      } else if (isContratoMarco) {
        qs.push(
          { id: 'contratoMarco.annualContractValue', label: '¿Cuál es el valor del contrato anual?', type: 'currency', update: updateContratoMarco, field: 'annualContractValue', hint: 'En millones de pesos' },
          { id: 'contratoMarco.inflationRate', label: '¿Tasa de inflación anual estimada (%)?', type: 'percent', update: updateContratoMarco, field: 'inflationRate', hint: 'Típico: 3-5%' }
        )
      }
    } else if (currentStep === 2) {
      if (isProduct || isContratoMarco) {
        qs.push(
          { id: 'operational.totalAssets', label: '¿Cuántos equipos rotativos totales tiene la planta?', type: 'number', update: updateOperational, field: 'totalAssets', hint: 'Típico: 50-500 equipos' },
          { id: 'operational.costPerHourStop', label: '¿Costo por hora de paro no planificado?', type: 'currency', update: updateOperational, field: 'costPerHourStop', hint: 'En millones de pesos por hora' },
          { id: 'operational.unplannedFailures', label: '¿Frecuencia de fallas no planificadas?', type: 'number', update: updateOperational, field: 'unplannedFailures', hint: 'Paros imprevistos al año' },
          { id: 'operational.avgStopDuration', label: '¿Duración promedio de cada paro (horas)?', type: 'number', update: updateOperational, field: 'avgStopDuration', hint: 'Típico: 2-8 horas' },
          { id: 'operational.correctiveExternalCost', label: '¿Costo promedio de intervención correctiva externa?', type: 'currency', update: updateOperational, field: 'correctiveExternalCost', hint: 'En millones por evento' },
          { id: 'operational.correctiveExternalCount', label: '¿Intervenciones correctivas externas al año?', type: 'number', update: updateOperational, field: 'correctiveExternalCount', hint: 'Cantidad de servicios externos' },
          { id: 'operational.reactiveManHours', label: '¿Horas-hombre mensuales en mantenimiento reactivo?', type: 'number', update: updateOperational, field: 'reactiveManHours', hint: 'Horas del equipo interno' },
          { id: 'operational.technicianMonthlySalary', label: '¿Salario mensual de un técnico de mantenimiento?', type: 'currency', update: updateOperational, field: 'technicianMonthlySalary', hint: 'En millones de pesos mensuales' },
          { id: 'operational.monthlyBilling', label: '¿Facturación mensual aproximada?', type: 'currency', update: updateOperational, field: 'monthlyBilling', hint: 'En millones de pesos mensuales' }
        )
      } else if (isRotodynamic) {
        qs.push(
          { id: 'rotodynamic.turbineType', label: '¿Tipo de turbina?', type: 'select', options: ['gas', 'steam', 'hydro'], optionLabels: ['Gas', 'Vapor (Steam)', 'Hidráulica (Hydro)'], update: updateRotodynamic, field: 'turbineType' },
          { id: 'rotodynamic.numTurbines', label: '¿Número de turbinas/generadores?', type: 'number', update: updateRotodynamic, field: 'numTurbines', hint: 'Ej: 4' },
          { id: 'rotodynamic.nominalCapacity', label: '¿Capacidad nominal (MW) por unidad?', type: 'number', update: updateRotodynamic, field: 'nominalCapacity', hint: 'Ej: 250 MW' },
          { id: 'rotodynamic.yearsOfOperation', label: '¿Años de operación de la turbina?', type: 'number', update: updateRotodynamic, field: 'yearsOfOperation', hint: 'Edad del activo' },
          { id: 'rotodynamic.costPerHourStop', label: '¿Costo por hora de paro?', type: 'currency', update: updateRotodynamic, field: 'costPerHourStop', hint: 'En millones por hora' },
          { id: 'rotodynamic.criticalFailures', label: '¿Fallas críticas en los últimos 24 meses?', type: 'number', update: updateRotodynamic, field: 'criticalFailures', hint: 'Eventos reportados' }
        )
      }
    } else if (currentStep === 3) {
      if (isProduct || isContratoMarco) {
        qs.push(
          { id: 'benchmarks.reductionFailures', label: '¿Reducción de fallas no planificadas (%)?', type: 'percent', update: updateBenchmarks, field: 'reductionFailures', hint: 'Típico: 50-75%' },
          { id: 'benchmarks.reductionCorrective', label: '¿Reducción de mantenimiento correctivo (%)?', type: 'percent', update: updateBenchmarks, field: 'reductionCorrective', hint: 'Típico: 25-40%' },
          { id: 'benchmarks.optimizationHH', label: '¿Optimización de horas-hombre (%)?', type: 'percent', update: updateBenchmarks, field: 'optimizationHH', hint: 'Típico: 30-60%' },
          { id: 'benchmarks.reductionDelays', label: '¿Reducción de demoras por repuestos (%)?', type: 'percent', update: updateBenchmarks, field: 'reductionDelays', hint: 'Típico: 20-30%' },
          { id: 'benchmarks.reductionScheduledStops', label: '¿Reducción de paros programados (%)?', type: 'percent', update: updateBenchmarks, field: 'reductionScheduledStops', hint: 'Típico: 15-25%' }
        )
      } else if (isRotodynamic) {
        qs.push(
          { id: 'rotodynamicBenchmarks.reductionFailures', label: '¿Reducción de lucro cesante (%)?', type: 'percent', update: updateRotodynamicBenchmarks, field: 'reductionFailures', hint: 'Típico: 35-45%' },
          { id: 'rotodynamicBenchmarks.reductionHeatRate', label: '¿Mejora en heat rate (%)?', type: 'percent', update: updateRotodynamicBenchmarks, field: 'reductionHeatRate', hint: 'Típico: 1-3%' },
          { id: 'rotodynamicBenchmarks.optimizationHH', label: '¿Optimización de horas-hombre (%)?', type: 'percent', update: updateRotodynamicBenchmarks, field: 'optimizationHH', hint: 'Típico: 30%' },
          { id: 'rotodynamicBenchmarks.reductionDelays', label: '¿Reducción de demoras por repuestos (%)?', type: 'percent', update: updateRotodynamicBenchmarks, field: 'reductionDelays', hint: 'Típico: 20-30%' },
          { id: 'rotodynamicBenchmarks.extensionLife', label: '¿Extensión de vida útil (%)?', type: 'percent', update: updateRotodynamicBenchmarks, field: 'extensionLife', hint: 'Típico: 20-40%' }
        )
      }
    } else if (currentStep === 4) {
      qs.push(
        { id: 'financial.discountRate', label: '¿Tasa de descuento anual (%)?', type: 'percent', update: updateFinancial, field: 'discountRate', hint: 'Típico: 10-12%' },
        { id: 'financial.projectionYears', label: '¿Horizonte de proyección (años)?', type: 'select', options: [3, 5, 7, 10], optionLabels: ['3 años', '5 años', '7 años', '10 años'], update: updateFinancial, field: 'projectionYears' }
      )
    }

    return qs
  }

  const questions = getQuestions()
  const currentQ = questions[currentQuestionIndex]

  if (!currentQ) {
    return (
      <div className="w-72 lg:w-80 shrink-0 bg-white border border-slate-200 p-6 flex flex-col items-center justify-center text-center shadow-lg h-[calc(100vh-80px)] sticky top-20 rounded-2xl">
        <div className="w-16 h-16 bg-gradient-to-br from-green-50 to-green-100 rounded-full flex items-center justify-center mb-4 text-green-600 border-2 border-green-200 shadow-glow">
          <CheckIcon className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">¡Sección completa!</h3>
        <p className="text-slate-600 mb-6 text-sm">Has respondido todas las preguntas de esta etapa.</p>
        <button
          onClick={nextStep}
          className="w-full bg-gradient-to-r from-amaq-700 to-amaq-500 hover:from-amaq-600 hover:to-amaq-400 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
        >
          <span>Siguiente etapa</span>
          <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>
    )
  }

  const getPathValue = () => {
    try {
      const parts = currentQ.id.split('.')
      return formData[parts[0]]?.[parts[1]] ?? ''
    } catch {
      return ''
    }
  }

  const currentValue = getPathValue()

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleNext()
    }
  }

  const handleChange = (e) => {
    const val = e.target.value
    if (currentQ.type === 'number') {
      const num = val === '' ? null : Number(val)
      currentQ.update(currentQ.field, num)
    } else if (currentQ.type === 'percent') {
      const num = val === '' ? null : Number(val) / 100
      currentQ.update(currentQ.field, num)
    } else if (currentQ.type === 'currency') {
      const num = val === '' ? null : Number(val)
      currentQ.update(currentQ.field, num)
    } else {
      currentQ.update(currentQ.field, val)
    }
  }

  const progress = questions.length > 0 ? ((currentQuestionIndex) / questions.length) * 100 : 0

  return (
    <div className="w-72 lg:w-80 shrink-0 bg-white border border-slate-200 shadow-lg flex flex-col h-[calc(100vh-100px)] sticky top-24 rounded-2xl overflow-hidden ml-4 lg:ml-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-amaq-800 to-amaq-600 text-white p-4 relative overflow-hidden">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        <div className="flex items-center gap-2 relative z-10">
          <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
            <SparklesIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Asistente Guiado</h3>
            <p className="text-xs text-amaq-200">Pregunta {currentQuestionIndex + 1} de {questions.length}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-amaq-900/50 rounded-full h-2 mt-3">
          <div
            className="bg-white h-2 rounded-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(255,255,255,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 p-5 overflow-y-auto bg-slate-50">
        <label className="block text-slate-900 font-bold mb-1 text-base leading-snug">
          {currentQ.label}
        </label>
        {currentQ.hint && (
          <p className="text-xs text-slate-500 mb-4 flex items-center gap-1">
            <LightbulbIcon className="w-3.5 h-3.5 text-amaq-600 shrink-0" />
            <span>{currentQ.hint}</span>
          </p>
        )}

        {currentQ.type === 'select' ? (
          <select
            value={currentValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="w-full bg-white border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:border-amaq-400 focus:ring-2 focus:ring-amaq-200 shadow-sm transition-all"
          >
            <option value="">Seleccione...</option>
            {currentQ.options.map((opt, idx) => (
              <option key={opt} value={opt}>{currentQ.optionLabels ? currentQ.optionLabels[idx] : opt}</option>
            ))}
          </select>
        ) : (
          <div className="relative">
            {currentQ.type === 'currency' && (
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
            )}
            {currentQ.type === 'percent' && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">%</span>
            )}
            <input
              type={currentQ.type === 'number' || currentQ.type === 'currency' || currentQ.type === 'percent' ? 'number' : 'text'}
              value={currentValue ?? ''}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className={`w-full bg-white border-2 border-slate-200 text-slate-900 rounded-xl py-3 focus:outline-none focus:border-amaq-400 focus:ring-2 focus:ring-amaq-200 shadow-sm transition-all ${
                currentQ.type === 'currency' ? 'pl-8 pr-4' :
                currentQ.type === 'percent' ? 'pl-4 pr-8' : 'px-4'
              }`}
              placeholder="Ingresa el valor..."
              min={0}
              max={currentQ.max}
            />
          </div>
        )}

        {/* Mini progress dots */}
        <div className="flex items-center justify-center gap-1.5 mt-5">
          {questions.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx < currentQuestionIndex
                  ? 'w-4 bg-amaq-600'
                  : idx === currentQuestionIndex
                  ? 'w-6 bg-amaq-400'
                  : 'w-1.5 bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between gap-2">
        <button
          onClick={handlePrev}
          disabled={currentQuestionIndex === 0}
          className="px-3 py-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-colors flex items-center gap-1"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span className="text-sm font-medium">Atrás</span>
        </button>
        <button
          onClick={handleNext}
          className="flex-1 bg-gradient-to-r from-amaq-700 to-amaq-500 hover:from-amaq-600 hover:to-amaq-400 text-white font-bold py-2.5 px-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
        >
          <span className="text-sm">
            {currentQuestionIndex === questions.length - 1 ? 'Finalizar' : 'Siguiente'}
          </span>
          <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
