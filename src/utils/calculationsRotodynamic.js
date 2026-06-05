import { ROTODYNAMIC_BENCHMARKS, ROTODYNAMIC_FACTOR_WEIGHTS, TURBINE_TYPES, CONTRIBUTION_MARGIN_PER_KWH, CAPACITY_FACTORS, USEFUL_LIFE_YEARS, MAX_REASONABLE_ROI } from './constants.js'
import { validateResults, validateInputData } from './calculationValidator.js'
import { applyRotodynamicBenchmarks, BENCHMARK_CERTAINTY_FACTOR } from './industryBenchmarks.js'

const PRESTACIONAL_FACTOR = 1.75
const MONTHLY_WORKING_HOURS = 240
const RISK_COST_FRACTION = 0.02
const MAX_SAVINGS_OF_REVENUE = 0.30
const ANNUAL_OPERATING_HOURS = 8760

const ROI_WARNING_THRESHOLD = 300
const ROI_DANGER_THRESHOLD = 500
const DOMINANT_FACTOR_RATIO = 0.70
const COP_EXCHANGE_RATE = 4000
const NEW_TURBINE_LOSS_FACTOR = 0.01
const MAX_HOURS_PER_YEAR = 8760

function isNewTurbine(data) {
  if (data.yearsOfOperation === null || data.yearsOfOperation === undefined) return false
  return data.yearsOfOperation <= 2
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

  const _ba = data._benchmarkApplied || {}

  const hasActualFailureData = criticalFailures !== null && avgStopDuration !== null && costPerHourStop !== null
  const hasCapacityData = nominalCapacity !== null
  const isZeroHoursTurbine = (data.yearsOfOperation === 0 || data.yearsOfOperation === null) &&
                             (criticalFailures === null || criticalFailures === 0) &&
                             (avgStopDuration === null || avgStopDuration === 0)

  const capacityFactor = data.capacityFactor || CAPACITY_FACTORS[turbineType] || 0.6
  const effectiveHours = ANNUAL_OPERATING_HOURS * capacityFactor

  // CORRECCIÓN: priorizar datos reales de fallas sobre la estimación teórica.
  // Antes, una turbina "nueva" (≤2 años) usaba siempre la estimación de la industria
  // aunque el usuario hubiera ingresado fallas reales, subestimando gravemente el lucro
  // cesante. Ahora la estimación teórica solo se usa cuando NO hay historial real.
  const hasRealFailureHistory = criticalFailures > 0 && avgStopDuration > 0 && costPerHourStop > 0
  if (isNewTurbine(data) && !hasRealFailureHistory) {
    const marginPerKWh = CONTRIBUTION_MARGIN_PER_KWH[currency]?.[turbineType] || CONTRIBUTION_MARGIN_PER_KWH[currency]?.gas || (currency === 'COP' ? 350 : 0.085)

    const lossFactor = isZeroHoursTurbine && !data.yearsOfOperation ? NEW_TURBINE_LOSS_FACTOR * 0.5 : NEW_TURBINE_LOSS_FACTOR
    const effectiveReduction = isZeroHoursTurbine
      ? Math.min(reductionFailures, 0.20)
      : reductionFailures

    if (hasCapacityData && marginPerKWh > 0) {
      const annualEnergyKWh = nominalCapacity * 1000 * effectiveHours
      const annualLossKWh = annualEnergyKWh * lossFactor
      const estimatedAnnualLoss = annualLossKWh * marginPerKWh
      factors.f1.baseValue = estimatedAnnualLoss
      factors.f1.savings = estimatedAnnualLoss * effectiveReduction
      factors.f1.answered = true
      // f1 from theoretical estimation is treated as benchmark-quality data
      factors.f1.answeredByBenchmark = true
    }
  } else if (hasActualFailureData && criticalFailures > 0 && avgStopDuration > 0 && costPerHourStop > 0) {
    const hoursStopYear = (criticalFailures / 2) * avgStopDuration
    factors.f1.baseValue = hoursStopYear * costPerHourStop
    factors.f1.savings = factors.f1.baseValue * reductionFailures
    factors.f1.answered = true
    if (_ba.criticalFailures || _ba.avgStopDuration) factors.f1.answeredByBenchmark = true
  }

  if (nominalCapacity !== null && heatRateDesign !== null && heatRateActual !== null && fuelCost !== null) {
    if (heatRateActual > heatRateDesign) {
      const deltaHeatRate = heatRateActual - heatRateDesign
      const capacityKWh = nominalCapacity * 1000
      const annualGeneration = capacityKWh * effectiveHours
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
    if (_ba.reactiveManHours) factors.f3.answeredByBenchmark = true
  }

  if (sparePartsDelay !== null && costPerHourStop !== null && criticalFailures !== null && avgStopDuration !== null) {
    if (sparePartsDelay > 0 && costPerHourStop > 0 && criticalFailures > 0 && avgStopDuration > 0) {
      const delayCost = (criticalFailures / 2) * avgStopDuration * costPerHourStop * (sparePartsDelay / 365)
      factors.f4.baseValue = delayCost
      factors.f4.savings = delayCost * reductionDelays
      factors.f4.answered = true
      if (_ba.criticalFailures || _ba.avgStopDuration || _ba.sparePartsDelay) factors.f4.answeredByBenchmark = true
    }
  }

  if (numTurbines !== null && nominalCapacity !== null && numTurbines > 0 && nominalCapacity > 0) {
    const usefulLife = USEFUL_LIFE_YEARS[turbineType] || USEFUL_LIFE_YEARS.default
    const assetValuePerMW = currency === 'USD' ? 800_000 : 3_200_000_000
    const assetValue = numTurbines * nominalCapacity * assetValuePerMW
    const annualDeferral = assetValue / usefulLife
    const deferralSavings = annualDeferral * extensionLife
    const maxDeferral = assetValue * 0.05
    factors.f5.baseValue = annualDeferral
    factors.f5.savings = Math.min(deferralSavings, maxDeferral)
    factors.f5.answered = true
  }

  if (billingAffected !== null && billingAffected > 0) {
    const safetySavingsYear = billingAffected * RISK_COST_FRACTION
    factors.f6.baseValue = safetySavingsYear
    factors.f6.savings = safetySavingsYear * riskReduction
    factors.f6.answered = true
  } else if (hasCapacityData && nominalCapacity > 0) {
    const marginPerKWh = CONTRIBUTION_MARGIN_PER_KWH[currency]?.[turbineType] || CONTRIBUTION_MARGIN_PER_KWH[currency]?.gas || (currency === 'COP' ? 350 : 0.085)
    const annualEnergyKWh = nominalCapacity * 1000 * effectiveHours
    const lossFactor = isZeroHoursTurbine ? NEW_TURBINE_LOSS_FACTOR * 0.5 : 0.05
    const annualLossKWh = annualEnergyKWh * lossFactor
    const estimatedBilling = annualLossKWh * marginPerKWh
    const effectiveRiskReduction = isZeroHoursTurbine ? 0.05 : riskReduction
    const safetySavingsYear = estimatedBilling * RISK_COST_FRACTION
    factors.f6.baseValue = safetySavingsYear
    factors.f6.savings = safetySavingsYear * effectiveRiskReduction
    factors.f6.answered = true
    // f6 derived from capacity estimate is treated as benchmark quality
    factors.f6.answeredByBenchmark = true
  }

  return factors
}

export function calculateRotodynamicTotalSavings(factors) {
  return Object.values(factors).reduce((total, factor) => {
    return total + (factor.answered ? factor.savings : 0)
  }, 0)
}

export function calculateRotodynamicROI(investment, totalSavings, projectionYears) {
  // null = no calculable (inversión inválida), distinto de un ROI real de 0%.
  if (!investment || investment <= 0) return null
  const totalBenefits = totalSavings * projectionYears
  return ((totalBenefits - investment) / investment) * 100
}

export function calculateRotodynamicPayback(investment, annualSavings) {
  if (!annualSavings || annualSavings <= 0) return null
  if (!investment || investment <= 0) return null
  const paybackMonths = investment / (annualSavings / 12)
  return Math.round(paybackMonths * 10) / 10
}

export function calculateRotodynamicBenefitCostRatio(investment, totalSavings, projectionYears) {
  if (!investment || investment <= 0) return null
  return (totalSavings * projectionYears) / investment
}

export function calculateRotodynamicVAN(annualSavings, investment, discountRate, years) {
  let van = -investment
  for (let i = 1; i <= years; i++) {
    van += annualSavings / Math.pow(1 + discountRate, i)
  }
  return van
}

export function calculateRotodynamicTIR(annualSavings, investment, years, guess = 0.1) {
  if (annualSavings <= 0) return 0
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
    const w = weights[key]
    totalWeight += w
    if (factors[key]?.answered) {
      answeredWeight += factors[key].answeredByBenchmark ? w * BENCHMARK_CERTAINTY_FACTOR : w
    }
  })

  return Math.round((answeredWeight / totalWeight) * 100)
}

