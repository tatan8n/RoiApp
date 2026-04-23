import { ROTODYNAMIC_BENCHMARKS, ROTODYNAMIC_FACTOR_WEIGHTS, TURBINE_TYPES } from './constants.js'

const PRESTACIONAL_FACTOR = 1.75
const MONTHLY_WORKING_HOURS = 240
const RISK_COST_FRACTION = 0.02
const MAX_SAVINGS_OF_REVENUE = 0.15
const ANNUAL_OPERATING_HOURS = 8760

const ROI_WARNING_THRESHOLD = 300
const ROI_DANGER_THRESHOLD = 500
const DOMINANT_FACTOR_RATIO = 0.50

function getTurbineVENS(turbineType) {
  const turbine = TURBINE_TYPES.find(t => t.id === turbineType)
  if (turbine?.benchmarks?.vens) {
    return turbine.benchmarks.vens
  }
  return 5000
}

function isNewTurbine(data) {
  return data.yearsOfOperation !== null && data.yearsOfOperation <= 2
}

export function calculateRotodynamicFactors(data) {
  const {
    numTurbines,
    nominalCapacity,
    costPerHourStop,
    criticalFailures,
    avgStopDuration,
    mttr,
    externalInterventionCost,
    reactiveManHours,
    internalLaborCost,
    billingAffected,
    sparePartsDelay,
    heatRateDesign,
    heatRateActual,
    fuelCost,
    turbineType,
    currency,
    benchmarks = ROTODYNAMIC_BENCHMARKS
  } = data

  const {
    reductionFailures = ROTODYNAMIC_BENCHMARKS.reductionFailures,
    reductionHeatRate = ROTODYNAMIC_BENCHMARKS.reductionHeatRate,
    optimizationHH = ROTODYNAMIC_BENCHMARKS.optimizationHH,
    reductionDelays = ROTODYNAMIC_BENCHMARKS.reductionDelays,
    extensionLife = ROTODYNAMIC_BENCHMARKS.extensionLife,
    riskReduction = ROTODYNAMIC_BENCHMARKS.riskReduction
  } = benchmarks

  const factors = {
    f1: {
      name: 'Lucro Cesante Evitado',
      description: 'Reducción de pérdidas por paros no planificados evitados mediante diagnóstico predictivo',
      baseValue: 0,
      savings: 0,
      answered: false
    },
    f2: {
      name: 'Ahorro por Eficiencia',
      description: 'Mejora en heat rate por mantenimiento de eficiencia de diseño',
      baseValue: 0,
      savings: 0,
      answered: false
    },
    f3: {
      name: 'Optimización Mano de Obra',
      description: 'Reducción de horas-hombre en mantenimiento reactivo',
      baseValue: 0,
      savings: 0,
      answered: false
    },
    f4: {
      name: 'Inventario y Demoras',
      description: 'Optimización de inventario y reducción de demoras en repuestos críticos',
      baseValue: 0,
      savings: 0,
      answered: false
    },
    f5: {
      name: 'Vida Útil Diferida',
      description: 'Diferimiento de reposición de activos mediante diagnóstico temprano',
      baseValue: 0,
      savings: 0,
      answered: false
    },
    f6: {
      name: 'Seguridad y Seguros',
      description: 'Reducción de riesgos de falla catastrófica y primas de seguro',
      baseValue: 0,
      savings: 0,
      answered: false
    }
  }

  const hasActualFailureData = criticalFailures !== null && avgStopDuration !== null && costPerHourStop !== null
  const hasCapacityData = nominalCapacity !== null

  if (isNewTurbine(data)) {
    const vens = getTurbineVENS(turbineType)
    const vensCOP = data.currency === 'USD' ? vens * 4000 : vens * 20000000

    if (hasCapacityData && vensCOP > 0) {
      const estimatedAnnualLoss = nominalCapacity * 1000 * ANNUAL_OPERATING_HOURS * 0.05 * vensCOP * 0.001
      factors.f1.baseValue = estimatedAnnualLoss
      factors.f1.savings = factors.f1.baseValue * reductionFailures
      factors.f1.answered = true
    }
  } else if (hasActualFailureData && criticalFailures > 0 && avgStopDuration > 0 && costPerHourStop > 0) {
    const hoursStopYear = (criticalFailures / 2) * avgStopDuration
    factors.f1.baseValue = hoursStopYear * costPerHourStop
    factors.f1.savings = factors.f1.baseValue * reductionFailures
    factors.f1.answered = true
  }

  if (nominalCapacity !== null && heatRateDesign !== null && heatRateActual !== null && fuelCost !== null) {
    if (heatRateActual > heatRateDesign) {
      const deltaHeatRate = heatRateActual - heatRateDesign
      const capacityKWh = nominalCapacity * 1000
      const annualGeneration = capacityKWh * ANNUAL_OPERATING_HOURS
      const heatRateDiffMMBTUperKWh = deltaHeatRate / 1_000_000
      factors.f2.baseValue = heatRateDiffMMBTUperKWh * annualGeneration * fuelCost
      factors.f2.savings = factors.f2.baseValue * reductionHeatRate
      factors.f2.answered = true
    }
  }

  if (reactiveManHours !== null && internalLaborCost !== null && reactiveManHours > 0 && internalLaborCost > 0) {
    factors.f3.baseValue = reactiveManHours * internalLaborCost
    factors.f3.savings = factors.f3.baseValue * optimizationHH
    factors.f3.answered = true
  }

  if (sparePartsDelay !== null && costPerHourStop !== null && criticalFailures !== null && avgStopDuration !== null) {
    if (sparePartsDelay > 0 && costPerHourStop > 0 && criticalFailures > 0 && avgStopDuration > 0) {
      const delayCost = (criticalFailures / 2) * avgStopDuration * costPerHourStop * (sparePartsDelay / 365)
      factors.f4.baseValue = delayCost
      factors.f4.savings = delayCost * reductionDelays
      factors.f4.answered = true
    }
  }

  if (numTurbines !== null && nominalCapacity !== null && numTurbines > 0 && nominalCapacity > 0) {
    const assetValue = numTurbines * nominalCapacity * 1_000_000
    const annualDeferral = assetValue / 15
    factors.f5.baseValue = annualDeferral
    factors.f5.savings = annualDeferral * extensionLife
    factors.f5.answered = true
  }

  if (billingAffected !== null && billingAffected > 0) {
    const safetySavingsYear = billingAffected * RISK_COST_FRACTION
    factors.f6.baseValue = safetySavingsYear
    factors.f6.savings = safetySavingsYear * riskReduction
    factors.f6.answered = true
  } else if (hasCapacityData && nominalCapacity > 0) {
    const estimatedBilling = nominalCapacity * 1000 * 24 * 365 * 0.05
    const safetySavingsYear = estimatedBilling * RISK_COST_FRACTION
    factors.f6.baseValue = safetySavingsYear
    factors.f6.savings = safetySavingsYear * riskReduction
    factors.f6.answered = true
  }

  return factors
}

