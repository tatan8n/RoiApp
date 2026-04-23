import { useState, useCallback } from 'react'
import { EQUIPMENT_MODELS, DEFAULT_BENCHMARKS, DEFAULT_FINANCIAL_PARAMS, SERVICE_TYPES } from '../utils/constants'

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
      serviceType: type === 'service' ? prev.serviceType || 'rotodinamico' : null
    }))
  }, [])

  const updateServiceType = useCallback((serviceType) => {
    setFormData(prev => ({
      ...prev,
      serviceType
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
    if (formData.equipment.customPrice && formData.equipment.customPrice > 0) {
      return formData.equipment.customPrice * 1_000_000
    }
    const model = EQUIPMENT_MODELS.find(m => m.id === formData.equipment.modelId)
    return model ? model.price : 0
  }, [formData.equipment])

  const getCompleteData = useCallback(() => {
    return {
      investment: getInvestment(),
      ...formData.operational,
      benchmarks: formData.benchmarks,
      discountRate: formData.financial.discountRate,
      projectionYears: formData.financial.projectionYears
    }
  }, [formData, getInvestment])

  return {
    formData,
    currentStep,
    updateClient,
    updateEquipment,
    updateOperational,
    updateBenchmarks,
    updateFinancial,
    updateCustomWeights,
    updateCalculationType,
    updateServiceType,
    nextStep,
    prevStep,
    goToStep,
    resetForm,
    getInvestment,
    getCompleteData
  }
}