import { DEFAULT_BENCHMARKS } from './constants.js'

const PRESTACIONAL_FACTOR = 1.75
const MONTHLY_WORKING_HOURS = 240
const RISK_COST_FRACTION = 0.02
const MAX_SCHEDULED_SAVINGS_FRACTION = 0.05
const MAX_SAVINGS_OF_REVENUE = 0.15

const MILLIONS_FIELDS = [
  'costPerHourStop',
  'correctiveExternalCost',
  'sparePartsInventoryCost',
  'scheduledStopCost',
  'monthlyBilling',
  'preventiveMaintenanceCost',
  'inducedFailureCost',
  'technicianMonthlySalary',
  'annualEnergyCost',
  'avgCriticalAssetValue'
]

function ensureFullCOP(data) {
  const result = { ...data }
  MILLIONS_FIELDS.forEach(field => {
    if (result[field] !== null && result[field] !== undefined && result[field] > 0) {
      result[field] = result[field] * 1_000_000
    }
  })
  return result
}

export function calculateManHourCost(technicianMonthlySalaryMM) {
  if (!technicianMonthlySalaryMM || technicianMonthlySalaryMM <= 0) return 0
  const salaryFullCOP = technicianMonthlySalaryMM * 1_000_000
  return (salaryFullCOP * PRESTACIONAL_FACTOR) / MONTHLY_WORKING_HOURS
}

