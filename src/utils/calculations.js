import { DEFAULT_BENCHMARKS } from './constants.js'

export function calculateFactors(data) {
  const {
    totalAssets = 0,
    criticalAssets = 0,
    costPerHourStop = 0,
    unplannedFailures = 0,
    avgStopDuration = 0,
    correctiveExternalCost = 0,
    correctiveExternalCount = 0,
    reactiveManHours = 0,
    manHourCost = 0,
    sparePartsDelay = 0,
    sparePartsInventoryCost = 0,
    scheduledStopHours = 0,
    scheduledStopCost = 0,
    monthlyBilling = 0,
    benchmarks = DEFAULT_BENCHMARKS
  } = data

  const {
    reductionFailures = DEFAULT_BENCHMARKS.reductionFailures,
    reductionCorrective = DEFAULT_BENCHMARKS.reductionCorrective,
    optimizationHH = DEFAULT_BENCHMARKS.optimizationHH,
    reductionDelays = DEFAULT_BENCHMARKS.reductionDelays,
    reductionScheduledStops = DEFAULT_BENCHMARKS.reductionScheduledStops,
    extensionLife = DEFAULT_BENCHMARKS.extensionLife,
    energySavings = DEFAULT_BENCHMARKS.energySavings,
    riskReduction = DEFAULT_BENCHMARKS.riskReduction
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
      description: 'Reducción de horas-hombre en mantenimiento reactivo',
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
      description: 'Diferimiento de reposición de activos',
      baseValue: 0,
      savings: 0,
      answered: false
    },
    f7: {
      name: 'Ahorro Energético',
      description: 'Reducción de consumo por optimización',
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
    }
  }

  if (unplannedFailures > 0 && avgStopDuration > 0 && costPerHourStop > 0) {
    const hoursStopYear = unplannedFailures * avgStopDuration
    factors.f1.baseValue = hoursStopYear * costPerHourStop
    factors.f1.savings = factors.f1.baseValue * reductionFailures
    factors.f1.answered = true
  }

  if (correctiveExternalCost > 0 && correctiveExternalCount > 0) {
    factors.f2.baseValue = correctiveExternalCost * correctiveExternalCount
    factors.f2.savings = factors.f2.baseValue * reductionCorrective
    factors.f2.answered = true
  }

  if (reactiveManHours > 0 && manHourCost > 0) {
    factors.f3.baseValue = reactiveManHours * 12 * manHourCost
    factors.f3.savings = factors.f3.baseValue * optimizationHH
    factors.f3.answered = true
  }

  if ((sparePartsDelay > 0 || sparePartsInventoryCost > 0) && costPerHourStop > 0 && unplannedFailures > 0) {
    const delayCost = sparePartsDelay * 8 * costPerHourStop * unplannedFailures * 0.3
    const inventorySavings = sparePartsInventoryCost * reductionDelays
    factors.f4.baseValue = delayCost + sparePartsInventoryCost
    factors.f4.savings = delayCost * reductionDelays + inventorySavings
    factors.f4.answered = true
  }

  if (scheduledStopHours > 0 && scheduledStopCost > 0) {
    factors.f5.baseValue = scheduledStopHours * scheduledStopCost
    factors.f5.savings = factors.f5.baseValue * reductionScheduledStops
    factors.f5.answered = true
  }

  if (criticalAssets > 0) {
    const annualDeferral = criticalAssets * 50000000 / 15
    factors.f6.baseValue = annualDeferral
    factors.f6.savings = annualDeferral * extensionLife
    factors.f6.answered = true
  }

  if (totalAssets > 0) {
    const energySavingsYear = totalAssets * 50 * 0.746 * 6000 * 500
    factors.f7.baseValue = energySavingsYear
    factors.f7.savings = energySavingsYear * energySavings
    factors.f7.answered = true
  }

  if (monthlyBilling > 0) {
    const safetySavingsYear = monthlyBilling * 12 * 0.02
    factors.f8.baseValue = safetySavingsYear
    factors.f8.savings = safetySavingsYear * riskReduction
    factors.f8.answered = true
  }

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

export function calculateCertainty(factors) {
  const weights = {
    f1: 15,
    f2: 10,
    f3: 8,
    f4: 6,
    f5: 5,
    f6: 5,
    f7: 4,
    f8: 4
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

  const certainty = calculateCertainty(factors)
  const certaintyInfo = getCertaintyLevel(certainty)
  const missingFields = getMissingFields(factors)

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
    projection,
    monthlySavings: totalSavings / 12
  }
}