import { useState, useCallback } from 'react'
import { EQUIPMENT_MODELS, DEFAULT_BENCHMARKS, DEFAULT_FINANCIAL_PARAMS, SERVICE_TYPES, ROTODYNAMIC_BENCHMARKS, DEFAULT_INFLATION_RATE } from '../utils/constants'

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
    modelId: null,
    customPrice: null
  },
  calculationType: 'product',
  serviceType: null,
  currency: 'COP',
  rotodynamic: {
    serviceValue: null,
    turbineType: null,
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
  contratoMarco: {
    annualContractValue: null,
    inflationRate: DEFAULT_INFLATION_RATE
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
      equipment: type === 'product' ? { modelId: null, customPrice: null } : prev.equipment,
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

  const updateContratoMarco = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      contratoMarco: { ...prev.contratoMarco, [field]: value === '' ? null : value }
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

  const isContratoMarco = formData.calculationType === 'service' && formData.serviceType === 'contrato_marco'

  const getInvestment = useCallback(() => {
    if (formData.calculationType === 'product') {
      if (formData.equipment.customPrice && formData.equipment.customPrice > 0) {
        return formData.equipment.customPrice * 1_000_000
      }
      const model = EQUIPMENT_MODELS.find(m => m.id === formData.equipment.modelId)
      return model ? model.price : 0
    } else if (isContratoMarco) {
      const val = formData.contratoMarco.annualContractValue
      return val && val > 0 ? (formData.currency === 'COP' ? val * 1_000_000 : val) : 0
    } else {
      return formData.rotodynamic.serviceValue || 0
    }
  }, [formData.equipment, formData.rotodynamic.serviceValue, formData.contratoMarco, formData.calculationType, formData.currency, isContratoMarco])

  const getCompleteData = useCallback(() => {
    if (formData.calculationType === 'product') {
      return {
        investment: getInvestment(),
        ...formData.operational,
        benchmarks: formData.benchmarks,
        discountRate: formData.financial.discountRate,
        projectionYears: formData.financial.projectionYears
      }
    } else if (isContratoMarco) {
      const annualContractValueMM = formData.contratoMarco.annualContractValue
      const annualContractValueFull = annualContractValueMM && annualContractValueMM > 0
        ? (formData.currency === 'COP' ? annualContractValueMM * 1_000_000 : annualContractValueMM)
        : 0
      return {
        investment: annualContractValueFull,
        currency: formData.currency,
        ...formData.operational,
        benchmarks: formData.benchmarks,
        discountRate: formData.financial.discountRate,
        projectionYears: formData.financial.projectionYears,
        annualContractValue: annualContractValueFull,
        inflationRate: formData.contratoMarco.inflationRate,
        billing: formData.operational.monthlyBilling ? formData.operational.monthlyBilling * 12 : null
      }
    } else {
      const isCOP = formData.currency === 'COP'
      const toFull = (val) => (val !== null && val !== undefined && isCOP) ? val * 1_000_000 : (val || 0)

      const rotodynamicData = formData.rotodynamic
      const serviceValueFull = rotodynamicData.serviceValue != null
        ? (isCOP ? rotodynamicData.serviceValue * 1_000_000 : rotodynamicData.serviceValue)
        : 0

      return {
        investment: serviceValueFull,
        currency: formData.currency,
        numTurbines: rotodynamicData.numTurbines,
        turbineType: rotodynamicData.turbineType,
        nominalCapacity: rotodynamicData.nominalCapacity,
        yearsOfOperation: rotodynamicData.yearsOfOperation,
        technology: rotodynamicData.technology,
        costPerHourStop: toFull(rotodynamicData.costPerHourStop),
        criticalFailures: rotodynamicData.criticalFailures,
        avgStopDuration: rotodynamicData.avgStopDuration,
        mttr: rotodynamicData.mttr,
        externalInterventionCost: toFull(rotodynamicData.externalInterventionCost),
        reactiveManHours: rotodynamicData.reactiveManHours,
        internalLaborCost: toFull(rotodynamicData.internalLaborCost),
        billingAffected: toFull(rotodynamicData.billingAffected),
        sparePartsDelay: rotodynamicData.sparePartsDelay,
        heatRateDesign: rotodynamicData.heatRateDesign,
        heatRateActual: rotodynamicData.heatRateActual,
        fuelCost: toFull(rotodynamicData.fuelCost),
        benchmarks: formData.rotodynamicBenchmarks,
        discountRate: formData.financial.discountRate,
        projectionYears: formData.financial.projectionYears,
        billing: toFull(rotodynamicData.billingAffected)
      }
    }
  }, [formData, getInvestment, isContratoMarco])

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
    updateContratoMarco,
    nextStep,
    prevStep,
    goToStep,
    resetForm,
    getInvestment,
    getCompleteData
  }
}