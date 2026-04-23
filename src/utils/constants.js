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

export const PRODUCT_LINE = {
  name: 'Colectores de Vibración',
  description: 'Sistemas de monitoreo y análisis de vibraciones para equipos rotativos'
}

export const EQUIPMENT_MODELS = [
  { id: 'vibriom', name: 'VibrioM', level: 'Básico', price: 21000000, features: 'Colector básico para rutas de inspección estándar' },
  { id: 'va3pro', name: 'VA3pro', level: 'Intermedio', price: 68000000, features: 'Colector profesional con análisis avanzado' },
  { id: 'va5pro', name: 'VA5pro', level: 'Full / Avanzado', price: 115000000, features: 'Sistema completo de monitoreo y análisis' }
]

export const SERVICE_TYPES = [
  { id: 'rotodinamico', name: 'Rotodinámico', description: 'Servicio de diagnóstico y análisis de equipos rotativos' },
  { id: 'contrato_marco', name: 'Contrato Marco', description: 'Contrato marco de servicios por un año' }
]

export const DEFAULT_BENCHMARKS = {
  reductionFailures: 0.50,
  reductionCorrective: 0.40,
  optimizationHH: 0.35,
  reductionDelays: 0.25,
  reductionScheduledStops: 0.20,
  extensionLife: 0.25,
  energySavings: 0.05,
  riskReduction: 0.10,
  reductionPreventive: 0.30,
  eliminationInducedFailures: 0.70
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

export const OPERATIONAL_SECTIONS = [
  {
    id: 'equipment',
    title: 'Equipos',
    icon: '🔧',
    description: 'Cantidad de equipos en tu planta',
    fields: ['totalAssets', 'criticalAssets']
  },
  {
    id: 'unplannedStops',
    title: 'Paros No Planificados',
    icon: '⚠️',
    description: 'Pérdidas por fallas inesperadas',
    fields: ['costPerHourStop', 'unplannedFailures', 'avgStopDuration']
  },
  {
    id: 'corrective',
    title: 'Mantenimiento Correctivo',
    icon: '🔨',
    description: 'Costos de servicios técnicos externos',
    fields: ['correctiveExternalCost', 'correctiveExternalCount']
  },
  {
    id: 'reactive',
    title: 'Mantenimiento Reactivo',
    icon: '⏱️',
    description: 'Horas-hombre del equipo interno',
    fields: ['reactiveManHours', 'technicianMonthlySalary']
  },
  {
    id: 'inventoryScheduled',
    title: 'Repuestos, Programados y Energía',
    icon: '📦',
    description: 'Inventario, demoras, mantenimientos preventivos y energía',
    fields: ['sparePartsDelay', 'sparePartsInventoryCost', 'scheduledStopHours', 'scheduledStopCost', 'monthlyBilling', 'preventiveMaintenanceCost', 'unnecessaryPreventivePercentage', 'inducedFailureCost', 'annualEnergyCost']
  }
]

export const OPERATIONAL_FIELDS = [
  { id: 'totalAssets', label: 'Número total de equipos rotativos', unit: 'equipos', placeholder: 'Motores, bombas, ventiladores, turbinas', benchmarkHint: 'Típico: 50-500 equipos según tamaño de planta' },
  { id: 'criticalAssets', label: 'Equipos críticos (falla detiene producción)', unit: 'equipos', placeholder: 'Solo equipos cuya falla para línea/planta', benchmarkHint: 'Generalmente 5-15% del total de equipos' },
  { id: 'avgCriticalAssetValue', label: 'Valor promedio de reposición de un equipo crítico', unit: 'MM COP', placeholder: 'Ej: 50 (si cuesta 50 millones reemplazar uno)', isCurrency: true, benchmarkHint: 'Industria: 50-500 MM COP según tipo de equipo. Fuente: SMRP' },
  { id: 'costPerHourStop', label: 'Costo por hora de paro no planificado', unit: 'MM COP/hora', placeholder: 'Ej: 5 (si son 5 millones por hora)', isCurrency: true, benchmarkHint: 'Manufactura: 2-10 MM COP/h; Oil & Gas: 50-200 MM COP/h. Fuente: Aberdeen Group' },
  { id: 'unplannedFailures', label: 'Frecuencia de fallas no planificadas', unit: 'paros/año', placeholder: 'Promedio de eventos al año', benchmarkHint: 'Plantas sin predictivo: 3-5 fallas/año por cada 100 equipos. Fuente: DOE, SMRP' },
  { id: 'avgStopDuration', label: 'Duración promedio de cada paro', unit: 'horas', placeholder: 'Tiempo desde falla hasta restablecimiento', benchmarkHint: 'Típico: 2-8 horas según tipo de falla. Fuente: McKinsey' },
  { id: 'correctiveExternalCost', label: 'Costo promedio por intervención correctiva externa', unit: 'MM COP', placeholder: 'Ej: 3 (si son 3 millones por intervención)', isCurrency: true, benchmarkHint: 'Referencia: 3-8% del presupuesto anual de mantenimiento. Fuente: SMRP' },
  { id: 'correctiveExternalCount', label: 'Número de intervenciones correctivas externas al año', unit: 'intervenciones/año', placeholder: 'Cantidad de veces que se contrata servicio externo', benchmarkHint: 'Plantas sin predictivo: 5-15 intervenciones/año. Fuente: PwC' },
  { id: 'reactiveManHours', label: 'Horas-hombre mensuales en mantenimiento reactivo', unit: 'horas/mes', placeholder: 'Horas del equipo interno en reparar fallas', benchmarkHint: 'Plantas reactivas: 20-40% del tiempo de mantenimiento. Fuente: McKinsey' },
  { id: 'technicianMonthlySalary', label: 'Salario mensual básico de un técnico de mantenimiento', unit: 'MM COP/mes', placeholder: 'Ej: 2 (si gana 2 millones de pesos mensuales)', isCurrency: true, benchmarkHint: 'Colombia: 1.5-4 MM COP/mes según región y nivel. Fuente: DANE' },
  { id: 'sparePartsDelay', label: 'Días promedio de demora en repuestos críticos', unit: 'días', placeholder: 'Tiempo desde pedido hasta recepción', benchmarkHint: 'Sin gestión: 45-90 días; Con predictivo: 7-30 días. Fuente: SMRP, Aberdeen' },
  { id: 'sparePartsInventoryCost', label: 'Costo del inventario de repuestos críticos', unit: 'MM COP', placeholder: 'Ej: 50 (si son 50 millones en repuestos)', isCurrency: true, benchmarkHint: 'Referencia: 3-8% del valor total de reposición de activos. Fuente: SMRP, DOE' },
  { id: 'scheduledStopHours', label: 'Horas de paro programado anuales', unit: 'horas/año', placeholder: 'Ventanas de mantenimiento preventivo', benchmarkHint: 'Típico: 200-600 horas/año. Fuente: DOE FEMP' },
  { id: 'scheduledStopCost', label: 'Costo por hora de paro programado', unit: 'MM COP/hora', placeholder: 'Ej: 3 (si son 3 millones por hora)', isCurrency: true, benchmarkHint: 'Similar al costo por hora de paro no planificado. Fuente: McKinsey' },
  { id: 'monthlyBilling', label: 'Facturación mensual aproximada', unit: 'MM COP/mes', placeholder: 'Ej: 1000 (si son mil millones mensuales)', isCurrency: true, benchmarkHint: 'Ingreso mensual de la planta. Se usa para estimar costo de riesgo (~2% anual). Fuente: PwC, DOE' },
  { id: 'preventiveMaintenanceCost', label: 'Costo anual de mantenimiento preventivo intrusivo', unit: 'MM COP/año', placeholder: 'Ej: 200 (si son 200 millones al año)', isCurrency: true, benchmarkHint: 'Referencia: 2-6% del valor de reposición de activos por año. Fuente: SMRP, PwC' },
  { id: 'unnecessaryPreventivePercentage', label: '% de preventivos abiertos que están en buen estado', unit: '%', placeholder: 'Estimación técnica: 30-40% en plantas no optimizadas', benchmarkHint: 'Sin predictivo: 30-40%; Con predictivo: 10-15%. Fuente: DOE, McKinsey' },
  { id: 'inducedFailureCost', label: 'Costo anual de fallas inducidas por error humano', unit: 'MM COP/año', placeholder: 'Ej: 50 (si son 50 millones al año)', isCurrency: true, benchmarkHint: 'Referencia: 5-15% del costo total de mantenimiento. Fuente: SMRP' },
  { id: 'annualEnergyCost', label: 'Costo anual de energía eléctrica de la planta', unit: 'MM COP/año', placeholder: 'Ej: 500 (si son 500 millones en energía al año)', isCurrency: true, benchmarkHint: 'Manufactura ligera: 3-8% de facturación; Intensiva: 15-40%. Fuente: DOE Motor Challenge' }
]

export const BENCHMARK_FIELDS = [
  { id: 'reductionFailures', label: '% Reducción de fallas no planificadas con monitoreo predictivo', weight: 10, default: 0.50, benchmark: '50-75% (DOE, McKinsey)' },
  { id: 'reductionCorrective', label: '% Reducción de costos de mantenimiento correctivo', weight: 8, default: 0.40, benchmark: '25-40% (DOE)' },
  { id: 'optimizationHH', label: '% Optimización de horas-hombre (menos reactivo)', weight: 7, default: 0.35, benchmark: '30-60% (PWC)' },
  { id: 'reductionDelays', label: '% Reducción de demoras por repuestos (inventario optimizado)', weight: 5, default: 0.25, benchmark: '20-30% (industria)' },
  { id: 'reductionScheduledStops', label: '% Reducción de paros programados (mejor planificación)', weight: 5, default: 0.20, benchmark: '15-25% (Metrix, Farnell)' },
  { id: 'extensionLife', label: '% Extensión de vida útil de activos', weight: 5, default: 0.25, benchmark: '20-40% (McKinsey)' },
  { id: 'energySavings', label: '% Ahorro en consumo energético por alineación/balanceo', weight: 3, default: 0.05, benchmark: '5-8% (Vista Projects)' },
  { id: 'riskReduction', label: '% Reducción de riesgos de seguridad / primas de seguro', weight: 3, default: 0.10, benchmark: '5-15% (OPMaint, PWC)' },
  { id: 'reductionPreventive', label: '% Reducción de preventivos innecesarios mediante predictivo', weight: 6, default: 0.30, benchmark: '25-40% (DOE, McKinsey)' },
  { id: 'eliminationInducedFailures', label: '% Reducción de fallas inducidas por error humano', weight: 7, default: 0.70, benchmark: '50-80% (SMRP, DOE)' }
]

export const STEPS_CONFIG = [
  { id: 1, title: 'Cliente y Equipo', description: 'Información del cliente y selección del equipo' },
  { id: 2, title: 'Datos Operativos', description: 'Parámetros de operación de la planta' },
  { id: 3, title: 'Factores de Mejora', description: 'Benchmarks de mejora esperados' },
  { id: 4, title: 'Parámetros Financieros', description: 'Tasa de descuento y horizonte de tiempo' }
]