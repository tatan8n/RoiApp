import React from 'react'
import FormWizard from './pages/FormWizard'
import InitialSelector from './components/InitialSelector'
import { useFormData } from './hooks/useFormData'

function App() {
  const {
    formData,
    currentStep,
    updateClient,
    updateEquipment,
    updateOperational,
    updateBenchmarks,
    updateRotodynamicBenchmarks,
    updateFinancial,
    updateCalculationType,
    updateServiceType,
    updateCurrency,
    updateRotodynamic,
    nextStep,
    prevStep,
    getCompleteData,
    getInvestment,
    resetForm
  } = useFormData()

  const [showSelector, setShowSelector] = React.useState(true)

  const handleContinueFromSelector = () => {
    setShowSelector(false)
  }

  const handleGoHome = () => {
    setShowSelector(true)
    resetForm()
  }

  if (showSelector) {
    return (
      <InitialSelector
        calculationType={formData.calculationType}
        serviceType={formData.serviceType}
        currency={formData.currency}
        onCalculationTypeChange={updateCalculationType}
        onServiceTypeChange={updateServiceType}
        onCurrencyChange={updateCurrency}
        onContinue={handleContinueFromSelector}
      />
    )
  }

  return (
    <FormWizard
      formData={formData}
      currentStep={currentStep}
      updateClient={updateClient}
      updateEquipment={updateEquipment}
      updateOperational={updateOperational}
      updateBenchmarks={updateBenchmarks}
      updateRotodynamicBenchmarks={updateRotodynamicBenchmarks}
      updateFinancial={updateFinancial}
      updateRotodynamic={updateRotodynamic}
      nextStep={nextStep}
      prevStep={prevStep}
      getCompleteData={getCompleteData}
      getInvestment={getInvestment}
      onGoHome={handleGoHome}
    />
  )
}

export default App