import React from 'react'
import { STEPS_CONFIG, ROTODYNAMIC_STEPS_CONFIG, CONTRATO_MARCO_STEPS_CONFIG } from '../utils/constants'
import Header from '../components/Header'
import StepIndicator from '../components/StepIndicator'
import ClientForm from '../components/ClientForm'
import EquipmentForm from '../components/EquipmentForm'
import OperationalForm from '../components/OperationalForm'
import BenchmarkForm from '../components/BenchmarkForm'
import FinancialForm from '../components/FinancialForm'
import NavigationButtons from '../components/NavigationButtons'
import ResultsDashboard from './ResultsDashboard'
import RotodynamicForm from '../components/RotodynamicForm'
import RotodynamicBenchmarkForm from '../components/RotodynamicBenchmarkForm'
import { calculateAll, calculateAllContratoMarco } from '../utils/calculations'
import { calculateAllRotodynamic } from '../utils/calculationsRotodynamic'
import { downloadHTML } from '../utils/htmlExporter'
import ServiceValueForm from '../components/ServiceValueForm'
import ContractValueForm from '../components/ContractValueForm'

export default function FormWizard({
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
  nextStep,
  prevStep,
  getCompleteData,
  getInvestment,
  onGoHome
}) {
  const [results, setResults] = React.useState(null)
  const [showResults, setShowResults] = React.useState(false)

  const isProduct = formData.calculationType === 'product'
  const isService = formData.calculationType === 'service'
  const isRotodynamic = formData.serviceType === 'rotodinamico'
  const isContratoMarco = isService && formData.serviceType === 'contrato_marco'

  const handleCalculate = () => {
    const data = getCompleteData()
    let calcResults
    if (isRotodynamic) {
      calcResults = calculateAllRotodynamic(data)
    } else if (isContratoMarco) {
      calcResults = calculateAllContratoMarco(data)
    } else {
      calcResults = calculateAll(data)
    }
    setResults(calcResults)
    setShowResults(true)
  }

  const handleBackToForm = () => {
    setShowResults(false)
  }

  const handleExportHTML = () => {
    const companyName = formData.client?.companyName || 'cliente'
    const date = new Date().toISOString().slice(0, 10)
    const filename = `reporte_roi_${companyName.replace(/\s+/g, '_')}_${date}.html`
    downloadHTML(formData, results, filename)
  }

  const handleNext = () => {
    if (isProduct) {
      if (currentStep === 3) {
        handleCalculate()
      } else if (currentStep === 4) {
        nextStep()
      } else {
        nextStep()
      }
    } else if (isRotodynamic) {
      if (currentStep === 2) {
        nextStep()
      } else if (currentStep === 3) {
        handleCalculate()
      } else {
        nextStep()
      }
    } else if (isContratoMarco) {
      if (currentStep === 4) {
        handleCalculate()
      } else {
        nextStep()
      }
    } else {
      if (currentStep === 2) {
        nextStep()
      } else if (currentStep === 3) {
        handleCalculate()
      } else {
        nextStep()
      }
    }
  }

  if (showResults) {
    return (
      <ResultsDashboard
        formData={formData}
        results={results}
        onBack={handleBackToForm}
        onGoHome={onGoHome}
        onExportHTML={handleExportHTML}
      />
    )
  }

  const getStepsConfig = () => {
    if (isRotodynamic) {
      return ROTODYNAMIC_STEPS_CONFIG
    }
    if (isContratoMarco) {
      return CONTRATO_MARCO_STEPS_CONFIG
    }
    if (isService) {
      return [
        { id: 1, title: 'Cliente y Servicio', description: 'Información del cliente y tipo de servicio' },
        { id: 2, title: 'Datos del Servicio', description: 'Parámetros del servicio' },
        { id: 3, title: 'Confirmación', description: 'Revisar información' }
      ]
    }
    return STEPS_CONFIG
  }

  const showEquipmentAndClient = currentStep === 1

  return (
    <div className="min-h-screen bg-navy-50">
      <Header onGoHome={onGoHome} />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {isService && (
          <div className="mb-4 p-3 bg-navy-100 rounded-lg border border-navy-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🔍</span>
              <span className="text-navy-700 font-medium">
                Servicio seleccionado: <strong>
                  {formData.serviceType === 'rotodinamico' ? 'Análisis Rotodinámico' : 'Contrato Marco'}
                </strong>
              </span>
              {formData.currency && (
                <span className="text-navy-500 text-sm ml-2">
                  | Moneda: {formData.currency === 'USD' ? 'USD' : 'COP (Millones)'}
                </span>
              )}
            </div>
            <button
              onClick={() => onGoHome()}
              className="text-sm text-navy-500 hover:text-navy-700 underline"
            >
              Cambiar selección
            </button>
          </div>
        )}
        {isProduct && (
          <div className="mb-4 p-3 bg-navy-100 rounded-lg border border-navy-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">📦</span>
              <span className="text-navy-700 font-medium">
                Producto seleccionado: <strong>Colectores de Vibración</strong>
              </span>
            </div>
            <button
              onClick={() => onGoHome()}
              className="text-sm text-navy-500 hover:text-navy-700 underline"
            >
              Cambiar selección
            </button>
          </div>
        )}
        <StepIndicator currentStep={currentStep} steps={getStepsConfig()} />

        <div className="mt-6">
          {showEquipmentAndClient && (
            <div className="space-y-6">
              <ClientForm data={formData.client} onChange={updateClient} />
              {isProduct && <EquipmentForm data={formData.equipment} onChange={updateEquipment} />}
              {isService && isRotodynamic && (
                <ServiceValueForm
                  serviceType={formData.serviceType}
                  currency={formData.currency}
                  serviceValue={formData.rotodynamic?.serviceValue}
                  onChange={(field, value) => {
                    if (field === 'serviceValue') {
                      updateRotodynamic(field, value)
                    }
                  }}
                />
              )}
              {isService && isContratoMarco && (
                <ContractValueForm
                  currency={formData.currency}
                  annualContractValue={formData.contratoMarco?.annualContractValue}
                  inflationRate={formData.contratoMarco?.inflationRate}
                  onChange={updateContratoMarco}
                />
              )}
              {isService && !isRotodynamic && !isContratoMarco && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <p className="text-navy-600">
                    Selecciona un tipo de servicio para continuar.
                  </p>
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && isProduct && (
            <OperationalForm data={formData.operational} onChange={updateOperational} />
          )}

          {currentStep === 2 && isService && isRotodynamic && (
            <RotodynamicForm
              data={formData.rotodynamic}
              onChange={updateRotodynamic}
              currency={formData.currency}
            />
          )}

          {currentStep === 2 && isService && isContratoMarco && (
            <OperationalForm data={formData.operational} onChange={updateOperational} />
          )}

          {currentStep === 3 && isProduct && (
            <BenchmarkForm data={formData.benchmarks} onChange={updateBenchmarks} />
          )}

          {currentStep === 3 && isService && isRotodynamic && (
            <RotodynamicBenchmarkForm
              benchmarks={formData.rotodynamicBenchmarks}
              onChange={updateRotodynamicBenchmarks}
            />
          )}

          {currentStep === 3 && isService && isContratoMarco && (
            <BenchmarkForm data={formData.benchmarks} onChange={updateBenchmarks} />
          )}

          {currentStep === 4 && isProduct && (
            <FinancialForm data={formData.financial} onChange={updateFinancial} />
          )}

          {currentStep === 4 && isService && isRotodynamic && (
            <FinancialForm data={formData.financial} onChange={updateFinancial} />
          )}

          {currentStep === 4 && isService && isContratoMarco && (
            <FinancialForm
              data={formData.financial}
              onChange={updateFinancial}
              isContratoMarco={true}
              inflationRate={formData.contratoMarco?.inflationRate}
              onInflationChange={updateContratoMarco}
            />
          )}

          {currentStep === 5 && isService && isContratoMarco && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-navy-900 mb-4">Resumen del Contrato Marco</h2>
              <p className="text-navy-600">
                Revisa la información y haz clic en "Calcular ROI" para ver los resultados.
              </p>
            </div>
          )}
        </div>

        <NavigationButtons
          onPrev={prevStep}
          onNext={handleNext}
          showPrev={currentStep > 1}
          showNext={currentStep < (isProduct ? 4 : isRotodynamic ? 4 : isContratoMarco ? 5 : 3)}
          showCalculate={currentStep === (isProduct ? 4 : isRotodynamic ? 3 : isContratoMarco ? 4 : 3) && isService}
          nextLabel={currentStep === (isProduct ? 4 : isRotodynamic ? 3 : isContratoMarco ? 4 : 3) && isService ? 'Calcular ROI' : 'Siguiente'}
        />
      </div>
    </div>
  )
}