export function calculateFactors(data) {
  const convertedData = ensureFullCOP(data)

  let manHourCost = convertedData.manHourCost || 0
  if (!manHourCost && convertedData.technicianMonthlySalary > 0) {
    manHourCost = (convertedData.technicianMonthlySalary * PRESTACIONAL_FACTOR) / MONTHLY_WORKING_HOURS
  }

  const {
    totalAssets = 0,
    criticalAssets = 0,
    avgCriticalAssetValue = 0,
    costPerHourStop = 0,
    unplannedFailures = 0,
    avgStopDuration = 0,
    correctiveExternalCost = 0,
    correctiveExternalCount = 0,
    reactiveManHours = 0,
    sparePartsDelay = 0,
    sparePartsInventoryCost = 0,
    scheduledStopHours = 0,
    scheduledStopCost = 0,
    monthlyBilling = 0,
    preventiveMaintenanceCost = 0,
    unnecessaryPreventivePercentage = 0,
    inducedFailureCost = 0,
    annualEnergyCost = 0,
    benchmarks = DEFAULT_BENCHMARKS
  } = convertedData

  const {
    reductionFailures = DEFAULT_BENCHMARKS.reductionFailures,
    reductionCorrective = DEFAULT_BENCHMARKS.reductionCorrective,
    optimizationHH = DEFAULT_BENCHMARKS.optimizationHH,
    reductionDelays = DEFAULT_BENCHMARKS.reductionDelays,
    reductionScheduledStops = DEFAULT_BENCHMARKS.reductionScheduledStops,
    extensionLife = DEFAULT_BENCHMARKS.extensionLife,
    energySavings = DEFAULT_BENCHMARKS.energySavings,
    riskReduction = DEFAULT_BENCHMARKS.riskReduction,
    reductionPreventive = DEFAULT_BENCHMARKS.reductionPreventive,
    eliminationInducedFailures = DEFAULT_BENCHMARKS.eliminationInducedFailures
  } = benchmarks

  const factors = {
    f1: {
      name: 'Lucro Cesante Evitado',
      description: 'Reducción de pérdidas por paros no planificados',
      baseValue: 0,
      savings: 0,
      answered: false
    },
    f2: {
      name: 'Correctivo Externo Evitado',
      description: 'Reducción de servicios técnicos externos',
      baseValue: 0,
      savings: 0,
      answered: false
    },
    f3: {
      name: 'Optimización HH Reactivo',
      description: 'Reducción de horas-hombre en mantenimiento reactivo (calculado desde salario técnico × factor prestacional 1.75 / 240h)',
      baseValue: 0,
      savings: 0,
      answered: false
    },
    f4: {
      name: 'Inventario y Demoras',
      description: 'Optimización de inventario y reducción de demoras',
      baseValue: 0,
      savings: 0,
      answered: false
    },
    f5: {
      name: 'Paros Programados Evitados',
      description: 'Reducción de producción perdida por mantenimiento',
      baseValue: 0,
      savings: 0,
      answered: false
    },
    f6: {
      name: 'Vida Útil Diferida',
      description: 'Diferimiento de reposición de activos (requiere valor de reposición)',
      baseValue: 0,
      savings: 0,
      answered: false
    },
    f7: {
      name: 'Ahorro Energético',
      description: 'Reducción de consumo por alineación y balanceo (requiere costo anual de energía)',
      baseValue: 0,
      savings: 0,
      answered: false
    },
    f8: {
      name: 'Seguridad y Seguros',
      description: 'Reducción de riesgos y primas de seguro',
      baseValue: 0,
      savings: 0,
      answered: false
    },
    f9: {
      name: 'Preventivos Innecesarios Evitados',
      description: 'Ahorro al eliminar mantenimientos preventivos intrusivos innecesarios',
      baseValue: 0,
      savings: 0,
      answered: false
    },
    f10: {
      name: 'Fallas Inducidas Evitadas',
      description: 'Eliminación del riesgo de fallas por error humano post-intervención',
      baseValue: 0,
      savings: 0,
      answered: false
    }
  }

  if (unplannedFailures !== null && unplannedFailures > 0 && avgStopDuration !== null && avgStopDuration > 0 && costPerHourStop !== null && costPerHourStop > 0) {
    const hoursStopYear = unplannedFailures * avgStopDuration
    factors.f1.baseValue = hoursStopYear * costPerHourStop
    factors.f1.savings = factors.f1.baseValue * reductionFailures
    factors.f1.answered = true
  }

  if (correctiveExternalCost !== null && correctiveExternalCost > 0 && correctiveExternalCount !== null && correctiveExternalCount > 0) {
    factors.f2.baseValue = correctiveExternalCost * correctiveExternalCount
    factors.f2.savings = factors.f2.baseValue * reductionCorrective
    factors.f2.answered = true
  }

  if (reactiveManHours !== null && reactiveManHours > 0 && manHourCost !== null && manHourCost > 0) {
    factors.f3.baseValue = reactiveManHours * 12 * manHourCost
    factors.f3.savings = factors.f3.baseValue * optimizationHH
    factors.f3.answered = true
  }

  if (sparePartsDelay !== null && sparePartsDelay > 0 && costPerHourStop !== null && costPerHourStop > 0 && unplannedFailures !== null && unplannedFailures > 0 && avgStopDuration !== null && avgStopDuration > 0) {
    const delayCost = avgStopDuration * costPerHourStop * unplannedFailures * (sparePartsDelay / 365)
    const inventorySavings = sparePartsInventoryCost * reductionDelays
    factors.f4.baseValue = delayCost + sparePartsInventoryCost
    factors.f4.savings = delayCost * reductionDelays + inventorySavings
    factors.f4.answered = true
  } else if (sparePartsInventoryCost !== null && sparePartsInventoryCost > 0) {
    factors.f4.baseValue = sparePartsInventoryCost
    factors.f4.savings = sparePartsInventoryCost * reductionDelays
    factors.f4.answered = true
  }

  if (scheduledStopHours !== null && scheduledStopHours > 0 && scheduledStopCost !== null && scheduledStopCost > 0) {
    factors.f5.baseValue = scheduledStopHours * scheduledStopCost
    let f5Savings = factors.f5.baseValue * reductionScheduledStops
    if (monthlyBilling !== null && monthlyBilling > 0) {
      const maxF5Savings = monthlyBilling * 12 * MAX_SCHEDULED_SAVINGS_FRACTION
      f5Savings = Math.min(f5Savings, maxF5Savings)
    }
    factors.f5.savings = f5Savings
    factors.f5.answered = true
  }

  if (criticalAssets !== null && criticalAssets > 0 && avgCriticalAssetValue !== null && avgCriticalAssetValue > 0) {
    const annualDeferral = criticalAssets * avgCriticalAssetValue / 15
    factors.f6.baseValue = annualDeferral
    factors.f6.savings = annualDeferral * extensionLife
    factors.f6.answered = true
  }

  if (totalAssets !== null && totalAssets > 0 && annualEnergyCost !== null && annualEnergyCost > 0) {
    factors.f7.baseValue = annualEnergyCost
    factors.f7.savings = annualEnergyCost * energySavings
    factors.f7.answered = true
  }

  if (monthlyBilling !== null && monthlyBilling > 0) {
    const safetySavingsYear = monthlyBilling * 12 * RISK_COST_FRACTION
    factors.f8.baseValue = safetySavingsYear
    factors.f8.savings = safetySavingsYear * riskReduction
    factors.f8.answered = true
  }

  if (preventiveMaintenanceCost !== null && preventiveMaintenanceCost > 0 && unnecessaryPreventivePercentage !== null && unnecessaryPreventivePercentage > 0) {
    factors.f9.baseValue = preventiveMaintenanceCost
    factors.f9.savings = preventiveMaintenanceCost * (unnecessaryPreventivePercentage / 100) * reductionPreventive
    factors.f9.answered = true
  } else if (preventiveMaintenanceCost !== null && preventiveMaintenanceCost > 0) {
    factors.f9.baseValue = preventiveMaintenanceCost
    factors.f9.savings = preventiveMaintenanceCost * 0.35 * reductionPreventive
    factors.f9.answered = true
  }

  if (inducedFailureCost !== null && inducedFailureCost > 0) {
    factors.f10.baseValue = inducedFailureCost
    factors.f10.savings = inducedFailureCost * eliminationInducedFailures
    factors.f10.answered = true
  }

  factors._meta = { manHourCost }

  return factors
}

