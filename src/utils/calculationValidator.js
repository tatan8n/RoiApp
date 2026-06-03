/**
 * Centralized validation module for ROI calculations.
 * Detects extreme scenarios, applies conservative caps,
 * and generates descriptive warnings.
 */

import { MAX_REASONABLE_ROI, MAX_SAVINGS_PCT_OF_REVENUE } from './constants.js'

/**
 * Validates input data before calculation.
 * Returns { isValid, warnings[], adjustments[] }
 */
export function validateInputData(data, calcType) {
  const warnings = []
  const adjustments = []
  
  // Check for zero investment
  if (!data.investment || data.investment <= 0) {
    warnings.push({ field: 'investment', severity: 'error', message: 'La inversión debe ser mayor a cero para calcular el ROI.' })
  }
  
  // Check for unrealistic asset counts
  if (data.criticalAssets > data.totalAssets && data.totalAssets > 0) {
    adjustments.push({ field: 'criticalAssets', from: data.criticalAssets, to: data.totalAssets, reason: 'Activos críticos no pueden superar el total de activos' })
    data.criticalAssets = data.totalAssets
  }
  
  // Check for negative values in cost fields
  const costFields = ['costPerHourStop', 'avgCriticalAssetValue', 'monthlyBilling', 'preventiveMaintenanceCost']
  costFields.forEach(field => {
    if (data[field] < 0) {
      warnings.push({ field, severity: 'warning', message: `${field} tiene un valor negativo. Se usará 0.` })
      data[field] = 0
    }
  })
  
  return { isValid: warnings.filter(w => w.severity === 'error').length === 0, warnings, adjustments, data }
}

/**
 * Validates calculation results and applies sanity caps.
 * Returns adjusted results with explanations.
 */
export function validateResults(results, data) {
  const adjustments = []
  
  // Cap ROI
  if (results.roi > MAX_REASONABLE_ROI) {
    adjustments.push({ metric: 'ROI', original: results.roi, capped: MAX_REASONABLE_ROI, reason: `ROI original de ${results.roi.toFixed(0)}% excede el máximo razonable. Verifique los datos de entrada.` })
    results.roiOriginal = results.roi
    results.roi = MAX_REASONABLE_ROI
    results.roiWasCapped = true
  }
  
  // Cap savings vs revenue
  const annualRevenue = (data.monthlyBilling || 0) * 12
  if (annualRevenue > 0 && results.totalSavings > annualRevenue * MAX_SAVINGS_PCT_OF_REVENUE) {
    const cappedSavings = annualRevenue * MAX_SAVINGS_PCT_OF_REVENUE
    adjustments.push({ metric: 'totalSavings', original: results.totalSavings, capped: cappedSavings, reason: `Ahorro anual (${(results.totalSavings/annualRevenue*100).toFixed(0)}% de facturación) excede el 30% máximo razonable.` })
    results.savingsOriginal = results.totalSavings
    results.totalSavings = cappedSavings
    results.savingsWereCapped = true
  }
  
  // Validate TIR
  if (isNaN(results.tir) || !isFinite(results.tir)) {
    results.tir = 0
    adjustments.push({ metric: 'TIR', reason: 'TIR no calculable con los datos proporcionados.' })
  }
  
  // Validate VAN
  if (isNaN(results.van) || !isFinite(results.van)) {
    results.van = 0
    adjustments.push({ metric: 'VAN', reason: 'VAN no calculable con los datos proporcionados.' })
  }
  
  results.adjustments = adjustments
  return results
}
