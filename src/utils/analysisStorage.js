const STORAGE_KEY = 'roi_analyses_v1'

function generateId() {
  return 'analysis_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9)
}

export function getAllAnalyses() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const analyses = JSON.parse(raw)
    return Array.isArray(analyses) ? analyses : []
  } catch (err) {
    console.error('Error loading analyses:', err)
    return []
  }
}

export function getAnalysis(id) {
  const all = getAllAnalyses()
  return all.find(a => a.id === id) || null
}

export function saveAnalysis(data) {
  const { analystName, formData, results, currentStep, calculationType, serviceType, currency } = data
  const all = getAllAnalyses()

  const analysis = {
    id: generateId(),
    analystName: analystName || 'Sin nombre',
    savedAt: new Date().toISOString(),
    calculationType,
    serviceType,
    currency,
    currentStep,
    formData,
    results
  }

  all.unshift(analysis)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
    return analysis
  } catch (err) {
    console.error('Error saving analysis:', err)
    throw new Error('No se pudo guardar el análisis. El almacenamiento del navegador puede estar lleno.')
  }
}

export function deleteAnalysis(id) {
  const all = getAllAnalyses()
  const filtered = all.filter(a => a.id !== id)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    return true
  } catch (err) {
    console.error('Error deleting analysis:', err)
    return false
  }
}

export function clearAllAnalyses() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    return true
  } catch (err) {
    console.error('Error clearing analyses:', err)
    return false
  }
}
