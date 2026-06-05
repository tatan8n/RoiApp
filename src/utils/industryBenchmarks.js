/**
 * Industry benchmark fallback values for ROI calculations.
 *
 * When a user leaves a field blank the corresponding factor cannot be computed,
 * which lowers the certainty score. This module fills those gaps with
 * conservative, sector-validated estimates so the analysis can still run.
 *
 * Key design rules
 * ─────────────────
 * 1. Values are intentionally LOW-END / conservative so benchmarks never inflate ROI.
 * 2. Only "rate" fields (counts, durations, %) and a few baseline cost fields are
 *    benchmarked. Size-dependent amounts (preventive budget, asset values, energy
 *    cost, inventory value) are NOT benchmarked — they vary too much by plant.
 * 3. Cost fields are in MM COP, matching the operational-form convention.
 * 4. User-provided values are NEVER overridden.
 * 5. Benchmark-answered factors contribute BENCHMARK_CERTAINTY_FACTOR (0.5) of their
 *    normal certainty weight, signalling reduced confidence.
 *
 * Sources: DOE, SMRP, McKinsey, Aberdeen Group, PwC, DANE, EPRI, OGP, XM/CREG.
 */

export const BENCHMARK_CERTAINTY_FACTOR = 0.5

// ---------------------------------------------------------------------------
// Operational benchmarks (product / contrato_marco)
// All cost fields are in MM COP.
// ---------------------------------------------------------------------------
const SECTOR_OPERATIONAL_BENCHMARKS = {
  'Manufactura': {
    unplannedFailures:               { value: 6,    label: 'Fallas no planificadas/año',           source: 'DOE, SMRP' },
    avgStopDuration:                 { value: 5,    label: 'Duración promedio de paro (h)',         source: 'McKinsey' },
    costPerHourStop:                 { value: 3,    label: 'Costo/hora de paro (MM COP)',           source: 'Aberdeen Group' },
    correctiveExternalCount:         { value: 6,    label: 'Intervenciones correctivas externas/año', source: 'PwC' },
    reactiveManHours:                { value: 40,   label: 'HH reactivas/mes',                      source: 'McKinsey' },
    technicianMonthlySalary:         { value: 2.2,  label: 'Salario técnico mensual (MM COP)',      source: 'DANE' },
    sparePartsDelay:                 { value: 30,   label: 'Demora en repuestos críticos (días)',   source: 'SMRP' },
    unnecessaryPreventivePercentage: { value: 35,   label: '% preventivos innecesarios',            source: 'DOE' },
    monthlyBilling:                  { value: 200,  label: 'Facturación mensual (MM COP)',           source: 'DANE estimado' },
  },
  'Oil & Gas': {
    unplannedFailures:               { value: 3,    label: 'Fallas no planificadas/año',           source: 'EPRI, OGP' },
    avgStopDuration:                 { value: 10,   label: 'Duración promedio de paro (h)',         source: 'OGP' },
    costPerHourStop:                 { value: 20,   label: 'Costo/hora de paro (MM COP)',           source: 'Aberdeen Group' },
    correctiveExternalCount:         { value: 4,    label: 'Intervenciones correctivas externas/año', source: 'OGP' },
    reactiveManHours:                { value: 60,   label: 'HH reactivas/mes',                      source: 'McKinsey' },
    technicianMonthlySalary:         { value: 3.5,  label: 'Salario técnico mensual (MM COP)',      source: 'DANE' },
    sparePartsDelay:                 { value: 60,   label: 'Demora en repuestos críticos (días)',   source: 'SMRP' },
    unnecessaryPreventivePercentage: { value: 28,   label: '% preventivos innecesarios',            source: 'DOE' },
    monthlyBilling:                  { value: 1500, label: 'Facturación mensual (MM COP)',           source: 'UPME estimado' },
  },
  'Minería': {
    unplannedFailures:               { value: 5,    label: 'Fallas no planificadas/año',           source: 'DOE, SMRP' },
    avgStopDuration:                 { value: 8,    label: 'Duración promedio de paro (h)',         source: 'McKinsey' },
    costPerHourStop:                 { value: 8,    label: 'Costo/hora de paro (MM COP)',           source: 'Aberdeen Group' },
    correctiveExternalCount:         { value: 6,    label: 'Intervenciones correctivas externas/año', source: 'SMRP' },
    reactiveManHours:                { value: 70,   label: 'HH reactivas/mes',                      source: 'McKinsey' },
    technicianMonthlySalary:         { value: 2.8,  label: 'Salario técnico mensual (MM COP)',      source: 'DANE' },
    sparePartsDelay:                 { value: 45,   label: 'Demora en repuestos críticos (días)',   source: 'SMRP' },
    unnecessaryPreventivePercentage: { value: 32,   label: '% preventivos innecesarios',            source: 'DOE' },
    monthlyBilling:                  { value: 800,  label: 'Facturación mensual (MM COP)',           source: 'ANM estimado' },
  },
  'Hidroeléctrica': {
    unplannedFailures:               { value: 2,    label: 'Fallas no planificadas/año',           source: 'EPRI, XM' },
    avgStopDuration:                 { value: 20,   label: 'Duración promedio de paro (h)',         source: 'EPRI' },
    costPerHourStop:                 { value: 5,    label: 'Costo/hora de paro (MM COP)',           source: 'CREG, XM' },
    correctiveExternalCount:         { value: 3,    label: 'Intervenciones correctivas externas/año', source: 'EPRI' },
    reactiveManHours:                { value: 35,   label: 'HH reactivas/mes',                      source: 'McKinsey' },
    technicianMonthlySalary:         { value: 3.0,  label: 'Salario técnico mensual (MM COP)',      source: 'DANE' },
    sparePartsDelay:                 { value: 50,   label: 'Demora en repuestos críticos (días)',   source: 'SMRP' },
    unnecessaryPreventivePercentage: { value: 25,   label: '% preventivos innecesarios',            source: 'DOE' },
    monthlyBilling:                  { value: 500,  label: 'Facturación mensual (MM COP)',           source: 'XM estimado' },
  },
  'Alimentos y Bebidas': {
    unplannedFailures:               { value: 8,    label: 'Fallas no planificadas/año',           source: 'DOE, SMRP' },
    avgStopDuration:                 { value: 4,    label: 'Duración promedio de paro (h)',         source: 'McKinsey' },
    costPerHourStop:                 { value: 2,    label: 'Costo/hora de paro (MM COP)',           source: 'Aberdeen Group' },
    correctiveExternalCount:         { value: 8,    label: 'Intervenciones correctivas externas/año', source: 'SMRP' },
    reactiveManHours:                { value: 45,   label: 'HH reactivas/mes',                      source: 'McKinsey' },
    technicianMonthlySalary:         { value: 2.0,  label: 'Salario técnico mensual (MM COP)',      source: 'DANE' },
    sparePartsDelay:                 { value: 25,   label: 'Demora en repuestos críticos (días)',   source: 'SMRP' },
    unnecessaryPreventivePercentage: { value: 38,   label: '% preventivos innecesarios',            source: 'DOE' },
    monthlyBilling:                  { value: 150,  label: 'Facturación mensual (MM COP)',           source: 'DANE estimado' },
  },
  'Empaque': {
    unplannedFailures:               { value: 10,   label: 'Fallas no planificadas/año',           source: 'DOE, SMRP' },
    avgStopDuration:                 { value: 3,    label: 'Duración promedio de paro (h)',         source: 'McKinsey' },
    costPerHourStop:                 { value: 1.5,  label: 'Costo/hora de paro (MM COP)',           source: 'Aberdeen Group' },
    correctiveExternalCount:         { value: 10,   label: 'Intervenciones correctivas externas/año', source: 'SMRP' },
    reactiveManHours:                { value: 35,   label: 'HH reactivas/mes',                      source: 'McKinsey' },
    technicianMonthlySalary:         { value: 2.0,  label: 'Salario técnico mensual (MM COP)',      source: 'DANE' },
    sparePartsDelay:                 { value: 20,   label: 'Demora en repuestos críticos (días)',   source: 'SMRP' },
    unnecessaryPreventivePercentage: { value: 40,   label: '% preventivos innecesarios',            source: 'DOE' },
    monthlyBilling:                  { value: 100,  label: 'Facturación mensual (MM COP)',           source: 'DANE estimado' },
  },
  'Farmacéutica': {
    unplannedFailures:               { value: 5,    label: 'Fallas no planificadas/año',           source: 'DOE, FDA' },
    avgStopDuration:                 { value: 6,    label: 'Duración promedio de paro (h)',         source: 'McKinsey' },
    costPerHourStop:                 { value: 5,    label: 'Costo/hora de paro (MM COP)',           source: 'Aberdeen Group' },
    correctiveExternalCount:         { value: 5,    label: 'Intervenciones correctivas externas/año', source: 'SMRP' },
    reactiveManHours:                { value: 45,   label: 'HH reactivas/mes',                      source: 'McKinsey' },
    technicianMonthlySalary:         { value: 2.8,  label: 'Salario técnico mensual (MM COP)',      source: 'DANE' },
    sparePartsDelay:                 { value: 35,   label: 'Demora en repuestos críticos (días)',   source: 'SMRP' },
    unnecessaryPreventivePercentage: { value: 30,   label: '% preventivos innecesarios',            source: 'DOE' },
    monthlyBilling:                  { value: 300,  label: 'Facturación mensual (MM COP)',           source: 'DANE estimado' },
  },
  'Otro': {
    unplannedFailures:               { value: 6,    label: 'Fallas no planificadas/año',           source: 'DOE, SMRP' },
    avgStopDuration:                 { value: 5,    label: 'Duración promedio de paro (h)',         source: 'McKinsey' },
    costPerHourStop:                 { value: 3,    label: 'Costo/hora de paro (MM COP)',           source: 'Aberdeen Group' },
    correctiveExternalCount:         { value: 6,    label: 'Intervenciones correctivas externas/año', source: 'PwC' },
    reactiveManHours:                { value: 40,   label: 'HH reactivas/mes',                      source: 'McKinsey' },
    technicianMonthlySalary:         { value: 2.2,  label: 'Salario técnico mensual (MM COP)',      source: 'DANE' },
    sparePartsDelay:                 { value: 30,   label: 'Demora en repuestos críticos (días)',   source: 'SMRP' },
    unnecessaryPreventivePercentage: { value: 35,   label: '% preventivos innecesarios',            source: 'DOE' },
    monthlyBilling:                  { value: 200,  label: 'Facturación mensual (MM COP)',           source: 'Estimado genérico' },
  },
}