export function calculateRotodynamicUserCertainty(factors) {
  const weights = ROTODYNAMIC_FACTOR_WEIGHTS
  let totalWeight = 0
  let userWeight = 0

  Object.keys(weights).forEach(key => {
    const w = weights[key]
    totalWeight += w
    if (factors[key]?.answered && !factors[key]?.answeredByBenchmark) {
      userWeight += w
    }
  })

  return Math.round((userWeight / totalWeight) * 100)
}

export function getRotodynamicBenchmarkFields(factors) {
  return Object.values(factors)
    .filter(f => f.answered && f.answeredByBenchmark)
    .map(f => f.name)
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
  // Apply turbine-type benchmarks for any null operational fields
  const { data: filledData, benchmarkApplied } = applyRotodynamicBenchmarks(data)
  filledData._benchmarkApplied = benchmarkApplied
  data = filledData

  const inputValidation = validateInputData({ ...data }, 'rotodinamico')

  const factors = calculateRotodynamicFactors(data)
  const totalSavings = calculateRotodynamicTotalSavings(factors)
  const investment = data.investment || 0
  const projectionYears = data.projectionYears || 5
  const discountRate = data.discountRate || 0.12

  let roi = calculateRotodynamicROI(investment, totalSavings, projectionYears)
  if (roi !== null && roi > MAX_REASONABLE_ROI) roi = MAX_REASONABLE_ROI
  const payback = calculateRotodynamicPayback(investment, totalSavings)
  const benefitCostRatio = calculateRotodynamicBenefitCostRatio(investment, totalSavings, projectionYears)

  const van = calculateRotodynamicVAN(totalSavings, investment, discountRate, projectionYears)
  const tir = calculateRotodynamicTIR(totalSavings, investment, projectionYears)

  const certainty = calculateRotodynamicCertainty(factors)
  const userCertainty = calculateRotodynamicUserCertainty(factors)
  const certaintyInfo = getRotodynamicCertaintyLevel(certainty)
  const missingFields = getRotodynamicMissingFields(factors)
  const benchmarkFactors = getRotodynamicBenchmarkFields(factors)
  const dominantFactors = getRotodynamicDominantFactors(factors, totalSavings)
  const roiWarning = roi !== null && roi > ROI_WARNING_THRESHOLD
  const roiSeverity = roi !== null && roi > ROI_DANGER_THRESHOLD ? 'danger' : (roi !== null && roi > ROI_WARNING_THRESHOLD ? 'warning' : null)

  const warnings = [...(inputValidation.warnings || [])]

  // Heat rate actual < diseño: probable error de captura (antes se ignoraba en silencio).
  if (data.heatRateDesign > 0 && data.heatRateActual > 0 && data.heatRateActual < data.heatRateDesign) {
    warnings.push({
      type: 'heat_rate_inverted',
      field: 'heatRateActual',
      message: `El heat rate actual (${data.heatRateActual}) es menor que el de diseño (${data.heatRateDesign}). Esto implicaría que la turbina es más eficiente que su diseño, lo cual es inusual. Verifique los valores; el ahorro por eficiencia (f2) no se calculó.`
    })
  }

  // MTTR mayor que la duración promedio del paro: inconsistencia lógica.
  if (data.mttr > 0 && data.avgStopDuration > 0 && data.mttr > data.avgStopDuration) {
    warnings.push({
      type: 'mttr_inconsistent',
      field: 'mttr',
      message: `El MTTR (${data.mttr}h) supera la duración promedio del paro (${data.avgStopDuration}h). El MTTR debería ser menor o igual a la duración total del paro. Revise los datos.`
    })
  }
  if (data.costPerHourStop > 0 && data.yearsOfOperation <= 2) {
    const maxReasonableStopCost = data.currency === 'COP'
      ? data.nominalCapacity * 50_000_000
      : data.nominalCapacity * 12_500
    if (data.costPerHourStop > maxReasonableStopCost) {
      warnings.push({
        type: 'extreme_value',
        field: 'costPerHourStop',
        message: `El costo por hora de paro (${data.currency === 'USD' ? '$' : ''}${data.costPerHourStop.toLocaleString()}${data.currency === 'USD' ? ' USD' : ' COP'}/h) excede el máximo razonable para la capacidad de la turbina. Verifique que el valor esté en la unidad correcta.`
      })
    }
  }
  if (investment > 0) {
    const minInvestment = data.currency === 'USD' ? 1000 : 4_000_000
    if (investment < minInvestment) {
      warnings.push({
        type: 'low_investment',
        field: 'serviceValue',
        message: data.currency === 'USD'
          ? `La inversión declarada ($${investment.toLocaleString()} USD) es muy baja para un servicio de diagnóstico rotodinámico. Se recomienda un valor mínimo de $1,000 USD para resultados más realistas.`
          : `La inversión declarada (${(investment / 1_000_000).toFixed(0)} MM COP) es muy baja para un servicio de diagnóstico rotodinámico. Se recomienda un valor mínimo de 4 MM COP para resultados más realistas.`
      })
    }
  }
  const isZeroHoursTurbineCheck = (data.yearsOfOperation === 0 || data.yearsOfOperation === null) &&
    (data.criticalFailures === null || data.criticalFailures === 0) &&
    (data.avgStopDuration === null || data.avgStopDuration === 0)
  if (isZeroHoursTurbineCheck) {
    warnings.push({
      type: 'new_turbine_no_history',
      message: 'Turbina sin horas de operación y sin historial de fallas — los ahorros proyectados usan estimaciones teóricas de la industria (EPRI, DOE). Para resultados más precisos, ingrese datos reales cuando estén disponibles.'
    })
  }

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

  const rawResults = {
    factors,
    totalSavings,
    investment,
    roi,
    payback,
    benefitCostRatio,
    van,
    tir,
    certainty,
    userCertainty,
    certaintyInfo,
    missingFields,
    benchmarkFactors,
    benchmarkApplied,
    dominantFactors,
    roiWarning,
    roiSeverity,
    savingsOverCap,
    savingsCapPct,
    projection,
    monthlySavings: totalSavings / 12,
    manHourCost: 0,
    warnings,
    projectionYears,
    usedBenchmarks: Object.keys(benchmarkApplied).length > 0
  }

  return validateResults(rawResults, data)
}

export { ROI_WARNING_THRESHOLD, ROI_DANGER_THRESHOLD }