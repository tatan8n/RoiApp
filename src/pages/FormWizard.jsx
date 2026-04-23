import React from 'react'
import { STEPS_CONFIG, ROTODYNAMIC_STEPS_CONFIG } from '../utils/constants'
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
import { calculateAll } from '../utils/calculations'
import { calculateAllRotodynamic } from '../utils/calculationsRotodynamic'
import { downloadHTML } from '../utils/htmlExporter'
import ServiceValueForm from '../components/ServiceValueForm'

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

  const handleCalculate = () => {
    const data = getCompleteData()
    let calcResults
    if (isRotodynamic) {
      calcResults = calculateAllRotodynamic(data)
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
    } else {
      if (isRotodynamic) {
        if (currentStep === 2) {
          nextStep()
        } else if (currentStep === 3) {
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
        <StepIndicator currentStep={currentStep} steps={getStepsConfig()} />

        <div className="mt-6">
          {showEquipmentAndClient && (
            <div className="space-y-6">
              <ClientForm data={formData.client} onChange={updateClient} />
              {isProduct && <EquipmentForm data={formData.equipment} onChange={updateEquipment} />}
              {isService && (
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

          {currentStep === 2 && isService && !isRotodynamic && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-navy-900 mb-4">Datos del Servicio</h2>
              <p className="text-navy-600">
                La metodología de preguntas para este servicio está en desarrollo.
              </p>
            </div>
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

          {currentStep === 3 && isService && !isRotodynamic && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-navy-900 mb-4">Confirmación</h2>
              <p className="text-navy-600">
                Revise la información del servicio y continúe.
              </p>
            </div>
          )}

          {currentStep === 4 && isProduct && (
            <FinancialForm data={formData.financial} onChange={updateFinancial} />
          )}

          {currentStep === 4 && isService && isRotodynamic && (
            <FinancialForm data={formData.financial} onChange={updateFinancial} />
          )}
        </div>

        <NavigationButtons
          onPrev={prevStep}
          onNext={handleNext}
          showPrev={currentStep > 1}
          showNext={currentStep < (isProduct ? 4 : isRotodynamic ? 4 : 3)}
          showCalculate={currentStep === (isProduct ? 4 : isRotodynamic ? 3 : 3) && isService}
          nextLabel={currentStep === (isProduct ? 4 : isRotodynamic ? 3 : 3) && isService ? 'Calcular ROI' : 'Siguiente'}
        />
      </div>
    </div>
  )
}