// ---------------------------------------------------------------------------
// Rotodynamic benchmarks (count/duration fields only — cost fields avoided
// due to their strong capacity-dependency and unit-conversion sensitivity)
// ---------------------------------------------------------------------------
const TURBINE_OPERATIONAL_BENCHMARKS = {
  gas: {
    criticalFailures: { value: 1.5,  label: 'Fallas críticas / 2 años',      source: 'EPRI' },
    avgStopDuration:  { value: 72,   label: 'Duración promedio de paro (h)',  source: 'EPRI' },
    mttr:             { value: 120,  label: 'MTTR (h)',                        source: 'IEEE' },
    sparePartsDelay:  { value: 60,   label: 'Demora en repuestos (días)',      source: 'SMRP' },
    reactiveManHours: { value: 2400, label: 'HH reactivas/año',               source: 'McKinsey' },
  },
  steam: {
    criticalFailures: { value: 0.9,  label: 'Fallas críticas / 2 años',      source: 'EPRI' },
    avgStopDuration:  { value: 120,  label: 'Duración promedio de paro (h)',  source: 'EPRI' },
    mttr:             { value: 240,  label: 'MTTR (h)',                        source: 'IEEE' },
    sparePartsDelay:  { value: 90,   label: 'Demora en repuestos (días)',      source: 'SMRP' },
    reactiveManHours: { value: 2000, label: 'HH reactivas/año',               source: 'McKinsey' },
  },
  hydro: {
    criticalFailures: { value: 0.6,  label: 'Fallas críticas / 2 años',      source: 'EPRI, XM' },
    avgStopDuration:  { value: 40,   label: 'Duración promedio de paro (h)',  source: 'EPRI' },
    mttr:             { value: 84,   label: 'MTTR (h)',                        source: 'IEEE' },
    sparePartsDelay:  { value: 75,   label: 'Demora en repuestos (días)',      source: 'SMRP' },
    reactiveManHours: { value: 1600, label: 'HH reactivas/año',               source: 'McKinsey' },
  },
}

