export function formatMillionsCOP(value) {
  if (value === null || value === undefined || isNaN(value)) return '$0 MM COP'
  const millions = value / 1_000_000
  const absMillions = Math.abs(millions)
  let formatted
  if (absMillions >= 1000) {
    formatted = millions.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
  } else if (absMillions >= 100) {
    formatted = millions.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
  } else {
    formatted = millions.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 2 })
  }
  return `$${formatted} MM COP`
}

export function formatMMMixed(value) {
  if (value === null || value === undefined || isNaN(value)) return '$0'
  const millions = value / 1_000_000
  const abs = Math.abs(millions)
  if (abs >= 1000) {
    return `$${millions.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} MM`
  }
  if (abs >= 100) {
    return `$${millions.toFixed(1)} MM`
  }
  return `$${millions.toFixed(2)} MM`
}

export function formatMMShort(value) {
  if (value === null || value === undefined || isNaN(value)) return '$0'
  const millions = value / 1_000_000
  const abs = Math.abs(millions)
  if (abs >= 1000) {
    return `$${millions.toLocaleString('de-DE', { maximumFractionDigits: 0 })} MM`
  }
  return `$${millions.toFixed(1)} MM`
}

export function formatCurrency(value, currency = 'COP') {
  if (value === null || value === undefined || isNaN(value)) {
    return currency === 'USD' ? '$0 USD' : '$0 MM COP'
  }

  if (currency === 'USD') {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`
  }

  const millions = value / 1_000_000
  const abs = Math.abs(millions)
  if (abs >= 1000) {
    return `$${millions.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} MM COP`
  }
  if (abs >= 100) {
    return `$${millions.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} MM COP`
  }
  return `$${millions.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 2 })} MM COP`
}