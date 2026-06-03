import { EQUIPMENT_MODELS, SERVICE_TYPES } from './constants.js'

export function generateHTML(formData, results) {
  const isProduct = formData.calculationType === 'product'
  const isService = formData.calculationType === 'service'
  const isContratoMarco = isService && formData.serviceType === 'contrato_marco'
  const selectedModel = EQUIPMENT_MODELS.find(m => m.id === formData.equipment?.modelId)
  const selectedService = SERVICE_TYPES.find(s => s.id === formData.serviceType)

  const escapeHtml = (unsafe) => {
    return (unsafe || '').toString()
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
  }

  const getSelectedItemName = () => {
    if (isProduct) {
      return selectedModel?.name || 'Personalizado'
    }
    if (isContratoMarco) {
      return 'Contrato Marco'
    }
    return selectedService?.name || 'Servicio'
  }

  const getSelectedItemLabel = () => {
    if (isProduct) {
      return 'Equipo Seleccionado'
    }
    return 'Servicio Seleccionado'
  }

  const currency = formData.currency || 'COP'

  const fmt = (value) => {
    if (!isFinite(value) || isNaN(value)) return value < 0 ? '-∞' : value === 0 || isNaN(value) ? '$0' : '∞'
    if (currency === 'USD') {
      return `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} USD`
    }
    const millions = value / 1_000_000
    const abs = Math.abs(millions)
    if (abs >= 1000) {
      return `$${millions.toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} MM COP`
    }
    return `$${millions.toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} MM COP`
  }

  const currencyLabel = currency === 'USD' ? 'USD' : 'MM COP'
  const currencySuffix = currency === 'USD' ? ' USD' : ' COP'
  const currencyLabelChart = currency === 'USD' ? 'USD' : 'COP'

  const factors = results.factors || {}
  const factorsData = Object.values(factors)
    .filter(f => f && f.answered)
    .sort((a, b) => (b.savings || 0) - (a.savings || 0))

  const factorsLabels = factorsData.map(f => f.name || '')
  const factorsSavings = factorsData.map(f => f.savings || 0)

  const projection = results.projection || []
  const projectionYears = projection.map(p => `Año ${p?.year || ''}`)
  const projectionCumulative = projection.map(p => p?.cumulative || 0)

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reporte ROI - ${escapeHtml(formData.client?.companyName || 'Cliente')}</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0b0f19; color: #f8fafc; }
    .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #1e3a8a 0%, #0ea5e9 100%); color: white; padding: 30px; border-radius: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 0 20px rgba(14, 165, 233, 0.3); }
    .header-left h1 { font-size: 28px; margin-bottom: 8px; text-shadow: 0 2px 4px rgba(0,0,0,0.3); }
    .header-left p { opacity: 0.9; }
    .header-right { text-align: right; }
    .header-right .date { opacity: 0.8; font-size: 14px; }
    .badge { background: rgba(39, 174, 96, 0.8); backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-top: 8px; display: inline-block; }
    .kpi-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; margin-bottom: 24px; }
    .kpi-card { background: rgba(30, 41, 59, 0.5); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); text-align: center; transition: transform 0.2s; }
    .kpi-card:hover { transform: translateY(-2px); border-color: rgba(0, 212, 255, 0.3); box-shadow: 0 0 15px rgba(0, 212, 255, 0.1); }
    .kpi-card .value { font-size: 28px; font-weight: 700; margin-bottom: 4px; text-shadow: 0 2px 10px rgba(255,255,255,0.1); }
    .kpi-card .title { font-size: 14px; color: #94a3b8; }
    .kpi-card .subtitle { font-size: 11px; color: #64748b; margin-top: 4px; }
    .card { background: rgba(30, 41, 59, 0.5); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); padding: 24px; margin-bottom: 24px; }
    .card-title { font-size: 18px; font-weight: 700; color: #e2e8f0; margin-bottom: 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 8px; }
    .alert { padding: 16px; border-radius: 10px; margin-bottom: 16px; display: flex; align-items: flex-start; gap: 12px; backdrop-filter: blur(8px); }
    .alert-warning { background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); color: #fcd34d; }
    .alert-danger { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #fca5a5; }
    .alert-info { background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.3); color: #bae6fd; }
    .alert-icon { font-size: 20px; }
    .alert-content h4 { font-size: 14px; margin-bottom: 4px; color: #ffffff; }
    .alert-content p { font-size: 12px; opacity: 0.9; color: inherit; }
    .info-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    .info-item label { font-size: 12px; color: #94a3b8; display: block; margin-bottom: 4px; }
    .info-item .value { font-size: 18px; font-weight: 600; color: #e2e8f0; }
    .charts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    .chart-container { position: relative; height: 300px; }
    table { width: 100%; border-collapse: separate; border-spacing: 0; }
    th { background: rgba(15, 23, 42, 0.6); text-align: left; padding: 12px; font-size: 12px; color: #94a3b8; font-weight: 600; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
    td { padding: 12px; font-size: 13px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); color: #cbd5e1; }
    tr:hover td { background: rgba(255, 255, 255, 0.02); }
    .text-right { text-align: right; }
    .text-green { color: #4ade80; font-weight: 600; text-shadow: 0 0 8px rgba(74, 222, 128, 0.3); }
    .text-muted { color: #64748b; }
    .tag { display: inline-block; background: rgba(245, 158, 11, 0.2); color: #fcd34d; font-size: 10px; padding: 2px 8px; border-radius: 10px; font-weight: 600; margin-left: 8px; border: 1px solid rgba(245, 158, 11, 0.3); }
    .footer { text-align: center; padding: 24px; color: #64748b; font-size: 12px; }
    .certainty-bar { background: rgba(15, 23, 42, 0.6); border-radius: 8px; height: 12px; margin: 16px 0; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.05); }
    .certainty-fill { height: 100%; border-radius: 8px; transition: width 1s ease; box-shadow: 0 0 10px currentColor; }
    .nav-link { display: inline-flex; align-items: center; gap: 8px; color: #94a3b8; text-decoration: none; font-size: 14px; margin-bottom: 16px; padding: 8px 16px; background: rgba(30, 41, 59, 0.5); border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.1); transition: all 0.2s; }
    .nav-link:hover { color: #e2e8f0; background: rgba(30, 41, 59, 0.8); border-color: rgba(255, 255, 255, 0.2); }
  </style>
</head>
<body>
  <div class="container">
    <a href="#" class="nav-link" onclick="window.print(); return false;">🖨️ Imprimir / Guardar como PDF</a>

    <div class="header">
      <div class="header-left">
        <h1>📊 REPORTE DE RETORNO DE INVERSIÓN (ROI)</h1>
        <p>Análisis de Viabilidad - ${escapeHtml(formData.client?.companyName || 'Cliente')}</p>
      </div>
      <div class="header-right">
        <p class="date">Fecha: ${new Date().toLocaleDateString('es-CO')}</p>
        <p class="date">Sector: ${escapeHtml(formData.client?.sector || 'No especificado')}</p>
        <div class="badge">Certeza: ${results.certainty}%</div>
      </div>
    </div>

    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="value" style="color: ${results.roi > 0 ? '#4ade80' : '#f87171'}">${results.roi?.toFixed(1) || 0}%</div>
        <div class="title">ROI</div>
        <div class="subtitle">Retorno en ${results.projectionYears || 5} años</div>
      </div>
      <div class="kpi-card">
        <div class="value" style="color: #38bdf8">${results.payback || 0}</div>
        <div class="title">Payback</div>
        <div class="subtitle">Meses</div>
      </div>
      <div class="kpi-card">
        <div class="value" style="color: ${results.benefitCostRatio > 1 ? '#4ade80' : '#fbbf24'}">${results.benefitCostRatio?.toFixed(2) || '0'}</div>
        <div class="title">Beneficio/Costo</div>
        <div class="subtitle">Ratio B/C</div>
      </div>
      <div class="kpi-card">
        <div class="value" style="color: ${results.van > 0 ? '#4ade80' : '#f87171'}">${fmt(results.van)}</div>
        <div class="title">VAN</div>
        <div class="subtitle">Valor Actual Neto</div>
      </div>
      <div class="kpi-card">
        <div class="value" style="color: ${results.tir > 12 ? '#4ade80' : '#fbbf24'}">${results.tir?.toFixed(1) || 0}%</div>
        <div class="title">TIR</div>
        <div class="subtitle">Tasa Interna de Retorno</div>
      </div>
    </div>

    ${results.certainty < 100 ? `
    <div class="card">
      <div class="card-title">Nivel de Certeza del Análisis</div>
      <div style="display: flex; align-items: center; gap: 16px;">
        <div style="flex: 1;">
          <div class="certainty-bar">
            <div class="certainty-fill" style="width: ${results.certainty}%; background: ${results.certainty >= 80 ? '#27ae60' : results.certainty >= 50 ? '#f59e0b' : '#dc2626'}"></div>
          </div>
        </div>
        <span style="font-weight: 700; color: ${results.certainty >= 80 ? '#27ae60' : results.certainty >= 50 ? '#f59e0b' : '#dc2626'};">${results.certainty >= 80 ? 'Alta' : results.certainty >= 50 ? 'Media' : 'Baja'}</span>
      </div>
    </div>
    ` : ''}

    ${results.roiWarning ? `
    <div class="alert ${results.roiSeverity === 'danger' ? 'alert-danger' : 'alert-warning'}">
      <span class="alert-icon">⚠️</span>
      <div class="alert-content">
        <h4>${results.roiSeverity === 'danger' ? 'Resultados poco realistas — verifique los datos' : 'Resultados posiblemente sobreestimados'}</h4>
        <p>${results.roiSeverity === 'danger'
          ? `El ROI supera el 500%, lo cual es muy poco probable para mantenimiento predictivo. Revise los datos ingresados.`
          : `El ROI supera el 300%, lo cual puede indicar que algunos datos producen ahorros poco realistas.`}</p>
      </div>
    </div>
    ` : ''}

    ${results.savingsOverCap ? `
    <div class="alert alert-warning">
      <span class="alert-icon">⚠️</span>
      <div class="alert-content">
        <h4>Ahorro total desproporcionado</h4>
        <p>El ahorro anual representa el ${results.savingsCapPct}% de la facturación anual, lo cual supera el 30% típico para mantenimiento predictivo en plantas de generación. Verifique que los datos sean correctos.</p>
      </div>
    </div>
    ` : ''}

    ${(results.dominantFactors?.length || 0) > 0 ? `
    <div class="alert alert-warning">
      <span class="alert-icon">⚠️</span>
      <div class="alert-content">
        <h4>Factor(es) dominante(s) detectado(s)</h4>
        <p>${(results.dominantFactors || []).map(df => `${df?.name || ''} (${df?.ratio || 0}% del ahorro total)`).join(', ')}. Un solo factor domina el resultado.</p>
      </div>
    </div>
    ` : ''}

    ${results.warnings && results.warnings.length > 0 ? `
    <div class="alert alert-info">
      <span class="alert-icon">💡</span>
      <div class="alert-content">
        <h4>Verificación de datos ingresados</h4>
        ${results.warnings.map(w => `<p>${w.message}</p>`).join('')}
      </div>
    </div>
    ` : ''}

    <div class="card">
      <div class="card-title">${isService ? 'Servicio' : 'Equipo'} y Resumen Financiero</div>
      <div class="info-grid">
        <div class="info-item">
          <label>${getSelectedItemLabel()}</label>
          <div class="value">${getSelectedItemName()}</div>
        </div>
        <div class="info-item">
          <label>Inversión Total</label>
          <div class="value">${fmt(results.investment)}</div>
        </div>
        <div class="info-item">
          <label>Ahorro Anual</label>
          <div class="value" style="color: #27ae60">${fmt(results.totalSavings)}</div>
        </div>
        <div class="info-item">
          <label>Ahorro Mensual</label>
          <div class="value" style="color: #27ae60">${fmt(results.monthlySavings)}</div>
        </div>
      </div>
    </div>

    <div class="charts-grid">
      <div class="card">
        <div class="card-title">Distribución de Ahorro por Factor</div>
        <div class="chart-container">
          <canvas id="factorsChart"></canvas>
        </div>
      </div>
      <div class="card">
        <div class="card-title">Proyección de Beneficios Acumulados</div>
        <div class="chart-container">
          <canvas id="timelineChart"></canvas>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-title">Detalle de Factores de Ahorro</div>
      <table>
        <thead>
          <tr>
            <th>Factor</th>
            <th class="text-right">Situación Actual</th>
            <th class="text-right">Ahorro Anual</th>
            <th class="text-right">Ahorro Mensual</th>
          </tr>
        </thead>
        <tbody>
          ${factorsData.map(f => {
            const isDominant = results.dominantFactors?.some(df => df.name === f.name)
            const savingsPct = results.totalSavings > 0 ? (f.savings / results.totalSavings * 100).toFixed(0) : 0
            return `
            <tr>
              <td>
                ${f.name}
                ${isDominant ? `<span class="tag">Dominante (${savingsPct}%)</span>` : ''}
              </td>
              <td class="text-right">${fmt(f.baseValue)}</td>
              <td class="text-right text-green">${fmt(f.savings)}</td>
              <td class="text-right text-muted">${fmt(f.savings / 12)}</td>
            </tr>
          `}).join('')}
          <tr style="background: rgba(15, 23, 42, 0.4); font-weight: 700;">
            <td>TOTAL</td>
            <td class="text-right">-</td>
            <td class="text-right text-green">${fmt(results.totalSavings)}</td>
            <td class="text-right text-muted">${fmt(results.monthlySavings)}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <div class="card-title">Proyección Anual Detallada</div>
      <table>
        <thead>
          <tr>
            <th>Año</th>
            <th class="text-right">Ahorro Anual</th>
            <th class="text-right">Beneficio Acumulado</th>
            <th class="text-right">ROI Acumulado</th>
          </tr>
        </thead>
        <tbody>
          ${(results.projection || []).map(p => `
          <tr>
            <td>Año ${p?.year || ''}</td>
            <td class="text-right">${fmt(p?.annualSavings)}</td>
            <td class="text-right text-green">${fmt(p?.cumulative)}</td>
            <td class="text-right">${(p?.roi || 0).toFixed(1)}%</td>
          </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    ${results.missingFields?.length > 0 ? `
    <div class="alert alert-info">
      <span class="alert-icon">💡</span>
      <div class="alert-content">
        <h4>Datos sugeridos para mejorar la certeza</h4>
        <p>Complete los siguientes campos para obtener un análisis más preciso: ${results.missingFields.join(', ')}</p>
      </div>
    </div>
    ` : ''}

    <div class="footer">
      <p>Generado por ROI Calculator A-MAQ S.A. | Este reporte es confidencial y para uso exclusivo del cliente</p>
    </div>
  </div>

  <script>
    const factorsData = ${JSON.stringify(factorsData)};
    const projectionData = ${JSON.stringify(results.projection || [])};

    const currencySuffix = '${currency === 'USD' ? ' USD' : ' COP'}'
    const currencyLabelChart = '${currency === 'USD' ? 'USD' : 'COP'}'

    const factorsCtx = document.getElementById('factorsChart').getContext('2d');
    new Chart(factorsCtx, {
      type: 'bar',
      data: {
        labels: ${JSON.stringify(factorsLabels)},
        datasets: [{
          label: 'Ahorro Anual (' + currencyLabelChart + ')',
          data: ${JSON.stringify(factorsSavings)},
          backgroundColor: 'rgba(0, 212, 255, 0.7)',
          borderColor: '#00d4ff',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(context) {
                return new Intl.NumberFormat('es-CO').format(context.raw) + '${currencySuffix}'
              }
            }
          }
        },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#cbd5e1' } },
          y: {
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: {
              color: '#cbd5e1',
              callback: function(value) {
                if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M'
                if (value >= 1000) return (value / 1000).toFixed(0) + 'K'
                return value
              }
            }
          }
        }
      }
    });

    const timelineCtx = document.getElementById('timelineChart').getContext('2d');
    new Chart(timelineCtx, {
      type: 'line',
      data: {
        labels: ${JSON.stringify(projectionYears)},
        datasets: [{
          label: 'Beneficio Acumulado (' + currencyLabelChart + ')',
          data: ${JSON.stringify(projectionCumulative)},
          borderColor: '#38bdf8',
          backgroundColor: 'rgba(56, 189, 248, 0.15)',
          fill: true,
          tension: 0.3,
          pointBackgroundColor: '#0ea5e9',
          pointRadius: 6,
          pointHoverRadius: 8,
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(context) {
                return new Intl.NumberFormat('es-CO').format(context.raw) + '${currencySuffix}'
              }
            }
          }
        },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#cbd5e1' } },
          y: {
            grid: { color: 'rgba(255,255,255,0.05)' },
            beginAtZero: true,
            ticks: {
              color: '#cbd5e1',
              callback: function(value) {
                if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M'
                if (value >= 1000) return (value / 1000).toFixed(0) + 'K'
                return value
              }
            }
          }
        }
      }
    });
  </script>
</body>
</html>`

  return html
}

export function downloadHTML(formData, results, filename = 'reporte_roi.html') {
  try {
    const html = generateHTML(formData, results)
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()

    // Delay cleanup so the browser has time to start the download
    setTimeout(() => {
      if (a.parentNode) {
        document.body.removeChild(a)
      }
      URL.revokeObjectURL(url)
    }, 1000)
  } catch (err) {
    console.error('Error al exportar HTML:', err)
    alert('Ocurrió un error al exportar el HTML. Por favor intente de nuevo.')
  }
}