export function calculateTotalSavings(factors) {
  return Object.values(factors).reduce((total, factor) => {
    return total + (factor.answered ? factor.savings : 0)
  }, 0)
}

export function calculateROI(investment, annualSavings) {
  if (investment <= 0 || annualSavings <= 0) return 0
  return ((annualSavings - investment) / investment) * 100
}

export function calculatePayback(investment, annualSavings) {
  if (annualSavings <= 0) return null
  const paybackMonths = investment / (annualSavings / 12)
  return Math.round(paybackMonths * 10) / 10
}

export function calculateBenefitCostRatio(investment, annualSavings) {
  if (investment <= 0) return 0
  return annualSavings / investment
}

export function calculateVAN(annualSavings, investment, discountRate, years) {
  let van = -investment
  for (let i = 1; i <= years; i++) {
    van += annualSavings / Math.pow(1 + discountRate, i)
  }
  return van
}

export function calculateTIR(annualSavings, investment, years, guess = 0.1) {
  let rate = guess
  const tolerance = 0.0001
  let maxIterations = 100

  for (let i = 0; i < maxIterations; i++) {
    let van = -investment
    let vanDerivative = 0

    for (let j = 1; j <= years; j++) {
      const discountFactor = Math.pow(1 + rate, j)
      van += annualSavings / discountFactor
      vanDerivative -= (j * annualSavings) / (discountFactor * (1 + rate))
    }

    if (Math.abs(van) < tolerance) break
    if (vanDerivative === 0) break

    rate = rate - van / vanDerivative
    if (rate < -0.99) rate = -0.99
    if (rate > 10) rate = 10
  }

  return rate * 100
}

export const ROI_WARNING_THRESHOLD = 300
export const ROI_DANGER_THRESHOLD = 500
export const DOMINANT_FACTOR_RATIO = 0.50

export function getDominantFactors(factors, totalSavings) {
  if (!totalSavings || totalSavings <= 0) return []
  return Object.entries(factors)
    .filter(([_, f]) => f.answered && f.savings > 0)
    .filter(([_, f]) => (f.savings / totalSavings) > DOMINANT_FACTOR_RATIO)
    .map(([key, f]) => ({
      key,
      name: f.name,
      ratio: (f.savings / totalSavings * 100).toFixed(0)
    }))
}

export function calculateCertainty(factors) {
  const weights = {
    f1: 12,
    f2: 9,
    f3: 7,
    f4: 6,
    f5: 5,
    f6: 5,
    f7: 4,
    f8: 4,
    f9: 8,
    f10: 10
  }

  let totalWeight = 0
  let answeredWeight = 0

  Object.keys(weights).forEach(key => {
    totalWeight += weights[key]
    if (factors[key]?.answered) {
      answeredWeight += weights[key]
    }
  })

  return Math.round((answeredWeight / totalWeight) * 100)
}

export function getCertaintyLevel(certainty) {
  if (certainty >= 80) return { level: 'Alta', color: '#27AE60', icon: '✓' }
  if (certainty >= 50) return { level: 'Media', color: '#F39C12', icon: '⚠' }
  return { level: 'Baja', color: '#C0392B', icon: '⚠' }
}

export function getMissingFields(factors) {
  const missing = []
  Object.values(factors).forEach(factor => {
    if (!factor.answered) {
      missing.push(factor.name)
    }
  })
  return missing
}

export function generateProjection(annualSavings, investment, years) {
  const projection = []
  let cumulative = -investment

  for (let i = 1; i <= years; i++) {
    cumulative += annualSavings
    const roi = investment > 0 ? (cumulative / investment) * 100 : 0
    projection.push({
      year: i,
      annualSavings,
      cumulative,
      roi
    })
  }

  return projection
}

