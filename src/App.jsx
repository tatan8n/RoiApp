import React from 'react'
import FormWizard from './pages/FormWizard'
import InitialSelector from './components/InitialSelector'
import Toast from './components/Toast'
import { useFormData } from './hooks/useFormData'
import {
  getAllAnalyses,
  saveAnalysis as persistAnalysis,
  deleteAnalysis as removeAnalysis,
  clearAllAnalyses as wipeAllAnalyses
} from './utils/analysisStorage'

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
    updateContratoMarco,
    nextStep,
    prevStep,
    getCompleteData,
    getInvestment,
    getFormCompletion,
    resetForm,
    loadAnalysis
  } = useFormData()

  const [showSelector, setShowSelector] = React.useState(true)
  const [analyses, setAnalyses] = React.useState([])
  const [showAnalysesList, setShowAnalysesList] = React.useState(false)
  const [toast, setToast] = React.useState({ message: '', type: 'success' })
  const [pendingResults, setPendingResults] = React.useState(null)

  React.useEffect(() => {
    setAnalyses(getAllAnalyses())
  }, [])

  const refreshAnalyses = () => {
    setAnalyses(getAllAnalyses())
  }

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
  }

  const handleContinueFromSelector = () => {
    setShowSelector(false)
  }

  const handleGoHome = () => {
    setShowSelector(true)
    setPendingResults(null)
    resetForm()
  }

  const handleSaveAnalysis = (analystName) => {
    try {
      const analysis = persistAnalysis({
        analystName,
        formData,
        results: pendingResults,
        currentStep,
        calculationType: formData.calculationType,
        serviceType: formData.serviceType,
        currency: formData.currency
      })
      refreshAnalyses()
      setShowAnalysesList(true)
      showToast(`Análisis de ${analystName} guardado correctamente`)
      return analysis
    } catch (err) {
      showToast(err.message || 'No se pudo guardar el análisis', 'error')
      return null
    }
  }

  const handleOpenAnalysis = (analysis) => {
    loadAnalysis(analysis)
    setPendingResults(analysis.results || null)
    setShowSelector(false)
    showToast(`Análisis de ${analysis.analystName} cargado`)
  }

  const handleDeleteAnalysis = (id) => {
    removeAnalysis(id)
    refreshAnalyses()
    showToast('Análisis eliminado', 'success')
  }

  const handleClearAllAnalyses = () => {
    wipeAllAnalyses()
    refreshAnalyses()
    setShowAnalysesList(false)
    showToast('Todos los análisis fueron eliminados', 'success')
  }

  if (showSelector) {
    return (
      <>
        <InitialSelector
          calculationType={formData.calculationType}
          serviceType={formData.serviceType}
          currency={formData.currency}
          onCalculationTypeChange={updateCalculationType}
          onServiceTypeChange={updateServiceType}
          onCurrencyChange={updateCurrency}
          onContinue={handleContinueFromSelector}
          analyses={analyses}
          showAnalysesList={showAnalysesList}
          onToggleAnalysesList={() => setShowAnalysesList(v => !v)}
          onOpenAnalysis={handleOpenAnalysis}
          onDeleteAnalysis={handleDeleteAnalysis}
          onClearAllAnalyses={handleClearAllAnalyses}
        />
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: 'success' })}
        />
      </>
    )
  }

  return (
    <>
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
        updateContratoMarco={updateContratoMarco}
        nextStep={nextStep}
        prevStep={prevStep}
        getCompleteData={getCompleteData}
        getInvestment={getInvestment}
        getFormCompletion={getFormCompletion}
        onGoHome={handleGoHome}
        onSaveAnalysis={handleSaveAnalysis}
        pendingResults={pendingResults}
        setPendingResults={setPendingResults}
      />
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />
    </>
  )
}

export default App
