export const COLORS = {
  navy: {
    900: '#002B5C',
    800: '#003366',
    700: '#004080',
    600: '#00579B',
    500: '#0066B3',
    400: '#3380BF',
    300: '#6699CC',
    200: '#99B3D9',
    100: '#D6E9F8',
    50: '#EBF4FA'
  },
  success: '#27AE60',
  warning: '#F39C12',
  danger: '#C0392B',
  white: '#FFFFFF'
}

export const EQUIPMENT_MODELS = [
  { id: 'vidrio', name: 'Vidrio', level: 'Básico', price: 21000000, features: 'Colector básico para rutas de inspección estándar' },
  { id: 'ba3pro', name: 'Ba 3 Pro', level: 'Intermedio', price: 68000000, features: 'Colector profesional con análisis avanzado' },
  { id: 'ba5', name: 'Ba 5', level: 'Full / Avanzado', price: 115000000, features: 'Sistema completo de monitoreo y análisis' }
]

export const DEFAULT_BENCHMARKS = {
  reductionFailures: 0.50,
  reductionCorrective: 0.40,
  optimizationHH: 0.35,
  reductionDelays: 0.25,
  reductionScheduledStops: 0.20,
  extensionLife: 0.25,
  energySavings: 0.05,
  riskReduction: 0.10
}

export const DEFAULT_FINANCIAL_PARAMS = {
  discountRate: 0.12,
  projectionYears: 5
}

export const SECTORS = [
  'Hidroeléctrica',
  'Manufactura',
  'Empaque',
  'Minería',
  'Oil & Gas',
  'Alimentos y Bebidas',
  'Farmacéutica',
  'Otro'
]

export const OPERATIONAL_FIELDS = [
  { id: 'totalAssets', label: 'Número total de activos (equipos rotativos) en la planta', weight: 5, unit: 'equipos', placeholder: 'Motores, bombas, ventiladores, turbinas, etc.' },
  { id: 'criticalAssets', label: 'Cantidad de activos CRÍTICOS (su falla detiene producción)', weight: 8, unit: 'equipos', placeholder: 'Solo aquellos cuya falla genera paro de línea/planta' },
  { id: 'costPerHourStop', label: 'Costo promedio por hora de paro por activo crítico', weight: 15, unit: 'COP/hora', placeholder: 'Incluye lucro cesante + producción perdida' },
  { id: 'unplannedFailures', label: 'Frecuencia actual de fallas no planificadas', weight: 10, unit: 'paros/año', placeholder: 'Promedio de eventos de paro no programado al año' },
  { id: 'avgStopDuration', label: 'Duración promedio de cada paro no planificado', weight: 7, unit: 'horas', placeholder: 'Tiempo desde falla hasta restablecimiento completo' },
  { id: 'correctiveExternalCost', label: 'Costo promedio de intervención correctiva externa', weight: 6, unit: 'COP', placeholder: 'Contratación de servicio técnico externo por evento' },
  { id: 'correctiveExternalCount', label: 'Número de intervenciones correctivas externas al año', weight: 5, unit: 'intervenciones/año', placeholder: 'Cantidad de veces que se contrata servicio externo' },
  { id: 'reactiveManHours', label: 'Horas-hombre mensuales en mantenimiento reactivo', weight: 5, unit: 'horas/mes', placeholder: 'Horas del equipo interno dedicadas a reparar fallas' },
  { id: 'manHourCost', label: 'Costo hora-hombre del personal de mantenimiento', weight: 4, unit: 'COP/hora', placeholder: 'Incluye prestaciones y carga laboral' },
  { id: 'sparePartsDelay', label: 'Días promedio de demora en obtención de repuestos críticos', weight: 3, unit: 'días', placeholder: 'Tiempo de espera desde pedido hasta recepción' },
  { id: 'sparePartsInventoryCost', label: 'Costo promedio del inventario de repuestos críticos', weight: 3, unit: 'COP/año', placeholder: 'Valor del stock de partes de repuesto mantenido' },
  { id: 'scheduledStopHours', label: 'Horas de paro programado anuales (mantenimiento preventivo)', weight: 4, unit: 'horas/año', placeholder: 'Ventanas de mantenimiento que afectan producción' },
  { id: 'scheduledStopCost', label: 'Costo de producción perdida por hora de paro programado', weight: 4, unit: 'COP/hora', placeholder: 'Valor de producción no realizada por mantenimiento' },
  { id: 'monthlyBilling', label: 'Facturación mensual de la planta', weight: 6, unit: 'COP/mes', placeholder: 'Ingreso mensual aproximado para referencia' }
]

export const BENCHMARK_FIELDS = [
  { id: 'reductionFailures', label: '% Reducción de fallas no planificadas con monitoreo predictivo', weight: 10, default: 0.50, benchmark: '50-75% (DOE, McKinsey)' },
  { id: 'reductionCorrective', label: '% Reducción de costos de mantenimiento correctivo', weight: 8, default: 0.40, benchmark: '25-40% (DOE)' },
  { id: 'optimizationHH', label: '% Optimización de horas-hombre (menos reactivo)', weight: 7, default: 0.35, benchmark: '30-60% (PWC)' },
  { id: 'reductionDelays', label: '% Reducción de demoras por repuestos (inventario optimizado)', weight: 5, default: 0.25, benchmark: '20-30% (industria)' },
  { id: 'reductionScheduledStops', label: '% Reducción de paros programados (mejor planificación)', weight: 5, default: 0.20, benchmark: '15-25% (Metrix, Farnell)' },
  { id: 'extensionLife', label: '% Extensión de vida útil de activos', weight: 5, default: 0.25, benchmark: '20-40% (McKinsey)' },
  { id: 'energySavings', label: '% Ahorro en consumo energético por alineación/balanceo', weight: 3, default: 0.05, benchmark: '5-8% (Vista Projects)' },
  { id: 'riskReduction', label: '% Reducción de riesgos de seguridad / primas de seguro', weight: 3, default: 0.10, benchmark: '5-15% (OPMaint, PWC)' }
]

export const STEPS_CONFIG = [
  { id: 1, title: 'Cliente y Equipo', description: 'Información del cliente y selección del equipo' },
  { id: 2, title: 'Datos Operativos', description: 'Parámetros de operación de la planta' },
  { id: 3, title: 'Factores de Mejora', description: 'Benchmarks de mejora esperados' },
  { id: 4, title: 'Parámetros Financieros', description: 'Tasa de descuento y horizonte de tiempo' }
]