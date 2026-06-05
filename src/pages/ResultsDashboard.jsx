import React from 'react'
import Header from '../components/Header'
import KPICard from '../components/KPICard'
import BenefitsChart from '../components/BenefitsChart'
import TimelineChart from '../components/TimelineChart'
import CertaintyMeter from '../components/CertaintyMeter'
import ResultsInterpretation from '../components/ResultsInterpretation'
import { COLORS, EQUIPMENT_MODELS, SERVICE_TYPES } from '../utils/constants'
import { formatCurrency } from '../utils/format'
import { ROI_WARNING_THRESHOLD, ROI_DANGER_THRESHOLD } from '../utils/calculations'
import { HomeIcon, ArrowLeftIcon, DocumentArrowDownIcon, ClockIcon, WarningIcon, LightbulbIcon, PresentationChartLineIcon, CalculatorIcon, WalletIcon, PercentIcon, SaveIcon } from '../components/Icons'

export default function ResultsDashboard({ formData, results, onBack, onGoHome, onExportHTML, onSave, onOpenSaveModal }) {
  const isProduct = formData.calculationType === 'product'
  const isService = formData.calculationType === 'service'
  const isRotodynamic = formData.serviceType === 'rotodinamico'
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

  const currency = formData.currency || 'COP'
  const formatCurrencyValue = (value) => formatCurrency(value, currency)

  const dominantFactors = results.dominantFactors || []
  const roiWarning = results.roiWarning || false
  const answeredFactors = Object.values(results.factors).filter(f => f.answered)
  const totalSavings = results.totalSavings

  // Formateadores null-safe: un valor null significa "no calculable" (p. ej. inversión
  // inválida o TIR no definida) y se muestra como "N/A", distinto de un cero real.
  const roiDisplay = results.roi === null || results.roi === undefined ? 'N/A' : `${results.roi.toFixed(1)}%`
  const paybackDisplay = results.payback === null || results.payback === undefined ? 'N/A' : `${results.payback}`
  const bcrDisplay = results.benefitCostRatio === null || results.benefitCostRatio === undefined ? 'N/A' : results.benefitCostRatio.toFixed(2)
  const tirDisplay = results.tir === null || results.tir === undefined ? 'N/A' : `${results.tir.toFixed(1)}%`
  const discountRatePct = (formData.financial?.discountRate || 0.12) * 100

  return (
    <div className="min-h-screen bg-navy-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onGoHome}
              className="flex items-center justify-center text-slate-600 hover:text-slate-800 p-2.5 rounded-lg hover:bg-slate-100 transition-all border border-slate-200 bg-white shadow-sm"
              title="Volver al inicio"
            >
              <HomeIcon className="w-5 h-5" />
            </button>
            <div>
              <button
                onClick={onBack}
                className="flex items-center gap-1.5 text-slate-600 hover:text-slate-800 mb-2 text-sm font-semibold transition-colors"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                <span>Volver al formulario</span>
              </button>
              <h1 className="text-2xl font-bold text-slate-900">
                Resultados del Análisis ROI
              </h1>
              <p className="text-slate-600 text-sm font-medium">
                {formData.client?.companyName || 'Cliente'} | {formData.client?.sector || 'Sector'}
                {isService && selectedService && (
                  <span className="ml-2 text-slate-600">
                    | {selectedService.name}
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onOpenSaveModal && (
              <button
                onClick={onOpenSaveModal}
                className="px-4 py-3 rounded-lg font-bold text-amaq-700 bg-white border-2 border-amaq-500/40 hover:bg-amaq-50 hover:border-amaq-500 transition-all flex items-center gap-2 shadow-md"
              >
                <SaveIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Guardar</span>
              </button>
            )}
            <button
              onClick={onExportHTML}
              className="px-5 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-all shadow-lg flex items-center gap-2"
            >
              <DocumentArrowDownIcon className="w-5 h-5 text-white" />
              <span>Exportar HTML</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <KPICard
            title="ROI"
            value={roiDisplay}
            subtitle={`Retorno en ${results.projectionYears || 5} años`}
            color={results.roi > 0 ? COLORS.success : COLORS.danger}
            icon={<PresentationChartLineIcon className="w-6 h-6" />}
          />
          <KPICard
            title="Payback"
            value={paybackDisplay}
            subtitle={results.payback === null || results.payback === undefined ? 'No se recupera' : 'meses para recuperar'}
            color={COLORS.navy[600]}
            icon={<ClockIcon className="w-6 h-6" />}
          />
          <KPICard
            title="Beneficio/Costo"
            value={bcrDisplay}
            subtitle="Ratio B/C"
            color={results.benefitCostRatio > 1 ? COLORS.success : COLORS.warning}
            icon={<CalculatorIcon className="w-6 h-6" />}
          />
          <KPICard
            title="VAN"
            value={formatCurrencyValue(results.van)}
            subtitle="Valor Actual Neto"
            color={results.van > 0 ? COLORS.success : COLORS.danger}
            icon={<WalletIcon className="w-6 h-6" />}
          />
          <KPICard
            title="TIR"
            value={tirDisplay}
            subtitle="Tasa Interna de Retorno"
            color={results.tir > discountRatePct ? COLORS.success : COLORS.warning}
            icon={<PercentIcon className="w-6 h-6" />}
          />
        </div>

        <CertaintyMeter
          certainty={results.certainty}
          userCertainty={results.userCertainty}
          missingFields={results.missingFields}
          benchmarkFactors={results.benchmarkFactors || []}
          benchmarkApplied={results.benchmarkApplied || {}}
          levelInfo={results.certaintyInfo}
        />

        {roiWarning && (
          <div className={`mt-4 p-4 rounded-xl border ${results.roiSeverity === 'danger' ? 'bg-red-50 border-red-400' : 'bg-amber-50 border-amber-300'}`}>
            <div className="flex items-start">
              <WarningIcon className={`w-6 h-6 shrink-0 mr-3 ${results.roiSeverity === 'danger' ? 'text-red-600' : 'text-amber-600'}`} />
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
              <WarningIcon className="w-6 h-6 text-amber-600 shrink-0 mr-3 mt-0.5" />
              <div>
                <p className="text-amber-800 font-bold">Ahorro total desproporcionado</p>
                <p className="text-amber-600 text-sm mt-1">
                  El ahorro anual representa el {results.savingsCapPct}% de la facturaci&#243;n anual, lo cual supera el 30% t&#237;pico para mantenimiento predictivo en plantas de generaci&#243;n el&#233;ctrica. Los ahorros de PdM en este sector pueden ser mayores que en manufactura. Verifique que los datos de entrada sean correctos.
                </p>
              </div>
            </div>
          </div>
        )}

        {dominantFactors.length > 0 && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-300 rounded-xl">
            <div className="flex items-start">
              <WarningIcon className="w-6 h-6 text-amber-600 shrink-0 mr-3 mt-0.5" />
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

        {results.warnings && results.warnings.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-300 rounded-xl">
            <div className="flex items-start">
              <LightbulbIcon className="w-6 h-6 text-blue-600 shrink-0 mr-3 mt-0.5" />
              <div>
                <p className="text-blue-800 font-bold">Verificación de datos ingresados</p>
                {results.warnings.map((warning, idx) => (
                  <p key={idx} className="text-blue-600 text-sm mt-1">{warning.message}</p>
                ))}
              </div>
            </div>
          </div>
        )}

        {results.certainty < 70 && results.missingFields && results.missingFields.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-300 rounded-xl">
            <div className="flex items-start">
              <LightbulbIcon className="w-6 h-6 text-blue-600 shrink-0 mr-3 mt-0.5" />
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
              <h3 className="font-bold text-navy-900">{getSelectedItemLabel()}</h3>
              <p className="text-lg text-navy-700">{getSelectedItemName()}</p>
              {results.manHourCost > 0 && (
                <p className="text-xs text-slate-600 mt-1 font-semibold">
                  Costo hora-hombre calculado: {formatCurrencyValue(results.manHourCost)}/h
                </p>
              )}
            </div>
            {isContratoMarco ? (
              <>
                <div className="text-right">
                  <h3 className="font-bold text-navy-900">Valor Anual</h3>
                  <p className="text-2xl text-navy-700">{formatCurrencyValue(results.investment)}</p>
                </div>
                <div className="text-right">
                  <h3 className="font-bold text-navy-900">Costo Total ({results.projection?.length || 5} años)</h3>
                  <p className="text-2xl text-navy-700">{formatCurrencyValue(results.totalPayments)}</p>
                </div>
                <div className="text-right">
                  <h3 className="font-bold text-navy-900">Ahorro Anual</h3>
                  <p className="text-2xl text-green-600">{formatCurrencyValue(results.totalSavings / (results.projection?.length || 5))}</p>
                </div>
              </>
            ) : (
              <>
                <div className="text-right">
                  <h3 className="font-bold text-navy-900">Inversión Total</h3>
                  <p className="text-2xl text-navy-700">{formatCurrencyValue(results.investment)}</p>
                </div>
                <div className="text-right">
                  <h3 className="font-bold text-navy-900">Ahorro Anual</h3>
                  <p className="text-2xl text-green-600">{formatCurrencyValue(results.totalSavings)}</p>
                </div>
                <div className="text-right">
                  <h3 className="font-bold text-navy-900">Ahorro Mensual</h3>
                  <p className="text-xl text-green-500">{formatCurrencyValue(results.monthlySavings)}</p>
                </div>
              </>
            )}
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
                            <p className="text-sm text-slate-500 font-medium">{factor.description}</p>
                          </div>
                        </td>
<td className="py-3 px-4 text-right text-navy-600 whitespace-nowrap">
                           {formatCurrencyValue(factor.baseValue)}
                         </td>
                        <td className="py-3 px-4 text-right text-green-700 font-semibold whitespace-nowrap">
                           {formatCurrencyValue(factor.savings)}
                         </td>
                        <td className="py-3 px-4 text-right text-green-600 whitespace-nowrap font-medium">
                           {formatCurrencyValue(factor.savings / 12)}
                         </td>
                      </tr>
                    )
                  })}
                <tr className="bg-navy-50 font-bold">
                  <td className="py-3 px-4 text-navy-900">TOTAL</td>
                  <td className="py-3 px-4 text-right text-navy-700 whitespace-nowrap">-</td>
                  <td className="py-3 px-4 text-right text-green-700 whitespace-nowrap">
                    {formatCurrencyValue(results.totalSavings)}
                  </td>
                  <td className="py-3 px-4 text-right text-green-600 whitespace-nowrap">
                    {formatCurrencyValue(results.monthlySavings)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <ResultsInterpretation results={results} formData={formData} />

        <div className="mt-6 flex flex-wrap justify-end gap-4">
          <button
            onClick={onBack}
            className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition-all flex items-center gap-2 border border-slate-200"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Modificar Datos</span>
          </button>
          {onOpenSaveModal && (
            <button
              onClick={onOpenSaveModal}
              className="px-6 py-3 rounded-lg font-bold text-amaq-700 bg-white border-2 border-amaq-500/40 hover:bg-amaq-50 hover:border-amaq-500 transition-all flex items-center gap-2 shadow-md"
            >
              <SaveIcon className="w-5 h-5" />
              <span>Guardar análisis</span>
            </button>
          )}
          <button
            onClick={onExportHTML}
            className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-all shadow-lg flex items-center gap-2"
          >
            <DocumentArrowDownIcon className="w-5 h-5 text-white" />
            <span>Exportar Informe HTML</span>
          </button>
        </div>
      </div>
    </div>
  )
}