export function calculateRotodynamicTotalSavings(factors) {
  return Object.values(factors).reduce((total, factor) => {
    return total + (factor.answered ? factor.savings : 0)
  }, 0)
}

export function calculateRotodynamicROI(investment, annualSavings) {
  if (!investment || investment <= 0 || !annualSavings || annualSavings <= 0) return 0
  return ((annualSavings - investment) / investment) * 100
}

export function calculateRotodynamicPayback(investment, annualSavings) {
  if (!annualSavings || annualSavings <= 0) return null
  const paybackMonths = investment / (annualSavings / 12)
  return Math.round(paybackMonths * 10) / 10
}

export function calculateRotodynamicBenefitCostRatio(investment, annualSavings) {
  if (!investment || investment <= 0) return 0
  return annualSavings / investment
}

export function calculateRotodynamicVAN(annualSavings, investment, discountRate, years) {
  let van = -investment
  for (let i = 1; i <= years; i++) {
    van += annualSavings / Math.pow(1 + discountRate, i)
  }
  return van
}

export function calculateRotodynamicTIR(annualSavings, investment, years, guess = 0.1) {
  let rate = guess
  const tolerance = 0.0001
  const maxIterations = 100

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

export function getRotodynamicDominantFactors(factors, totalSavings) {
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

export function calculateRotodynamicCertainty(factors) {
  const weights = ROTODYNAMIC_FACTOR_WEIGHTS

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

export function getRotodynamicCertaintyLevel(certainty) {
  if (certainty >= 80) return { level: 'Alta', color: '#27AE60', icon: '✓' }
  if (certainty >= 50) return { level: 'Media', color: '#F39C12', icon: '⚠' }
  return { level: 'Baja', color: '#C0392B', icon: '⚠' }
}

export function getRotodynamicMissingFields(factors) {
  const missing = []
  Object.values(factors).forEach(factor => {
    if (!factor.answered) {
      missing.push(factor.name)
    }
  })
  return missing
}

export function generateRotodynamicProjection(annualSavings, investment, years) {
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

export function calculateAllRotodynamic(data) {
  const factors = calculateRotodynamicFactors(data)
  const totalSavings = calculateRotodynamicTotalSavings(factors)
  const investment = data.investment || 0

  const roi = calculateRotodynamicROI(investment, totalSavings)
  const payback = calculateRotodynamicPayback(investment, totalSavings)
  const benefitCostRatio = calculateRotodynamicBenefitCostRatio(investment, totalSavings)

  const discountRate = data.discountRate || 0.12
  const projectionYears = data.projectionYears || 5

  const van = calculateRotodynamicVAN(totalSavings, investment, discountRate, projectionYears)
  const tir = calculateRotodynamicTIR(totalSavings, investment, projectionYears)

  const certainty = calculateRotodynamicCertainty(factors)
  const certaintyInfo = getRotodynamicCertaintyLevel(certainty)
  const missingFields = getRotodynamicMissingFields(factors)
  const dominantFactors = getRotodynamicDominantFactors(factors, totalSavings)
  const roiWarning = roi > ROI_WARNING_THRESHOLD
  const roiSeverity = roi > ROI_DANGER_THRESHOLD ? 'danger' : roi > ROI_WARNING_THRESHOLD ? 'warning' : null

  let savingsOverCap = false
  let savingsCapPct = null
  const billing = data.billing || 0
  if (billing > 0) {
    const savingsPct = totalSavings / billing
    if (savingsPct > MAX_SAVINGS_OF_REVENUE) {
      savingsOverCap = true
      savingsCapPct = (savingsPct * 100).toFixed(1)
    }
  }

  const projection = generateRotodynamicProjection(totalSavings, investment, projectionYears)

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
    manHourCost: 0
  }
}

export { ROI_WARNING_THRESHOLD, ROI_DANGER_THRESHOLD }