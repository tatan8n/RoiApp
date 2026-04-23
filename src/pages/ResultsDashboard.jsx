import React from 'react'
import Header from '../components/Header'
import KPICard from '../components/KPICard'
import BenefitsChart from '../components/BenefitsChart'
import TimelineChart from '../components/TimelineChart'
import CertaintyMeter from '../components/CertaintyMeter'
import { COLORS, EQUIPMENT_MODELS } from '../utils/constants'
import { formatMillionsCOP } from '../utils/format'
import { ROI_WARNING_THRESHOLD, ROI_DANGER_THRESHOLD } from '../utils/calculations'

export default function ResultsDashboard({ formData, results, onBack, onExportPDF, onExportHTML }) {
  const selectedModel = EQUIPMENT_MODELS.find(m => m.id === formData.equipment.modelId)

  const formatCurrency = formatMillionsCOP

  const dominantFactors = results.dominantFactors || []
  const roiWarning = results.roiWarning || false
  const answeredFactors = Object.values(results.factors).filter(f => f.answered)
  const totalSavings = results.totalSavings

  return (
    <div className="min-h-screen bg-navy-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={onBack}
              className="flex items-center text-navy-600 hover:text-navy-800 mb-2"
            >
              ← Volver al formulario
            </button>
            <h1 className="text-2xl font-bold text-navy-900">
              Resultados del Análisis ROI
            </h1>
            <p className="text-navy-500">
              {formData.client.companyName || 'Cliente'} | {formData.client.sector || 'Sector'}
            </p>
          </div>
          <button
            onClick={onExportHTML}
            className="px-5 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-all shadow-lg flex items-center gap-2"
          >
            🌐 Exportar HTML
          </button>
          <button
            onClick={onExportPDF}
            className="px-6 py-3 bg-navy-700 text-white font-bold rounded-lg hover:bg-navy-800 transition-all shadow-lg flex items-center gap-2"
          >
            📄 Exportar PDF
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <KPICard
            title="ROI"
            value={`${results.roi?.toFixed(1) || 0}%`}
            subtitle="Retorno de inversión"
            color={results.roi > 0 ? COLORS.success : COLORS.danger}
            icon="📈"
          />
          <KPICard
            title="Payback"
            value={`${results.payback || 0}`}
            subtitle="meses"
            color={COLORS.navy[600]}
            icon="⏱️"
          />
          <KPICard
            title="Beneficio/Costo"
            value={results.benefitCostRatio?.toFixed(2) || '0'}
            subtitle="Ratio B/C"
            color={results.benefitCostRatio > 1 ? COLORS.success : COLORS.warning}
            icon="⚖️"
          />
          <KPICard
            title="VAN"
            value={formatCurrency(results.van)}
            subtitle="Valor Actual Neto"
            color={results.van > 0 ? COLORS.success : COLORS.danger}
            icon="💰"
          />
          <KPICard
            title="TIR"
            value={`${results.tir?.toFixed(1) || 0}%`}
            subtitle="Tasa Interna de Retorno"
            color={results.tir > (formData.financial?.discountRate * 100 || 12) ? COLORS.success : COLORS.warning}
            icon="📊"
          />
        </div>

        <CertaintyMeter
          certainty={results.certainty}
          missingFields={results.missingFields}
          levelInfo={results.certaintyInfo}
        />

        {roiWarning && (
          <div className={`mt-4 p-4 rounded-xl border ${results.roiSeverity === 'danger' ? 'bg-red-50 border-red-400' : 'bg-amber-50 border-amber-300'}`}>
            <div className="flex items-start">
              <span className="text-xl mr-3">&#9888;&#65039;</span>
              <div>
                <p className={`font-bold ${results.roiSeverity === 'danger' ? 'text-red-800' : 'text-amber-800'}`}>
                  {results.roiSeverity === 'danger'
                    ? 'Resultados poco realistas — verifique los datos'
                    : 'Resultados posiblemente sobreestimados'}
                </p>
                <p className={`text-sm mt-1 ${results.roiSeverity === 'danger' ? 'text-red-600' : 'text-amber-600'}`}>
                  {results.roiSeverity === 'danger'
                    ? `El ROI supera el ${ROI_DANGER_THRESHOLD}%, lo cual es muy poco probable para mantenimiento predictivo. Revise los datos ingresados, especialmente los factores dominantes.`
                    : `El ROI supera el ${ROI_WARNING_THRESHOLD}%, lo cual puede indicar que algunos datos producen ahorros poco realistas. Revise los factores marcados como dominantes.`}
                </p>
              </div>
            </div>
          </div>
        )}

        {results.savingsOverCap && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-300 rounded-xl">
            <div className="flex items-start">
              <span className="text-xl mr-3">&#9888;&#65039;</span>
              <div>
                <p className="text-amber-800 font-bold">Ahorro total desproporcionado</p>
                <p className="text-amber-600 text-sm mt-1">
                  El ahorro anual representa el {results.savingsCapPct}% de la facturaci&#243;n anual, lo cual supera el 15% t&#237;pico para mantenimiento predictivo (benchmark: PwC, DOE). Los ahorros de PdM raramente exceden el 10-15% de la facturaci&#243;n.
                </p>
              </div>
            </div>
          </div>
        )}

        {dominantFactors.length > 0 && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-300 rounded-xl">
            <div className="flex items-start">
              <span className="text-xl mr-3">&#9888;&#65039;</span>
              <div>
                <p className="text-amber-800 font-bold">Factor{dominantFactors.length > 1 ? 'es' : ''} dominante{dominantFactors.length > 1 ? 's' : ''} detectado{dominantFactors.length > 1 ? 's' : ''}</p>
                <p className="text-amber-600 text-sm mt-1">
                  {dominantFactors.map(df => `${df.name} (${df.ratio}% del ahorro total)`).join(', ')}.
                  Un solo factor domina el resultado, lo que puede reducir la confiabilidad de la proyecci&#243;n. Considere verificar los datos de ese factor.
                </p>
              </div>
            </div>
          </div>
        )}

        {results.certainty < 70 && results.missingFields && results.missingFields.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-300 rounded-xl">
            <div className="flex items-start">
              <span className="text-xl mr-3">&#128161;</span>
              <div>
                <p className="text-blue-800 font-bold">Datos sugeridos para mejorar la certeza</p>
                <p className="text-blue-600 text-sm mt-1">
                  Complete los siguientes campos para obtener un an&#225;lisis m&#225;s preciso:
                </p>
                <ul className="text-blue-600 text-sm mt-2 list-disc list-inside">
                  {results.missingFields.map((field, idx) => (
                    <li key={idx}>{field}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-white rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-navy-900">Equipo Seleccionado</h3>
              <p className="text-lg text-navy-700">{selectedModel?.name || 'Personalizado'}</p>
              {results.manHourCost > 0 && (
                <p className="text-xs text-navy-400 mt-1">
                  Costo hora-hombre calculado: ${results.manHourCost.toLocaleString('de-DE', { maximumFractionDigits: 0 })} COP/h (salario x 1.75 / 240h)
                </p>
              )}
            </div>
            <div className="text-right">
              <h3 className="font-bold text-navy-900">Inversión Total</h3>
              <p className="text-2xl text-navy-700">{formatCurrency(results.investment)}</p>
            </div>
            <div className="text-right">
              <h3 className="font-bold text-navy-900">Ahorro Anual</h3>
              <p className="text-2xl text-green-600">{formatCurrency(results.totalSavings)}</p>
            </div>
            <div className="text-right">
              <h3 className="font-bold text-navy-900">Ahorro Mensual</h3>
              <p className="text-xl text-green-500">{formatCurrency(results.monthlySavings)}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <BenefitsChart factors={results.factors} />
          <TimelineChart projection={results.projection} investment={results.investment} />
        </div>

        <div className="mt-6 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-navy-900 mb-4">Detalle de Factores de Ahorro</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-navy-200">
                  <th className="text-left py-3 px-4 text-navy-600 font-semibold">Factor</th>
                  <th className="text-right py-3 px-4 text-navy-600 font-semibold">Situación Actual</th>
                  <th className="text-right py-3 px-4 text-navy-600 font-semibold">Ahorro Anual</th>
                  <th className="text-right py-3 px-4 text-navy-600 font-semibold">Ahorro Mensual</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(results.factors)
                  .filter(f => f.answered)
                  .sort((a, b) => b.savings - a.savings)
                  .map((factor, idx) => {
                    const isDominant = dominantFactors.some(df => df.name === factor.name)
                    const savingsPct = totalSavings > 0 ? (factor.savings / totalSavings * 100).toFixed(0) : 0
                    return (
                      <tr key={idx} className={`border-b border-navy-100 hover:bg-navy-50 ${isDominant ? 'bg-amber-50' : ''}`}>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-navy-800">
                              {factor.name}
                              {isDominant && (
                                <span className="ml-2 text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full font-semibold">
                                  Dominante ({savingsPct}%)
                                </span>
                              )}
                            </p>
                            <p className="text-sm text-navy-400">{factor.description}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right text-navy-600">
                          {formatCurrency(factor.baseValue)}
                        </td>
                        <td className="py-3 px-4 text-right text-green-600 font-semibold">
                          {formatCurrency(factor.savings)}
                        </td>
                        <td className="py-3 px-4 text-right text-green-500">
                          {formatCurrency(factor.savings / 12)}
                        </td>
                      </tr>
                    )
                  })}
                <tr className="bg-navy-50 font-bold">
                  <td className="py-3 px-4 text-navy-900">TOTAL</td>
                  <td className="py-3 px-4 text-right text-navy-600">-</td>
                  <td className="py-3 px-4 text-right text-green-600">
                    {formatCurrency(results.totalSavings)}
                  </td>
                  <td className="py-3 px-4 text-right text-green-500">
                    {formatCurrency(results.monthlySavings)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onBack}
            className="px-6 py-3 bg-navy-100 text-navy-700 font-medium rounded-lg hover:bg-navy-200 transition-all"
          >
            ← Modificar Datos
          </button>
          <button
            onClick={onExportHTML}
            className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-all shadow-lg"
          >
            🌐 Exportar Informe HTML
          </button>
          <button
            onClick={onExportPDF}
            className="px-8 py-3 bg-navy-700 text-white font-bold rounded-lg hover:bg-navy-800 transition-all shadow-lg"
          >
            📄 Exportar Informe PDF
          </button>
        </div>
      </div>
    </div>
  )
}