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
    updateFinancial,
    updateCalculationType,
    updateServiceType,
    nextStep,
    prevStep,
    getCompleteData,
    getInvestment
  } = useFormData()

  const [showSelector, setShowSelector] = React.useState(true)

  const handleContinueFromSelector = () => {
    setShowSelector(false)
  }

  if (showSelector) {
    return (
      <InitialSelector
        calculationType={formData.calculationType}
        serviceType={formData.serviceType}
        onCalculationTypeChange={updateCalculationType}
        onServiceTypeChange={updateServiceType}
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
      updateFinancial={updateFinancial}
      nextStep={nextStep}
      prevStep={prevStep}
      getCompleteData={getCompleteData}
      getInvestment={getInvestment}
    />
  )
}

export default App