// ---------------------------------------------------------------------------
// Exported functions
// ---------------------------------------------------------------------------

/**
 * Fills null operational fields using sector benchmarks.
 * Never overrides values that the user has already entered.
 *
 * @param {object} data  - Merged operational data (from getCompleteData)
 * @param {string} sector - Sector name from formData.client.sector
 * @returns {{ data: object, benchmarkApplied: object }}
 *   benchmarkApplied maps field names → { label, value, source, sector }
 */
export function applyOperationalBenchmarks(data, sector) {
  const sectorKey = (sector && SECTOR_OPERATIONAL_BENCHMARKS[sector]) ? sector : 'Otro'
  const benchmarks = SECTOR_OPERATIONAL_BENCHMARKS[sectorKey]
  const benchmarkApplied = {}
  const filled = { ...data }

  Object.entries(benchmarks).forEach(([field, { value, label, source }]) => {
    const current = filled[field]
    if (current === null || current === undefined || current === '') {
      filled[field] = value
      benchmarkApplied[field] = { label, value, source, sector: sectorKey }
    }
  })

  return { data: filled, benchmarkApplied }
}

/**
 * Fills null rotodynamic fields using turbine-type benchmarks.
 * Only benchmarks count/duration fields — cost fields are excluded.
 *
 * @param {object} data - Rotodynamic data from getCompleteData (already unit-converted)
 * @returns {{ data: object, benchmarkApplied: object }}
 */
export function applyRotodynamicBenchmarks(data) {
  const turbineType = data.turbineType
  if (!turbineType || !TURBINE_OPERATIONAL_BENCHMARKS[turbineType]) {
    return { data, benchmarkApplied: {} }
  }

  const benchmarks = TURBINE_OPERATIONAL_BENCHMARKS[turbineType]
  const benchmarkApplied = {}
  const filled = { ...data }

  Object.entries(benchmarks).forEach(([field, { value, label, source }]) => {
    const current = filled[field]
    if (current === null || current === undefined || current === '') {
      filled[field] = value
      benchmarkApplied[field] = { label, value, source, sector: turbineType }
    }
  })

  return { data: filled, benchmarkApplied }
}

/**
 * Given an object of factors, returns the list of names for factors
 * that were answered exclusively via benchmark estimation.
 */
export function getBenchmarkFields(factors) {
  return Object.values(factors)
    .filter(f => f.answered && f.answeredByBenchmark)
    .map(f => f.name)
}

export { SECTOR_OPERATIONAL_BENCHMARKS, TURBINE_OPERATIONAL_BENCHMARKS }
