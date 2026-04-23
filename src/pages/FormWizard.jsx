import React from 'react'
import { STEPS_CONFIG } from '../utils/constants'
import Header from '../components/Header'
import StepIndicator from '../components/StepIndicator'
import ClientForm from '../components/ClientForm'
import EquipmentForm from '../components/EquipmentForm'
import OperationalForm from '../components/OperationalForm'
import BenchmarkForm from '../components/BenchmarkForm'
import FinancialForm from '../components/FinancialForm'
import NavigationButtons from '../components/NavigationButtons'
import ResultsDashboard from './ResultsDashboard'
import AgenteEntrevistador from '../components/AgenteEntrevistador'
import ServicePlaceholder from '../components/ServicePlaceholder'
import { calculateAll } from '../utils/calculations'
import { downloadPDF } from '../utils/pdfGenerator'

export default function FormWizard({ formData, currentStep, updateClient, updateEquipment, updateOperational, updateBenchmarks, updateFinancial, nextStep, prevStep, getCompleteData, getInvestment }) {
  const [results, setResults] = React.useState(null)
  const [showResults, setShowResults] = React.useState(false)

  const isProduct = formData.calculationType === 'product'
  const isService = formData.calculationType === 'service'

  const handleCalculate = () => {
    const data = getCompleteData()
    const calcResults = calculateAll(data)
    setResults(calcResults)
    setShowResults(true)
  }

  const handleBackToForm = () => {
    setShowResults(false)
  }

  const handleExportPDF = () => {
    downloadPDF(formData, results)
  }

  const handleInterviewComplete = (interviewData) => {
    Object.entries(interviewData).forEach(([key, value]) => {
      updateOperational(key, value)
    })
    nextStep()
  }

  const handleNext = () => {
    if (currentStep === 3 && isProduct) {
      handleCalculate()
    } else if (currentStep === 4 && isProduct) {
      nextStep()
    } else if (currentStep === 2 && isService) {
      nextStep()
    } else if (currentStep === 3 && isService) {
      handleCalculate()
    } else {
      nextStep()
    }
  }

  if (showResults) {
    return (
      <ResultsDashboard
        formData={formData}
        results={results}
        onBack={handleBackToForm}
        onExportPDF={handleExportPDF}
      />
    )
  }

  const getStepsConfig = () => {
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
      <Header />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <StepIndicator currentStep={currentStep} steps={getStepsConfig()} />

        <div className="mt-6">
          {showEquipmentAndClient && (
            <div className="space-y-6">
              <ClientForm data={formData.client} onChange={updateClient} />
              {isProduct && <EquipmentForm data={formData.equipment} onChange={updateEquipment} />}
              {isService && <ServicePlaceholder serviceType={formData.serviceType} />}
            </div>
          )}

          {currentStep === 2 && isProduct && (
            <AgenteEntrevistador onComplete={handleInterviewComplete} />
          )}

          {currentStep === 2 && isService && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-navy-900 mb-4">Datos del Servicio</h2>
              <p className="text-navy-600">
                La metodología de preguntas para servicios está en desarrollo.
                Mientras tanto, puede continuar con el proceso manualmente.
              </p>
            </div>
          )}

          {currentStep === 3 && isProduct && (
            <BenchmarkForm data={formData.benchmarks} onChange={updateBenchmarks} />
          )}

          {currentStep === 3 && isService && (
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
        </div>

        <NavigationButtons
          onPrev={prevStep}
          onNext={handleNext}
          showPrev={currentStep > 1}
          showNext={currentStep < 4}
          showCalculate={currentStep === 4 && isProduct}
          nextLabel={currentStep === 4 && isProduct ? 'Calcular ROI' : 'Siguiente'}
        />
      </div>
    </div>
  )
}
