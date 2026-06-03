export function formatMillionsCOP(value) {
  if (value === null || value === undefined || isNaN(value)) return '$0 MM COP'
  if (!isFinite(value)) return value < 0 ? '-∞' : '∞'
  const millions = value / 1_000_000
  const absMillions = Math.abs(millions)
  let formatted
  if (absMillions >= 1000) {
    formatted = millions.toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
  } else if (absMillions >= 100) {
    formatted = millions.toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
  } else {
    formatted = millions.toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 2 })
  }
  return `$${formatted} MM COP`
}

export function formatMMMixed(value) {
  if (value === null || value === undefined || isNaN(value)) return '$0'
  if (!isFinite(value)) return value < 0 ? '-∞' : '∞'
  const millions = value / 1_000_000
  const abs = Math.abs(millions)
  if (abs >= 1000) {
    return `$${millions.toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} MM`
  }
  if (abs >= 100) {
    return `$${millions.toFixed(1)} MM`
  }
  return `$${millions.toFixed(2)} MM`
}

export function formatMMShort(value) {
  if (value === null || value === undefined || isNaN(value)) return '$0'
  if (!isFinite(value)) return value < 0 ? '-∞' : '∞'
  const millions = value / 1_000_000
  const abs = Math.abs(millions)
  if (abs >= 1000) {
    return `$${millions.toLocaleString('es-CO', { maximumFractionDigits: 0 })} MM`
  }
  return `$${millions.toFixed(1)} MM`
}

export function formatCurrency(value, currency = 'COP') {
  if (!isFinite(value) || isNaN(value)) {
    return value < 0 ? '-∞' : value === 0 || isNaN(value) ? '$0' : '∞'
  }

  if (currency === 'USD') {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`
  }

  const millions = value / 1_000_000
  const abs = Math.abs(millions)
  if (abs >= 1000) {
    return `$${millions.toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} MM COP`
  }
  if (abs >= 100) {
    return `$${millions.toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} MM COP`
  }
  return `$${millions.toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 2 })} MM COP`
}

export function formatCurrencyCompact(value, currency = 'COP') {
  if (!isFinite(value) || isNaN(value)) return value < 0 ? '-∞' : value === 0 || isNaN(value) ? '$0' : '∞'
  
  const absValue = Math.abs(value)
  let formattedValue = value
  let suffix = ''

  if (currency === 'COP') {
    // In COP, values are usually in millions anyway due to exchange rate, but let's handle the raw value
    if (absValue >= 1_000_000_000) {
      formattedValue = value / 1_000_000_000
      suffix = 'B'
    } else if (absValue >= 1_000_000) {
      formattedValue = value / 1_000_000
      suffix = 'M'
    } else if (absValue >= 1_000) {
      formattedValue = value / 1_000
      suffix = 'K'
    }
    return `$${formattedValue.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 1 })}${suffix} COP`
  } else {
    // USD
    if (absValue >= 1_000_000_000) {
      formattedValue = value / 1_000_000_000
      suffix = 'B'
    } else if (absValue >= 1_000_000) {
      formattedValue = value / 1_000_000
      suffix = 'M'
    } else if (absValue >= 1_000) {
      formattedValue = value / 1_000
      suffix = 'K'
    }
    return `$${formattedValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 1 })}${suffix} USD`
  }
}