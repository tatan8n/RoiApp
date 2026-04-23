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
import { calculateAll } from '../utils/calculations'
import { downloadPDF } from '../utils/pdfGenerator'

export default function FormWizard({ formData, currentStep, updateClient, updateEquipment, updateOperational, updateBenchmarks, updateFinancial, nextStep, prevStep, getCompleteData, getInvestment }) {
  const [results, setResults] = React.useState(null)
  const [showResults, setShowResults] = React.useState(false)

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

  const handleNext = () => {
    if (currentStep === 3) {
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

  return (
    <div className="min-h-screen bg-navy-50">
      <Header />
      
      <div className="max-w-5xl mx-auto px-4 py-8">
        <StepIndicator currentStep={currentStep} steps={STEPS_CONFIG} />
        
        <div className="mt-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              <ClientForm data={formData.client} onChange={updateClient} />
              <EquipmentForm data={formData.equipment} onChange={updateEquipment} />
            </div>
          )}
          
          {currentStep === 2 && (
            <OperationalForm data={formData.operational} onChange={updateOperational} />
          )}
          
          {currentStep === 3 && (
            <BenchmarkForm data={formData.benchmarks} onChange={updateBenchmarks} />
          )}
          
          {currentStep === 4 && (
            <FinancialForm data={formData.financial} onChange={updateFinancial} />
          )}
        </div>

        <NavigationButtons
          onPrev={prevStep}
          onNext={handleNext}
          showPrev={currentStep > 1}
          showNext={currentStep < 4}
          showCalculate={currentStep === 4}
          nextLabel={currentStep === 3 ? 'Calcular ROI' : 'Siguiente'}
        />
      </div>
    </div>
  )
}