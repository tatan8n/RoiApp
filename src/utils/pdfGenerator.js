import jsPDF from 'jspdf'
import { formatMMMixed, formatMMShort } from './format'
import { ROI_DANGER_THRESHOLD } from './calculations'

export async function generatePDF(data, results) {
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 15
  const contentWidth = pageWidth - 2 * margin
  const navy = [0, 43, 92]
  const navyLight = [0, 110, 185]
  const green = [39, 174, 96]
  const greenDark = [30, 140, 76]

  let yPos = 0

  // === HEADER ===
  pdf.setFillColor(...navy)
  pdf.rect(0, 0, pageWidth, 42, 'F')

  try {
    const logoImg = document.querySelector('header img')
    if (logoImg && logoImg.complete && logoImg.naturalWidth > 0) {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(logoImg.parentElement, {
        backgroundColor: '#002B5C',
        scale: 2
      })
      const logoDataUrl = canvas.toDataURL('image/png')
      pdf.addImage(logoDataUrl, 'PNG', margin, 5, 42, 14)
    }
  } catch (e) {
    pdf.setFillColor(255, 255, 255)
    pdf.roundedRect(margin, 6, 24, 24, 3, 3, 'F')
    pdf.setTextColor(...navy)
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.text('A-MAQ', margin + 6, 21)
  }

  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(16)
  pdf.setFont('helvetica', 'bold')
  pdf.text('REPORTE DE RETORNO DE INVERSION (ROI)', margin + 50, 18)

  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'normal')
  pdf.text('A-MAQ S.A.', margin + 50, 25)

  const dateStr = data.client?.evaluationDate || new Date().toLocaleDateString('es-CO')
  pdf.setFontSize(8)
  pdf.text(`Fecha: ${dateStr}`, pageWidth - margin - 30, 18)

  yPos = 50

  // === CLIENT INFO ===
  pdf.setTextColor(...navy)
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.text('INFORMACION DEL CLIENTE', margin, yPos)
  yPos += 5

  pdf.setDrawColor(...navy)
  pdf.setLineWidth(0.8)
  pdf.line(margin, yPos, pageWidth - margin, yPos)
  yPos += 8

  pdf.setFontSize(10)
  const clientFields = [
    { label: 'Empresa', value: data.client?.companyName || 'No especificado' },
    { label: 'Sector', value: data.client?.sector || 'No especificado' },
    { label: 'Contacto', value: data.client?.contactName || 'No especificado' },
    { label: 'Fecha', value: dateStr }
  ]

  const colWidth = contentWidth / 2
  clientFields.forEach((field, idx) => {
    const col = idx % 2
    const row = Math.floor(idx / 2)
    const x = margin + col * colWidth

    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(80, 80, 80)
    pdf.text(field.label + ':', x + 2, yPos + row * 10)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(40, 40, 40)
    pdf.text(String(field.value).substring(0, 45), x + 28, yPos + row * 10)
  })
  yPos += 28

  // === EQUIPMENT INFO ===
  const models = [
    { id: 'vibriom', name: 'VibrioM', price: 21000000 },
    { id: 'va3pro', name: 'VA3pro', price: 68000000 },
    { id: 'va5pro', name: 'VA5pro', price: 115000000 }
  ]
  const selectedModel = models.find(m => m.id === data.equipment?.modelId)
  const investment = results.investment || data.equipment?.customPrice || selectedModel?.price || 0

  pdf.setFillColor(240, 245, 250)
  pdf.roundedRect(margin, yPos, contentWidth, 14, 2, 2, 'F')
  pdf.setTextColor(...navy)
  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Equipo:', margin + 4, yPos + 9)
  pdf.setFont('helvetica', 'normal')
  pdf.text(`${selectedModel?.name || 'Personalizado'} | Inversion: ${formatMMMixed(investment)} COP`, margin + 24, yPos + 9)
  yPos += 20

  // === KPI DASHBOARD ===
  pdf.setTextColor(...navy)
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.text('INDICADORES CLAVE DE RENTABILIDAD', margin, yPos)
  yPos += 7

  pdf.setFillColor(...navyLight)
  pdf.roundedRect(margin, yPos, contentWidth, 40, 4, 4, 'F')

  const kpis = [
    { label: 'ROI', value: `${results.roi?.toFixed(1) || 0}%`, color: results.roi > 0 ? [...green] : [192, 57, 43] },
    { label: 'Payback', value: `${results.payback || 0} meses`, color: [...navy] },
    { label: 'Beneficio/Costo', value: results.benefitCostRatio?.toFixed(2) || '0', color: results.benefitCostRatio > 1 ? [...green] : [243, 156, 18] },
    { label: 'VAN', value: formatMMShort(results.van), color: results.van > 0 ? [...green] : [192, 57, 43] },
    { label: 'TIR', value: `${results.tir?.toFixed(1) || 0}%`, color: results.tir > (data.financial?.discountRate * 100 || 12) ? [...green] : [243, 156, 18] }
  ]

  const kpiWidth = contentWidth / kpis.length
  kpis.forEach((kpi, idx) => {
    const x = margin + 2 + idx * kpiWidth

    pdf.setFillColor(...kpi.color, 25)
    pdf.roundedRect(x + 1, yPos + 4, kpiWidth - 4, 32, 2, 2, 'F')

    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    pdf.text(kpi.value, x + kpiWidth / 2 - 1, yPos + 18, { align: 'center' })

    pdf.setFontSize(7)
    pdf.setFont('helvetica', 'normal')
    pdf.text(kpi.label, x + kpiWidth / 2 - 1, yPos + 32, { align: 'center' })
  })

  yPos += 46

  // === CERTAINTY BAR ===
  const certaintyColor = results.certainty >= 80 ? [...green] : results.certainty >= 50 ? [243, 156, 18] : [192, 57, 43]
  pdf.setFillColor(...certaintyColor, 15)
  pdf.roundedRect(margin, yPos, contentWidth, 16, 2, 2, 'F')
  pdf.setFillColor(...certaintyColor)
  pdf.roundedRect(margin, yPos, contentWidth * (results.certainty / 100), 16, 2, 2, 'F')

  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'bold')
  pdf.text(`CERTEZA: ${results.certainty}% (${results.certaintyInfo?.level || 'Media'})`, margin + 5, yPos + 10)

  const answeredCount = Object.values(results.factors).filter(f => f.answered).length
  pdf.setFontSize(8)
  pdf.setFont('helvetica', 'normal')
  pdf.text(`${answeredCount} de 10 factores calculados`, pageWidth - margin - 50, yPos + 10)
  yPos += 22

  // === SUMMARY BAR ===
  pdf.setFillColor(240, 245, 250)
  pdf.roundedRect(margin, yPos, contentWidth, 18, 2, 2, 'F')

  const summaryItems = [
    { label: 'Inversion', value: formatMMMixed(investment) },
    { label: 'Ahorro Anual', value: formatMMMixed(results.totalSavings) },
    { label: 'Ahorro Mensual', value: formatMMMixed(results.monthlySavings) }
  ]
  const summaryWidth = contentWidth / 3
  summaryItems.forEach((item, idx) => {
    const x = margin + idx * summaryWidth
    pdf.setTextColor(...navy)
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'bold')
    pdf.text(item.label, x + summaryWidth / 2, yPos + 7, { align: 'center' })
    if (idx > 0) {
      pdf.setTextColor(...greenDark)
    } else {
      pdf.setTextColor(...navy)
    }
    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'bold')
    pdf.text(`${item.value} COP`, x + summaryWidth / 2, yPos + 15, { align: 'center' })
  })
  yPos += 24

  // === FACTOR TABLE ===
  if (yPos > pageHeight - 80) {
    pdf.addPage()
    yPos = margin
  }

  pdf.setTextColor(...navy)
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.text('DESGLOSE DE AHORROS POR FACTOR', margin, yPos)
  yPos += 6

  pdf.setDrawColor(...navy)
  pdf.setLineWidth(0.5)
  pdf.line(margin, yPos, pageWidth - margin, yPos)
  yPos += 6

  const answeredFactors = Object.values(results.factors)
    .filter(f => f.answered)
    .sort((a, b) => b.savings - a.savings)

  const dominantFactors = results.dominantFactors || []
  const roiWarning = results.roiWarning || false
  const totalSavings = results.totalSavings || 0

  if (roiWarning) {
    const isDanger = results.roiSeverity === 'danger'
    pdf.setFillColor(isDanger ? 255 : 255, isDanger ? 220 : 235, isDanger ? 220 : 235)
    pdf.roundedRect(margin, yPos, contentWidth, 20, 2, 2, 'F')
    pdf.setTextColor(isDanger ? 180 : 180, isDanger ? 0 : 60, 0)
    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'bold')
    if (isDanger) {
      pdf.text('ATENCION: ROI > ' + ROI_DANGER_THRESHOLD + '% - Resultados poco realistas.', margin + 4, yPos + 7)
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(8)
      pdf.text('Verifique los datos ingresados. Mantenimiento predictivo raramente genera ROI > 500%.', margin + 4, yPos + 13)
    } else {
      pdf.text('AVISO: ROI > 300% - Resultados posiblemente sobreestimados.', margin + 4, yPos + 7)
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(8)
      pdf.text('Revise los factores dominantes y verifique los datos ingresados.', margin + 4, yPos + 13)
    }
    yPos += 24
  }

  if (results.savingsOverCap) {
    pdf.setFillColor(255, 249, 230)
    pdf.roundedRect(margin, yPos, contentWidth, 14, 2, 2, 'F')
    pdf.setTextColor(180, 120, 0)
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Ahorro desproporcionado: ' + results.savingsCapPct + '% de la facturacion anual (>15% tipico para PdM).', margin + 4, yPos + 9)
    yPos += 18
  }

  if (dominantFactors.length > 0 && yPos < pageHeight - 30) {
    pdf.setFillColor(255, 249, 230)
    pdf.roundedRect(margin, yPos, contentWidth, 14, 2, 2, 'F')
    pdf.setTextColor(180, 120, 0)
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'bold')
    const dominantNames = dominantFactors.map(df => `${df.name} (${df.ratio}%)`).join(', ')
    pdf.text('Factor dominante: ' + dominantNames, margin + 4, yPos + 9)
    yPos += 18
  }

  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(...navy)
  pdf.setTextColor(80, 80, 80)

  const col1 = margin
  const col2 = margin + 75
  const col3 = margin + 115
  const col4 = margin + 150

  pdf.text('Factor', col1, yPos)
  pdf.text('Actual', col2 + 15, yPos, { align: 'right' })
  pdf.text('Ahorro Anual', col3 + 15, yPos, { align: 'right' })
  pdf.text('Ahorro Mes', col4 + 30, yPos, { align: 'right' })
  yPos += 2

  pdf.setDrawColor(200, 200, 200)
  pdf.setLineWidth(0.3)
  pdf.line(margin, yPos, pageWidth - margin, yPos)
  yPos += 5

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(8)

  answeredFactors.forEach(factor => {
    if (yPos > pageHeight - 30) {
      pdf.addPage()
      yPos = margin
    }

    const isDominant = dominantFactors.some(df => df.name === factor.name)
    const savingsPct = totalSavings > 0 ? (factor.savings / totalSavings * 100).toFixed(0) : '0'
    const factorLabel = isDominant ? factor.name.substring(0, 30) + ` (${savingsPct}%)` : factor.name.substring(0, 38)

    pdf.setTextColor(60, 60, 60)
    pdf.text(factorLabel, col1, yPos)
    pdf.setTextColor(80, 80, 80)
    pdf.text(formatMMShort(factor.baseValue), col2 + 15, yPos, { align: 'right' })
    pdf.setTextColor(...greenDark)
    pdf.setFont('helvetica', 'bold')
    pdf.text(formatMMShort(factor.savings), col3 + 15, yPos, { align: 'right' })
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(80, 80, 80)
    pdf.text(formatMMShort(factor.savings / 12), col4 + 30, yPos, { align: 'right' })
    yPos += 6
  })

  yPos += 2
  pdf.setDrawColor(...navy)
  pdf.setLineWidth(0.8)
  pdf.line(margin, yPos, pageWidth - margin, yPos)
  yPos += 6

  pdf.setTextColor(...navy)
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'bold')
  pdf.text('TOTAL AHORRO ANUAL:', col1, yPos)
  pdf.setTextColor(...greenDark)
  pdf.text(formatMMMixed(results.totalSavings) + ' COP', col2, yPos)
  yPos += 14

  // === PROJECTION TABLE (NEW PAGE) ===
  pdf.addPage()
  yPos = margin

  pdf.setFillColor(...navy)
  pdf.rect(0, 0, pageWidth, 20, 'F')
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.text('PROYECCION DE BENEFICIO NETO ACUMULADO', pageWidth / 2, 13, { align: 'center' })
  yPos = 30

  pdf.setTextColor(...navy)
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Proyeccion a ' + (data.financial?.projectionYears || 5) + ' anos - Tasa de descuento: ' + ((data.financial?.discountRate || 0.12) * 100).toFixed(0) + '%', margin, yPos)
  yPos += 10

  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(...navy)

  const pCols = [margin, margin + 30, margin + 70, margin + 115, margin + 155]
  pdf.text('Ano', pCols[0], yPos)
  pdf.text('Ahorro Anual', pCols[1], yPos)
  pdf.text('Acumulado', pCols[2], yPos)
  pdf.text('ROI Acumulado', pCols[3], yPos)
  pdf.text('Estado', pCols[4], yPos)
  yPos += 2

  pdf.setDrawColor(...navy)
  pdf.setLineWidth(0.5)
  pdf.line(margin, yPos, pageWidth - margin, yPos)
  yPos += 5

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(9)

  if (results.projection && results.projection.length > 0) {
    results.projection.forEach(p => {
      if (yPos > pageHeight - 25) {
        pdf.addPage()
        yPos = margin
      }

      const isPositive = p.cumulative >= 0
      pdf.setTextColor(60, 60, 60)
      pdf.text(`Ano ${p.year}`, pCols[0], yPos)
      pdf.text(formatMMMixed(p.annualSavings), pCols[1], yPos)
      pdf.text(formatMMMixed(p.cumulative), pCols[2], yPos)
      pdf.text(`${p.roi?.toFixed(1) || 0}%`, pCols[3], yPos)

      if (isPositive) {
        pdf.setTextColor(...green)
        pdf.text('Rentable', pCols[4], yPos)
      } else {
        pdf.setTextColor(192, 57, 43)
        pdf.text('En recuperacion', pCols[4], yPos)
      }
      yPos += 7
    })
  }

  yPos += 5

  pdf.setFillColor(240, 245, 250)
  pdf.roundedRect(margin, yPos, contentWidth, 16, 2, 2, 'F')
  pdf.setTextColor(...navy)
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'bold')
  pdf.text(`Beneficio Neto Final (Ano ${results.projection?.length || 5}): ${formatMMMixed(results.projection?.[results.projection.length - 1]?.cumulative || 0)} COP`, margin + 5, yPos + 10)

  yPos += 26

  // === MISSING FIELDS WARNING ===
  if (results.missingFields && results.missingFields.length > 0) {
    if (yPos > pageHeight - 40) {
      pdf.addPage()
      yPos = margin
    }

    pdf.setFillColor(255, 249, 230)
    pdf.roundedRect(margin, yPos, contentWidth, 22, 2, 2, 'F')
    pdf.setDrawColor(243, 156, 18)
    pdf.setLineWidth(0.5)
    pdf.roundedRect(margin, yPos, contentWidth, 22, 2, 2, 'S')

    pdf.setTextColor(180, 120, 0)
    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'bold')
    pdf.text('CAMPOS NO RESPONDIDOS:', margin + 4, yPos + 8)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(8)
    const missingText = results.missingFields.join(', ')
    pdf.text(missingText.substring(0, 120), margin + 4, yPos + 14)
    if (missingText.length > 120) {
      pdf.text(missingText.substring(120, 240), margin + 4, yPos + 19)
    }
    pdf.text('Los resultados deben considerarse como estimacion indicativa.', margin + 4, yPos + (missingText.length > 120 ? 24 : 19))
  }

  // === MAN-HOUR COST INFO ===
  if (results.manHourCost > 0) {
    yPos += 30
    if (yPos > pageHeight - 25) {
      pdf.addPage()
      yPos = margin
    }
    pdf.setFillColor(240, 245, 250)
    pdf.roundedRect(margin, yPos, contentWidth, 12, 2, 2, 'F')
    pdf.setTextColor(...navy)
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'normal')
    pdf.text(`Nota: Costo hora-hombre calculado como $${results.manHourCost.toLocaleString('de-DE', { maximumFractionDigits: 0 })} COP/h (salario mensual x factor prestacional 1.75 / 240h mes)`, margin + 4, yPos + 7)
  }

  // === FOOTER ON EVERY PAGE ===
  const totalPages = pdf.internal.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i)
    const footerY = pageHeight - 22

    pdf.setFillColor(...navy)
    pdf.rect(0, footerY, pageWidth, 22, 'F')

    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(7)
    pdf.setFont('helvetica', 'bold')
    pdf.text('A-MAQ S.A. | Medellin, Colombia | Mantenimiento Predictivo y Analisis de Vibracion', pageWidth / 2, footerY + 7, { align: 'center' })
    pdf.setFont('helvetica', 'normal')
    pdf.text('Proyecciones basadas en benchmarks de industria (DOE, McKinsey, PWC). Resultados reales pueden variar.', pageWidth / 2, footerY + 13, { align: 'center' })
    pdf.text(`Pagina ${i} de ${totalPages}`, pageWidth / 2, footerY + 19, { align: 'center' })
  }

  return pdf
}

export function downloadPDF(data, results, filename = 'ROI_Report_AMAQ.pdf') {
  generatePDF(data, results).then(pdf => {
    pdf.save(filename)
  })
}