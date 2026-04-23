import React from 'react'
import FormWizard from './pages/FormWizard'
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
    nextStep,
    prevStep,
    getCompleteData,
    getInvestment
  } = useFormData()

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