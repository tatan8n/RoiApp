import React from 'react'
import Header from '../components/Header'
import KPICard from '../components/KPICard'
import BenefitsChart from '../components/BenefitsChart'
import TimelineChart from '../components/TimelineChart'
import CertaintyMeter from '../components/CertaintyMeter'
import { COLORS, EQUIPMENT_MODELS } from '../utils/constants'

export default function ResultsDashboard({ formData, results, onBack, onExportPDF }) {
  const selectedModel = EQUIPMENT_MODELS.find(m => m.id === formData.equipment.modelId)

  const formatCurrency = (value) => {
    if (Math.abs(value) >= 1000000000) {
      return `$${(value / 1000000000).toFixed(2)}B COP`
    }
    if (Math.abs(value) >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M COP`
    }
    return `$${value.toLocaleString('es-CO')} COP`
  }

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

        <div className="mt-6 p-4 bg-white rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-navy-900">Equipo Seleccionado</h3>
              <p className="text-lg text-navy-700">{selectedModel?.name || 'Personalizado'}</p>
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
                  .map((factor, idx) => (
                    <tr key={idx} className="border-b border-navy-100 hover:bg-navy-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-navy-800">{factor.name}</p>
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
                  ))}
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
            onClick={onExportPDF}
            className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-all shadow-lg"
          >
            📄 Exportar Informe PDF
          </button>
        </div>
      </div>
    </div>
  )
}