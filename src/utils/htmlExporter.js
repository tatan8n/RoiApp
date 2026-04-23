import { EQUIPMENT_MODELS, SERVICE_TYPES } from './constants.js'
import { formatMillionsCOP } from './format.js'

export function generateHTML(formData, results) {
  const isProduct = formData.calculationType === 'product'
  const isService = formData.calculationType === 'service'
  const isContratoMarco = isService && formData.serviceType === 'contrato_marco'
  const selectedModel = EQUIPMENT_MODELS.find(m => m.id === formData.equipment?.modelId)
  const selectedService = SERVICE_TYPES.find(s => s.id === formData.serviceType)

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

  const formatCurrency = formatMillionsCOP

  const factorsData = Object.values(results.factors)
    .filter(f => f.answered)
    .sort((a, b) => b.savings - a.savings)

  const factorsLabels = factorsData.map(f => f.name)
  const factorsSavings = factorsData.map(f => f.savings)

  const projectionYears = results.projection.map(p => `Año ${p.year}`)
  const projectionCumulative = results.projection.map(p => p.cumulative)

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reporte ROI - ${formData.client?.companyName || 'Cliente'}</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f0f4f8; color: #1a365d; }
    .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #002b5c 0%, #004080 100%); color: white; padding: 30px; border-radius: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
    .header-left h1 { font-size: 28px; margin-bottom: 8px; }
    .header-left p { opacity: 0.9; }
    .header-right { text-align: right; }
    .header-right .date { opacity: 0.8; font-size: 14px; }
    .badge { background: #27ae60; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-top: 8px; display: inline-block; }
    .kpi-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; margin-bottom: 24px; }
    .kpi-card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); text-align: center; }
    .kpi-card .value { font-size: 28px; font-weight: 700; margin-bottom: 4px; }
    .kpi-card .title { font-size: 14px; color: #64748b; }
    .kpi-card .subtitle { font-size: 11px; color: #94a3b8; margin-top: 4px; }
    .card { background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); padding: 24px; margin-bottom: 24px; }
    .card-title { font-size: 18px; font-weight: 700; color: #1e3a5f; margin-bottom: 16px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; }
    .alert { padding: 16px; border-radius: 10px; margin-bottom: 16px; display: flex; align-items: flex-start; gap: 12px; }
    .alert-warning { background: #fffbeb; border: 1px solid #fcd34d; }
    .alert-danger { background: #fef2f2; border: 1px solid #fca5a5; }
    .alert-info { background: #eff6ff; border: 1px solid #93c5fd; }
    .alert-icon { font-size: 20px; }
    .alert-content h4 { font-size: 14px; margin-bottom: 4px; }
    .alert-content p { font-size: 12px; opacity: 0.8; }
    .info-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    .info-item label { font-size: 12px; color: #64748b; display: block; margin-bottom: 4px; }
    .info-item .value { font-size: 18px; font-weight: 600; }
    .charts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    .chart-container { position: relative; height: 300px; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #f8fafc; text-align: left; padding: 12px; font-size: 12px; color: #64748b; font-weight: 600; border-bottom: 2px solid #e2e8f0; }
    td { padding: 12px; font-size: 13px; border-bottom: 1px solid #e2e8f0; }
    tr:hover { background: #f8fafc; }
    .text-right { text-align: right; }
    .text-green { color: #27ae60; font-weight: 600; }
    .text-muted { color: #94a3b8; }
    .tag { display: inline-block; background: #fef3c7; color: #92400e; font-size: 10px; padding: 2px 8px; border-radius: 10px; font-weight: 600; margin-left: 8px; }
    .footer { text-align: center; padding: 24px; color: #94a3b8; font-size: 12px; }
    .certainty-bar { background: #e2e8f0; border-radius: 8px; height: 12px; margin: 16px 0; overflow: hidden; }
    .certainty-fill { height: 100%; border-radius: 8px; transition: width 1s ease; }
    .summary-bar { display: flex; justify-content: space-around; padding: 20px; background: #f8fafc; border-radius: 12px; margin: 16px 0; }
    .summary-item { text-align: center; }
    .summary-item label { font-size: 12px; color: #64748b; display: block; }
    .summary-item .value { font-size: 20px; font-weight: 700; color: #1e3a5f; }
    .summary-item .value.green { color: #27ae60; }
    .nav-link { display: inline-flex; align-items: center; gap: 8px; color: #64748b; text-decoration: none; font-size: 14px; margin-bottom: 16px; }
    .nav-link:hover { color: #1e3a5f; }
  </style>
</head>
<body>
  <div class="container">
    <a href="#" class="nav-link" onclick="window.print(); return false;">🖨️ Imprimir / Guardar como PDF</a>

    <div class="header">
      <div class="header-left">
        <h1>📊 REPORTE DE RETORNO DE INVERSIÓN (ROI)</h1>
        <p>Análisis de Viabilidad - ${formData.client?.companyName || 'Cliente'}</p>
      </div>
      <div class="header-right">
        <p class="date">Fecha: ${new Date().toLocaleDateString('es-CO')}</p>
        <p class="date">Sector: ${formData.client?.sector || 'No especificado'}</p>
        <div class="badge">Certeza: ${results.certainty}%</div>
      </div>
    </div>

    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="value" style="color: ${results.roi > 0 ? '#27ae60' : '#dc2626'}">${results.roi?.toFixed(1) || 0}%</div>
        <div class="title">ROI</div>
        <div class="subtitle">Retorno de inversión</div>
      </div>
      <div class="kpi-card">
        <div class="value" style="color: #002b5c">${results.payback || 0}</div>
        <div class="title">Payback</div>
        <div class="subtitle">Meses</div>
      </div>
      <div class="kpi-card">
        <div class="value" style="color: ${results.benefitCostRatio > 1 ? '#27ae60' : '#f59e0b'}">${results.benefitCostRatio?.toFixed(2) || '0'}</div>
        <div class="title">Beneficio/Costo</div>
        <div class="subtitle">Ratio B/C</div>
      </div>
      <div class="kpi-card">
        <div class="value" style="color: ${results.van > 0 ? '#27ae60' : '#dc2626'}">${formatCurrency(results.van)}</div>
        <div class="title">VAN</div>
        <div class="subtitle">Valor Actual Neto</div>
      </div>
      <div class="kpi-card">
        <div class="value" style="color: ${results.tir > 12 ? '#27ae60' : '#f59e0b'}">${results.tir?.toFixed(1) || 0}%</div>
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
        <p>El ahorro anual representa el ${results.savingsCapPct}% de la facturación anual, lo cual supera el 15% típico para mantenimiento predictivo.</p>
      </div>
    </div>
    ` : ''}

    ${(results.dominantFactors?.length || 0) > 0 ? `
    <div class="alert alert-warning">
      <span class="alert-icon">⚠️</span>
      <div class="alert-content">
        <h4>Factor(es) dominante(s) detectado(s)</h4>
        <p>${results.dominantFactors.map(df => `${df.name} (${df.ratio}% del ahorro total)`).join(', ')}. Un solo factor domina el resultado.</p>
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
          <div class="value">${formatCurrency(results.investment)}</div>
        </div>
        <div class="info-item">
          <label>Ahorro Anual</label>
          <div class="value" style="color: #27ae60">${formatCurrency(results.totalSavings)}</div>
        </div>
        <div class="info-item">
          <label>Ahorro Mensual</label>
          <div class="value" style="color: #27ae60">${formatCurrency(results.monthlySavings)}</div>
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
              <td class="text-right">${formatCurrency(f.baseValue)}</td>
              <td class="text-right text-green">${formatCurrency(f.savings)}</td>
              <td class="text-right text-muted">${formatCurrency(f.savings / 12)}</td>
            </tr>
          `}).join('')}
          <tr style="background: #f8fafc; font-weight: 700;">
            <td>TOTAL</td>
            <td class="text-right">-</td>
            <td class="text-right text-green">${formatCurrency(results.totalSavings)}</td>
            <td class="text-right text-muted">${formatCurrency(results.monthlySavings)}</td>
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
          ${results.projection.map(p => `
          <tr>
            <td>Año ${p.year}</td>
            <td class="text-right">${formatCurrency(p.annualSavings)}</td>
            <td class="text-right text-green">${formatCurrency(p.cumulative)}</td>
            <td class="text-right">${p.roi.toFixed(1)}%</td>
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
    const projectionData = ${JSON.stringify(results.projection)};

    const factorsCtx = document.getElementById('factorsChart').getContext('2d');
    new Chart(factorsCtx, {
      type: 'bar',
      data: {
        labels: ${JSON.stringify(factorsLabels)},
        datasets: [{
          label: 'Ahorro Anual (COP)',
          data: ${JSON.stringify(factorsSavings)},
          backgroundColor: '#27ae60',
          borderColor: '#229954',
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
                return new Intl.NumberFormat('es-CO').format(context.raw) + ' COP'
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
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
          label: 'Beneficio Acumulado (COP)',
          data: ${JSON.stringify(projectionCumulative)},
          borderColor: '#002b5c',
          backgroundColor: 'rgba(0, 43, 92, 0.1)',
          fill: true,
          tension: 0.3,
          pointBackgroundColor: '#002b5c',
          pointRadius: 6,
          pointHoverRadius: 8
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
                return new Intl.NumberFormat('es-CO').format(context.raw) + ' COP'
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
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
  const html = generateHTML(formData, results)
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}