import { useState, useCallback } from 'react'
import { EQUIPMENT_MODELS, DEFAULT_BENCHMARKS, DEFAULT_FINANCIAL_PARAMS, SERVICE_TYPES, ROTODYNAMIC_BENCHMARKS } from '../utils/constants'

const initialFormData = {
  client: {
    companyName: '',
    sector: '',
    contactName: '',
    position: '',
    phoneEmail: '',
    evaluationDate: new Date().toISOString().split('T')[0]
  },
  equipment: {
    modelId: 'va3pro',
    customPrice: null
  },
  calculationType: 'product',
  serviceType: null,
  currency: 'COP',
  rotodynamic: {
    serviceValue: null,
    numTurbines: null,
    technology: '',
    nominalCapacity: null,
    yearsOfOperation: null,
    costPerHourStop: null,
    criticalFailures: null,
    avgStopDuration: null,
    mttr: null,
    externalInterventionCost: null,
    reactiveManHours: null,
    internalLaborCost: null,
    billingAffected: null,
    sparePartsDelay: null,
    heatRateDesign: null,
    heatRateActual: null,
    fuelCost: null
  },
  operational: {
    totalAssets: null,
    criticalAssets: null,
    avgCriticalAssetValue: null,
    costPerHourStop: null,
    unplannedFailures: null,
    avgStopDuration: null,
    correctiveExternalCost: null,
    correctiveExternalCount: null,
    reactiveManHours: null,
    technicianMonthlySalary: null,
    sparePartsDelay: null,
    sparePartsInventoryCost: null,
    scheduledStopHours: null,
    scheduledStopCost: null,
    monthlyBilling: null,
    preventiveMaintenanceCost: null,
    unnecessaryPreventivePercentage: null,
    inducedFailureCost: null,
    annualEnergyCost: null
  },
  benchmarks: { ...DEFAULT_BENCHMARKS },
  rotodynamicBenchmarks: { ...ROTODYNAMIC_BENCHMARKS },
  financial: { ...DEFAULT_FINANCIAL_PARAMS },
  customWeights: null
}

export function useFormData() {
  const [formData, setFormData] = useState(initialFormData)
  const [currentStep, setCurrentStep] = useState(1)

  const updateClient = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      client: { ...prev.client, [field]: value }
    }))
  }, [])

  const updateEquipment = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      equipment: { ...prev.equipment, [field]: value }
    }))
  }, [])

  const updateOperational = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      operational: { ...prev.operational, [field]: value === '' ? null : value }
    }))
  }, [])

  const updateBenchmarks = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      benchmarks: { ...prev.benchmarks, [field]: value }
    }))
  }, [])

  const updateRotodynamicBenchmarks = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      rotodynamicBenchmarks: { ...prev.rotodynamicBenchmarks, [field]: value }
    }))
  }, [])

  const updateFinancial = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      financial: { ...prev.financial, [field]: value }
    }))
  }, [])

  const updateCustomWeights = useCallback((weights) => {
    setFormData(prev => ({
      ...prev,
      customWeights: weights
    }))
  }, [])

  const updateCalculationType = useCallback((type) => {
    setFormData(prev => ({
      ...prev,
      calculationType: type,
      serviceType: type === 'service' ? prev.serviceType || 'rotodinamico' : null,
      currentStep: 1
    }))
  }, [])

  const updateServiceType = useCallback((serviceType) => {
    setFormData(prev => ({
      ...prev,
      serviceType
    }))
  }, [])

  const updateCurrency = useCallback((currency) => {
    setFormData(prev => ({
      ...prev,
      currency
    }))
  }, [])

  const updateRotodynamic = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      rotodynamic: { ...prev.rotodynamic, [field]: value === '' ? null : value }
    }))
  }, [])

  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, 4))
  }, [])

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }, [])

  const goToStep = useCallback((step) => {
    if (step >= 1 && step <= 4) {
      setCurrentStep(step)
    }
  }, [])

  const resetForm = useCallback(() => {
    setFormData(initialFormData)
    setCurrentStep(1)
  }, [])

  const getInvestment = useCallback(() => {
    if (formData.calculationType === 'product') {
      if (formData.equipment.customPrice && formData.equipment.customPrice > 0) {
        return formData.equipment.customPrice * 1_000_000
      }
      const model = EQUIPMENT_MODELS.find(m => m.id === formData.equipment.modelId)
      return model ? model.price : 0
    } else {
      return formData.rotodynamic.serviceValue || 0
    }
  }, [formData.equipment, formData.rotodynamic.serviceValue, formData.calculationType])

  const getCompleteData = useCallback(() => {
    if (formData.calculationType === 'product') {
      return {
        investment: getInvestment(),
        ...formData.operational,
        benchmarks: formData.benchmarks,
        discountRate: formData.financial.discountRate,
        projectionYears: formData.financial.projectionYears
      }
    } else {
      return {
        investment: formData.rotodynamic.serviceValue || 0,
        currency: formData.currency,
        ...formData.rotodynamic,
        benchmarks: formData.rotodynamicBenchmarks,
        discountRate: formData.financial.discountRate,
        projectionYears: formData.financial.projectionYears,
        billing: formData.rotodynamic.billingAffected
      }
    }
  }, [formData, getInvestment])

  return {
    formData,
    currentStep,
    updateClient,
    updateEquipment,
    updateOperational,
    updateBenchmarks,
    updateRotodynamicBenchmarks,
    updateFinancial,
    updateCustomWeights,
    updateCalculationType,
    updateServiceType,
    updateCurrency,
    updateRotodynamic,
    nextStep,
    prevStep,
    goToStep,
    resetForm,
    getInvestment,
    getCompleteData
  }
}