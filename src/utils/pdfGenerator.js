import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export async function generatePDF(data, results) {
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 15
  const contentWidth = pageWidth - 2 * margin

  pdf.setFillColor(0, 43, 92)
  pdf.rect(0, 0, pageWidth, 40, 'F')

  try {
    const logoImg = document.querySelector('header img')
    if (logoImg && logoImg.complete && logoImg.naturalWidth > 0) {
      const canvas = await html2canvas(logoImg.parentElement, { 
        backgroundColor: '#002B5C',
        scale: 2
      })
      const logoDataUrl = canvas.toDataURL('image/png')
      pdf.addImage(logoDataUrl, 'PNG', margin, 5, 30, 30)
    }
  } catch (e) {
    console.log('Logo not available')
  }

  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(18)
  pdf.setFont('helvetica', 'bold')
  pdf.text('REPORTE DE RETORNO DE INVERSIÓN (ROI)', margin, 20)
  
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  pdf.text('Colectores de Vibración para Mantenimiento Predictivo', margin, 28)
  pdf.text('A-MAQ S.A. | Especialistas en Análisis de Vibración', margin, 35)

  let yPos = 50

  if (data.client?.companyName) {
    pdf.setTextColor(0, 43, 92)
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'bold')
    pdf.text('INFORMACIÓN DEL CLIENTE', margin, yPos)
    yPos += 8

    pdf.setDrawColor(0, 43, 92)
    pdf.setLineWidth(0.5)
    pdf.line(margin, yPos, pageWidth - margin, yPos)
    yPos += 6

    pdf.setTextColor(60, 60, 60)
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')

    const clientInfo = [
      ['Empresa:', data.client?.companyName || 'No especificado'],
      ['Sector:', data.client?.sector || 'No especificado'],
      ['Contacto:', data.client?.contactName || 'No especificado'],
      ['Fecha:', data.client?.evaluationDate || new Date().toLocaleDateString('es-CO')]
    ]

    clientInfo.forEach(([label, value], idx) => {
      pdf.setFont('helvetica', 'bold')
      pdf.text(label, margin + (idx % 2) * 80, yPos + Math.floor(idx / 2) * 6)
      pdf.setFont('helvetica', 'normal')
      pdf.text(value, margin + 25 + (idx % 2) * 80, yPos + Math.floor(idx / 2) * 6)
    })

    yPos += 20
  }

  pdf.setFillColor(0, 87, 155)
  pdf.roundedRect(margin, yPos, contentWidth, 45, 3, 3, 'F')
  
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(11)
  pdf.setFont('helvetica', 'bold')
  pdf.text('INDICADORES CLAVE DE RENTABILIDAD', margin + 5, yPos + 8)

  const kpis = [
    { label: 'ROI', value: `${results.roi?.toFixed(1) || 0}%` },
    { label: 'Payback', value: `${results.payback || 0} meses` },
    { label: 'Beneficio/Costo', value: results.benefitCostRatio?.toFixed(2) || '0' },
    { label: 'VAN', value: `$${(results.van / 1000000).toFixed(1)}M` },
    { label: 'TIR', value: `${results.tir?.toFixed(1) || 0}%` }
  ]

  const kpiWidth = contentWidth / kpis.length
  kpis.forEach((kpi, idx) => {
    const x = margin + 5 + idx * kpiWidth
    pdf.setFontSize(18)
    pdf.setFont('helvetica', 'bold')
    pdf.text(kpi.value, x + kpiWidth / 2, yPos + 22, { align: 'center' })
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'normal')
    pdf.text(kpi.label, x + kpiWidth / 2, yPos + 30, { align: 'center' })
  })

  yPos += 50

  const certaintyColor = results.certainty >= 80 ? [39, 174, 96] : results.certainty >= 50 ? [243, 156, 18] : [192, 57, 43]
  pdf.setFillColor(...certaintyColor, 30)
  pdf.roundedRect(margin, yPos, contentWidth, 20, 2, 2, 'F')
  
  pdf.setTextColor(...certaintyColor)
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'bold')
  pdf.text(`NIVEL DE CERTEZA: ${results.certainty}% (${results.certaintyInfo?.level || 'Media'})`, margin + 5, yPos + 12)
  pdf.setFont('helvetica', 'normal')
  pdf.text(`${Object.values(results.factors).filter(f => f.answered).length} de 8 factores calculados`, margin + contentWidth - 60, yPos + 12)

  yPos += 28

  pdf.setTextColor(0, 43, 92)
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.text('DESGLOSE DE AHORROS POR FACTOR', margin, yPos)
  yPos += 8

  pdf.setDrawColor(0, 43, 92)
  pdf.line(margin, yPos, pageWidth - margin, yPos)
  yPos += 6

  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(0, 43, 92)
  pdf.text('Factor', margin, yPos)
  pdf.text('Ahorro Anual', margin + 70, yPos)
  pdf.text('Ahorro Mensual', margin + 110, yPos)
  yPos += 5

  Object.values(results.factors)
    .filter(f => f.answered)
    .sort((a, b) => b.savings - a.savings)
    .forEach(factor => {
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(60, 60, 60)
      pdf.text(factor.name.substring(0, 35), margin, yPos)
      pdf.text(`$${(factor.savings / 1000000).toFixed(2)}M`, margin + 70, yPos)
      pdf.text(`$${(factor.savings / 12000000).toFixed(2)}M`, margin + 110, yPos)
      yPos += 5
    })

  yPos += 5
  pdf.setDrawColor(200, 200, 200)
  pdf.line(margin, yPos, pageWidth - margin, yPos)
  yPos += 5

  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(0, 43, 92)
  pdf.text('TOTAL AHORRO ANUAL:', margin, yPos)
  pdf.text(`$${(results.totalSavings / 1000000).toFixed(2)}M`, margin + 50, yPos)

  yPos += 20

  if (yPos > pageHeight - 60) {
    pdf.addPage()
    yPos = margin
  }

  pdf.setTextColor(0, 43, 92)
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.text('PROYECCIÓN DE BENEFICIO NETO ACUMULADO', margin, yPos)
  yPos += 8

  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(0, 43, 92)
  pdf.text('Año', margin, yPos)
  pdf.text('Ahorro Anual', margin + 30, yPos)
  pdf.text('Acumulado', margin + 65, yPos)
  pdf.text('ROI', margin + 95, yPos)
  yPos += 5

  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(60, 60, 60)

  if (results.projection && results.projection.length > 0) {
    results.projection.forEach(p => {
      pdf.text(`${p.year}`, margin, yPos)
      pdf.text(`$${(p.annualSavings / 1000000).toFixed(2)}M`, margin + 30, yPos)
      pdf.text(`$${(p.cumulative / 1000000).toFixed(2)}M`, margin + 65, yPos)
      pdf.text(`${p.roi?.toFixed(1) || 0}%`, margin + 95, yPos)
      yPos += 5
    })
  }

  if (results.missingFields && results.missingFields.length > 0) {
    yPos += 10
    pdf.setFillColor(255, 249, 230)
    pdf.roundedRect(margin, yPos, contentWidth, 25, 2, 2, 'F')
    
    pdf.setTextColor(180, 120, 0)
    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'bold')
    pdf.text('CAMPOS NO RESPONDIDOS:', margin + 3, yPos + 7)
    pdf.setFont('helvetica', 'normal')
    pdf.text(results.missingFields.join(', '), margin + 3, yPos + 14)
    pdf.text('Los resultados deben considerarse como estimación indicativa.', margin + 3, yPos + 20)
  }

  yPos = pageHeight - 30

  pdf.setFillColor(0, 43, 92)
  pdf.rect(0, yPos, pageWidth, 30, 'F')

  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(8)
  pdf.text('A-MAQ S.A. | Medellín, Colombia | Mantenimiento Predictivo y Análisis de Vibración | www.amaq.com', pageWidth / 2, yPos + 12, { align: 'center' })
  pdf.text('Las proyecciones de ahorro están basadas en benchmarks de industria (DOE, McKinsey, PWC). Los resultados reales pueden variar.', pageWidth / 2, yPos + 20, { align: 'center' })

  return pdf
}

export function downloadPDF(data, results, filename = 'ROI_Report_AMAQ.pdf') {
  generatePDF(data, results).then(pdf => {
    pdf.save(filename)
  })
}