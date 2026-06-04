import React from 'react'
import { STEPS_CONFIG, ROTODYNAMIC_STEPS_CONFIG, CONTRATO_MARCO_STEPS_CONFIG } from '../utils/constants'
import Header from '../components/Header'
import { DocumentCheckIcon, CubeIcon, SaveIcon } from '../components/Icons'
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
import SaveModal from '../components/SaveModal'
import AIAssistant from '../components/AIAssistant'
import { SparklesIcon } from '../components/Icons'
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
  applyInferredFields,
  nextStep,
  prevStep,
  getCompleteData,
  getInvestment,
  getFormCompletion,
  onGoHome,
  onSaveAnalysis,
  pendingResults,
  setPendingResults
}) {
  const [results, setResults] = React.useState(null)
  const [showResults, setShowResults] = React.useState(false)
  const [showAssistant, setShowAssistant] = React.useState(false)
  // Inicializa el horizonte del slider de resultados a partir del valor elegido por el
  // usuario en el formulario financiero (antes estaba fijo en 24 meses = 2 años, lo que
  // ignoraba la selección del usuario).
  const [horizonOverride, setHorizonOverride] = React.useState((formData.financial?.projectionYears || 5) * 12)
  const [showSaveModal, setShowSaveModal] = React.useState(false)

  const isProduct = formData.calculationType === 'product'
  const isService = formData.calculationType === 'service'
  const isRotodynamic = formData.serviceType === 'rotodinamico'
  const isContratoMarco = isService && formData.serviceType === 'contrato_marco'

  React.useEffect(() => {
    if (pendingResults) {
      setResults(pendingResults)
      setShowResults(true)
      setPendingResults && setPendingResults(null)
    }
  }, [])

  const handleCalculate = () => {
    const baseData = getCompleteData()
    let calcResults

    if (isContratoMarco) {
      calcResults = calculateAllContratoMarco(baseData)
    } else {
      // El horizonte de proyección lo define el usuario en el formulario financiero.
      const projectionYears = formData.financial?.projectionYears || 5
      setHorizonOverride(projectionYears * 12)
      const data = { ...baseData, projectionYears }
      if (isRotodynamic) {
        calcResults = calculateAllRotodynamic(data)
      } else {
        calcResults = calculateAll(data)
      }
    }
    setResults(calcResults)
    setShowResults(true)
  }

  const handleBackToForm = () => {
    setShowResults(false)
  }

  const handleHorizonChange = (horizonMonths) => {
    setHorizonOverride(horizonMonths)
    if (results) {
      const projectionYears = Math.max(1, Math.floor(horizonMonths / 12))
      const baseData = getCompleteData()
      let calcResults
      if (isContratoMarco) {
        calcResults = calculateAllContratoMarco({ ...baseData, projectionYears })
      } else if (isRotodynamic) {
        calcResults = calculateAllRotodynamic({ ...baseData, projectionYears })
      } else {
        calcResults = calculateAll({ ...baseData, projectionYears })
      }
      setResults(calcResults)
    }
  }

  const handleExportHTML = async () => {
    const companyName = formData.client?.companyName || 'cliente'
    const date = new Date().toISOString().slice(0, 10)
    const filename = `reporte_roi_${companyName.replace(/\s+/g, '_')}_${date}.html`
    await downloadHTML(formData, results, filename)
  }

  const handleNext = () => {
    if (currentStep === 4) {
      handleCalculate()
    } else {
      nextStep()
    }
  }

  if (showResults) {
    return (
      <>
        <ResultsDashboard
          formData={formData}
          results={results}
          onBack={handleBackToForm}
          onGoHome={onGoHome}
          onExportHTML={handleExportHTML}
          onHorizonChange={handleHorizonChange}
          onOpenSaveModal={() => setShowSaveModal(true)}
        />
        <SaveModal
          isOpen={showSaveModal}
          onClose={() => setShowSaveModal(false)}
          onSave={(name) => {
            const result = onSaveAnalysis && onSaveAnalysis(name)
            if (result) setShowSaveModal(false)
          }}
          defaultName={formData.client?.contactName || ''}
        />
      </>
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
    <div className="min-h-screen bg-slate-50">
      <Header onGoHome={onGoHome} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6 items-start">
        <div className="flex-1 min-w-0 w-full max-w-6xl mx-auto">
        <div className="mb-4 flex justify-end">
          <button
            onClick={() => setShowAssistant(s => !s)}
            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all border-2 ${
              showAssistant
                ? 'bg-amaq-600 text-white border-amaq-600 shadow-md'
                : 'bg-white text-amaq-700 border-amaq-500/40 hover:bg-amaq-50 hover:border-amaq-500'
            }`}
          >
            <SparklesIcon className="w-4 h-4" />
            <span>{showAssistant ? 'Ocultar Asistente IA' : 'Llenar con Asistente IA'}</span>
          </button>
        </div>
        {isService && (
          <div className="mb-6 p-4 glass-panel flex flex-col sm:flex-row items-center justify-between gap-4 animate-slide-up">
            <div className="flex flex-wrap items-center gap-3">
              <DocumentCheckIcon className="w-5 h-5 text-amaq-700 shrink-0" />
              <span className="text-slate-900 font-medium tracking-wide">
                Servicio: <strong className="text-amaq-700">
                  {formData.serviceType === 'rotodinamico' ? 'Análisis Rotodinámico' : 'Contrato Marco'}
                </strong>
              </span>
              {formData.currency && (
                <span className="text-slate-600 text-sm ml-2 px-3 py-1 bg-slate-50/50 rounded-full border border-slate-200 font-medium">
                  Moneda: <span className="text-amaq-700 font-bold">{formData.currency === 'USD' ? 'USD' : 'COP (Millones)'}</span>
                </span>
              )}
            </div>
            <button
              onClick={() => setShowSaveModal(true)}
              className="px-4 py-2 rounded-lg text-sm font-bold text-amaq-700 bg-white border-2 border-amaq-500/40 hover:bg-amaq-50 hover:border-amaq-500 transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <SaveIcon className="w-4 h-4" />
              <span>Guardar análisis</span>
            </button>
          </div>
        )}
        {isProduct && (
          <div className="mb-6 p-4 glass-panel flex flex-col sm:flex-row items-center justify-between gap-4 animate-slide-up">
            <div className="flex items-center gap-3">
              <CubeIcon className="w-5 h-5 text-amaq-700 shrink-0" />
              <span className="text-slate-900 font-medium tracking-wide">
                Producto: <strong className="text-amaq-700">Colectores de Vibración</strong>
              </span>
            </div>
            <button
              onClick={() => setShowSaveModal(true)}
              className="px-4 py-2 rounded-lg text-sm font-bold text-amaq-700 bg-white border-2 border-amaq-500/40 hover:bg-amaq-50 hover:border-amaq-500 transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <SaveIcon className="w-4 h-4" />
              <span>Guardar análisis</span>
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
                  onChange={(field, value) => updateRotodynamic(field, value)}
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
                <div className="glass-panel p-6 text-center">
                  <p className="text-slate-500 text-lg">
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
            <div className="glass-panel p-8 text-center animate-fade-in">
              <h2 className="text-2xl font-black text-amaq-700 mb-4">Resumen del Contrato Marco</h2>
              <p className="text-slate-500 text-lg">
                Todos los datos han sido recopilados. Haz clic en "Calcular ROI" para visualizar las proyecciones.
              </p>
            </div>
          )}
        </div>

        <NavigationButtons
          onPrev={prevStep}
          onNext={handleNext}
          showPrev={currentStep > 1}
          showNext={currentStep <= 4}
          nextLabel={currentStep === 4 ? 'Calcular ROI' : 'Siguiente'}
        />
        </div>
        {showAssistant && (
          <AIAssistant
            formData={formData}
            calculationType={formData.calculationType}
            serviceType={formData.serviceType}
            applyInferredFields={applyInferredFields}
            onClose={() => setShowAssistant(false)}
          />
        )}
        </div>
      </div>

      <SaveModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={(name) => {
          const result = onSaveAnalysis && onSaveAnalysis(name)
          if (result) setShowSaveModal(false)
        }}
        defaultName={formData.client?.contactName || ''}
      />
    </div>
  )
}