export function calculateAll(data) {
  const factors = calculateFactors(data)
  const totalSavings = calculateTotalSavings(factors)
  const investment = data.investment || 0

  const roi = calculateROI(investment, totalSavings)
  const payback = calculatePayback(investment, totalSavings)
  const benefitCostRatio = calculateBenefitCostRatio(investment, totalSavings)

  const discountRate = data.discountRate || 0.12
  const projectionYears = data.projectionYears || 5

  const van = calculateVAN(totalSavings, investment, discountRate, projectionYears)
  const tir = calculateTIR(totalSavings, investment, projectionYears)

  const manHourCost = factors._meta?.manHourCost || 0
  delete factors._meta

  const certainty = calculateCertainty(factors)
  const certaintyInfo = getCertaintyLevel(certainty)
  const missingFields = getMissingFields(factors)
  const dominantFactors = getDominantFactors(factors, totalSavings)
  const roiWarning = roi > ROI_WARNING_THRESHOLD
  const roiSeverity = roi > ROI_DANGER_THRESHOLD ? 'danger' : roi > ROI_WARNING_THRESHOLD ? 'warning' : null

  let savingsOverCap = false
  let savingsCapPct = null
  const monthlyBillingFull = (data.monthlyBilling && data.monthlyBilling > 0)
    ? data.monthlyBilling * 1_000_000
    : 0
  if (monthlyBillingFull > 0) {
    const annualBilling = monthlyBillingFull * 12
    const savingsPct = totalSavings / annualBilling
    if (savingsPct > MAX_SAVINGS_OF_REVENUE) {
      savingsOverCap = true
      savingsCapPct = (savingsPct * 100).toFixed(1)
    }
  }

  const projection = generateProjection(totalSavings, investment, projectionYears)

  return {
    factors,
    totalSavings,
    investment,
    roi,
    payback,
    benefitCostRatio,
    van,
    tir,
    certainty,
    certaintyInfo,
    missingFields,
    dominantFactors,
    roiWarning,
    roiSeverity,
    savingsOverCap,
    savingsCapPct,
    projection,
    monthlySavings: totalSavings / 12,
    manHourCost
  }
}

export function calculateAllContratoMarco(data) {
  const factors = calculateFactors(data)
  const totalSavings = calculateTotalSavings(factors)
  const investment = data.investment || 0
  const annualContractValue = data.annualContractValue || 0
  const inflationRate = data.inflationRate || 0.04
  const projectionYears = data.projectionYears || 5
  const discountRate = data.discountRate || 0.12

  const yearlyPayments = []
  for (let year = 0; year < projectionYears; year++) {
    yearlyPayments.push(annualContractValue * Math.pow(1 + inflationRate, year))
  }

  const yearlySavings = []
  for (let year = 0; year < projectionYears; year++) {
    yearlySavings.push(totalSavings)
  }

  let totalPayments = yearlyPayments.reduce((sum, p) => sum + p, 0)
  let totalSavingsSum = yearlySavings.reduce((sum, s) => sum + s, 0)

  const yearlyNetFlows = yearlyPayments.map((p, i) => yearlySavings[i] - p)

  let van = 0
  for (let i = 0; i < projectionYears; i++) {
    van += yearlyNetFlows[i] / Math.pow(1 + discountRate, i + 1)
  }

  const tir = calculateTIR(totalSavingsSum - annualContractValue, annualContractValue, projectionYears)

  const roi = totalPayments > 0 ? ((totalSavingsSum - totalPayments) / totalPayments) * 100 : 0

  const payback = calculatePayback(annualContractValue, totalSavings)

  const benefitCostRatio = totalPayments > 0 ? totalSavingsSum / totalPayments : 0

  const projection = []
  let cumulative = -annualContractValue
  for (let i = 0; i < projectionYears; i++) {
    cumulative += yearlyNetFlows[i]
    projection.push({
      year: i + 1,
      annualSavings: yearlyNetFlows[i],
      cumulative,
      roi: annualContractValue > 0 ? (cumulative / annualContractValue) * 100 : 0
    })
  }

  const certainty = calculateCertainty(factors)
  const certaintyInfo = getCertaintyLevel(certainty)
  const missingFields = getMissingFields(factors)
  const dominantFactors = getDominantFactors(factors, totalSavings)

  let savingsOverCap = false
  let savingsCapPct = null
  const monthlyBilling = (data.monthlyBilling && data.monthlyBilling > 0)
    ? data.monthlyBilling * 1_000_000
    : 0
  if (monthlyBilling > 0) {
    const annualBilling = monthlyBilling * 12
    const savingsPct = totalSavingsSum / annualBilling
    if (savingsPct > MAX_SAVINGS_OF_REVENUE) {
      savingsOverCap = true
      savingsCapPct = (savingsPct * 100).toFixed(1)
    }
  }

  const manHourCost = factors._meta?.manHourCost || 0
  delete factors._meta

  return {
    factors,
    totalSavings: totalSavingsSum,
    investment: annualContractValue,
    totalPayments,
    yearlyPayments,
    yearlySavings,
    roi,
    payback,
    benefitCostRatio,
    van,
    tir,
    certainty,
    certaintyInfo,
    missingFields,
    dominantFactors,
    roiWarning: roi > ROI_WARNING_THRESHOLD,
    roiSeverity: roi > ROI_DANGER_THRESHOLD ? 'danger' : roi > ROI_WARNING_THRESHOLD ? 'warning' : null,
    savingsOverCap,
    savingsCapPct,
    projection,
    monthlySavings: totalSavingsSum / 12,
    manHourCost,
    isContratoMarco: true
  }
}