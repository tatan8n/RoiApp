import React from 'react'
import {
  PresentationChartLineIcon,
  ClockIcon,
  CalculatorIcon,
  WalletIcon,
  PercentIcon,
  LightbulbIcon
} from './Icons'

/**
 * Sección informativa que explica cómo interpretar cada indicador del análisis ROI.
 * Pensada para que un cliente sin formación financiera entienda qué significa cada KPI,
 * cómo leerlo y qué rangos son favorables.
 */
export default function ResultsInterpretation({ results = {}, formData = {} }) {
  const projectionYears = results.projectionYears || formData.financial?.projectionYears || 5
  const discountRatePct = ((formData.financial?.discountRate ?? 0.12) * 100).toFixed(0)

  const indicators = [
    {
      icon: <PresentationChartLineIcon className="w-5 h-5" />,
      title: 'ROI (Retorno de la Inversión)',
      what: `Mide cuánto ganas en total frente a lo que inviertes, durante el horizonte de ${projectionYears} años.`,
      how: 'Un ROI positivo significa que los ahorros superan la inversión; cuanto más alto, mejor. Un ROI de 100% indica que recuperas la inversión y ganas otro tanto.',
      good: 'Favorable: > 0%. Excelente: > 100%. Si supera ~300% revisa los datos: puede estar sobreestimado.'
    },
    {
      icon: <ClockIcon className="w-5 h-5" />,
      title: 'Payback (Periodo de Recuperación)',
      what: 'Tiempo, en meses, que tardas en recuperar la inversión con los ahorros generados.',
      how: 'Cuanto menor sea, más rápido se paga la inversión. Si aparece "No se recupera", los ahorros no alcanzan a cubrir el costo en el horizonte evaluado.',
      good: 'Favorable: recuperar en menos de la mitad del horizonte (ej. < 30 meses en un análisis a 5 años).'
    },
    {
      icon: <CalculatorIcon className="w-5 h-5" />,
      title: 'Beneficio / Costo (B/C)',
      what: 'Cuántos pesos de beneficio obtienes por cada peso invertido.',
      how: 'Un ratio mayor que 1 significa que los beneficios superan los costos. Un B/C de 3 indica 3 pesos de ahorro por cada peso invertido.',
      good: 'Favorable: > 1. Muy atractivo: > 2.'
    },
    {
      icon: <WalletIcon className="w-5 h-5" />,
      title: 'VAN (Valor Actual Neto)',
      what: 'El valor de todos los ahorros futuros traídos a pesos de hoy, menos la inversión.',
      how: `Descuenta el dinero futuro a una tasa del ${discountRatePct}% anual (porque un peso hoy vale más que un peso mañana). Un VAN positivo significa que el proyecto crea valor.`,
      good: 'Favorable: > 0. Mientras mayor sea, más valor genera el proyecto.'
    },
    {
      icon: <PercentIcon className="w-5 h-5" />,
      title: 'TIR (Tasa Interna de Retorno)',
      what: 'La rentabilidad anual equivalente del proyecto, expresada como porcentaje.',
      how: `Compárala con tu tasa de descuento (${discountRatePct}%): si la TIR es mayor, el proyecto rinde más que esa referencia. Puede aparecer "N/A" cuando no es matemáticamente calculable (p. ej. un contrato recurrente sin inversión inicial).`,
      good: `Favorable: TIR > ${discountRatePct}% (tu tasa de descuento).`
    },
    {
      icon: <LightbulbIcon className="w-5 h-5" />,
      title: 'Certeza del Análisis',
      what: 'Qué tan completos están los datos que sustentan la proyección.',
      how: 'A mayor porcentaje, más factores de ahorro tienen información real y más confiable es el resultado. Una certeza baja sugiere completar más campos.',
      good: 'Alta: ≥ 80%. Media: 50–79%. Baja: < 50% (interpreta los resultados con cautela).'
    }
  ]

  return (
    <div className="mt-6 bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center gap-2 mb-1">
        <LightbulbIcon className="w-5 h-5 text-amaq-600" />
        <h3 className="text-lg font-bold text-navy-900">¿Cómo interpretar estos resultados?</h3>
      </div>
      <p className="text-sm text-slate-500 mb-5">
        Guía rápida para entender cada indicador del análisis de retorno de inversión.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {indicators.map((ind, idx) => (
          <div key={idx} className="border border-slate-200 rounded-xl p-4 hover:border-amaq-300 hover:shadow-sm transition-all">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-lg bg-amaq-50 text-amaq-700 flex items-center justify-center shrink-0">
                {ind.icon}
              </div>
              <h4 className="font-bold text-navy-900 text-sm leading-tight">{ind.title}</h4>
            </div>
            <p className="text-sm text-slate-700 mb-2">{ind.what}</p>
            <p className="text-xs text-slate-500 mb-2">{ind.how}</p>
            <p className="text-xs font-semibold text-green-700 bg-green-50 rounded-lg px-2.5 py-1.5">
              {ind.good}
            </p>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-400 mt-5 leading-relaxed">
        Nota: estos indicadores son estimaciones basadas en los datos ingresados y en benchmarks de la
        industria (DOE, SMRP, EPRI, McKinsey). Un solo indicador no debe tomarse de forma aislada;
        evalúa el conjunto y la certeza del análisis antes de decidir.
      </p>
    </div>
  )
}
