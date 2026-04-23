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
  { id: 'totalAssets', label: 'Número total de equipos rotativos', unit: 'equipos', placeholder: 'Motores, bombas, ventiladores, turbinas', benchmarkHint: 'Típico: 50-500 equipos según tamaño de planta', step: '1' },
  { id: 'criticalAssets', label: 'Equipos críticos (falla detiene producción)', unit: 'equipos', placeholder: 'Solo equipos cuya falla para línea/planta', benchmarkHint: 'Generalmente 5-15% del total de equipos', step: '1' },
  { id: 'avgCriticalAssetValue', label: 'Valor promedio de reposición de un equipo crítico', unit: 'MM COP', placeholder: 'Ej: 50 (si cuesta 50 millones reemplazar uno)', isCurrency: true, benchmarkHint: 'Industria: 50-500 MM COP según tipo de equipo. Fuente: SMRP', step: '0.1' },
  { id: 'costPerHourStop', label: 'Costo por hora de paro no planificado', unit: 'MM COP/hora', placeholder: 'Ej: 5 (si son 5 millones por hora)', isCurrency: true, benchmarkHint: 'Manufactura: 2-10 MM COP/h; Oil & Gas: 50-200 MM COP/h. Fuente: Aberdeen Group', step: '0.1' },
  { id: 'unplannedFailures', label: 'Frecuencia de fallas no planificadas', unit: 'paros/año', placeholder: 'Promedio de eventos al año', benchmarkHint: 'Plantas sin predictivo: 3-5 fallas/año por cada 100 equipos. Fuente: DOE, SMRP', step: '0.5' },
  { id: 'avgStopDuration', label: 'Duración promedio de cada paro', unit: 'horas', placeholder: 'Tiempo desde falla hasta restablecimiento', benchmarkHint: 'Típico: 2-8 horas según tipo de falla. Fuente: McKinsey', step: '0.5' },
  { id: 'correctiveExternalCost', label: 'Costo promedio por intervención correctiva externa', unit: 'MM COP', placeholder: 'Ej: 3 (si son 3 millones por intervención)', isCurrency: true, benchmarkHint: 'Referencia: 3-8% del presupuesto anual de mantenimiento. Fuente: SMRP', step: '0.1' },
  { id: 'correctiveExternalCount', label: 'Número de intervenciones correctivas externas al año', unit: 'intervenciones/año', placeholder: 'Cantidad de veces que se contrata servicio externo', benchmarkHint: 'Plantas sin predictivo: 5-15 intervenciones/año. Fuente: PwC', step: '1' },
  { id: 'reactiveManHours', label: 'Horas-hombre mensuales en mantenimiento reactivo', unit: 'horas/mes', placeholder: 'Horas del equipo interno en reparar fallas', benchmarkHint: 'Plantas reactivas: 20-40% del tiempo de mantenimiento. Fuente: McKinsey', step: '1' },
  { id: 'technicianMonthlySalary', label: 'Salario mensual básico de un técnico de mantenimiento', unit: 'MM COP/mes', placeholder: 'Ej: 2 (si gana 2 millones de pesos mensuales)', isCurrency: true, benchmarkHint: 'Colombia: 1.5-4 MM COP/mes según región y nivel. Fuente: DANE', step: '0.1' },
  { id: 'sparePartsDelay', label: 'Días promedio de demora en repuestos críticos', unit: 'días', placeholder: 'Tiempo desde pedido hasta recepción', benchmarkHint: 'Sin gestión: 45-90 días; Con predictivo: 7-30 días. Fuente: SMRP, Aberdeen', step: '1' },
  { id: 'sparePartsInventoryCost', label: 'Costo del inventario de repuestos críticos', unit: 'MM COP', placeholder: 'Ej: 50 (si son 50 millones en repuestos)', isCurrency: true, benchmarkHint: 'Referencia: 3-8% del valor total de reposición de activos. Fuente: SMRP, DOE', step: '0.1' },
  { id: 'scheduledStopHours', label: 'Horas de paro programado anuales', unit: 'horas/año', placeholder: 'Ventanas de mantenimiento preventivo', benchmarkHint: 'Típico: 200-600 horas/año. Fuente: DOE FEMP', step: '1' },
  { id: 'scheduledStopCost', label: 'Costo por hora de paro programado', unit: 'MM COP/hora', placeholder: 'Ej: 3 (si son 3 millones por hora)', isCurrency: true, benchmarkHint: 'Similar al costo por hora de paro no planificado. Fuente: McKinsey', step: '0.1' },
  { id: 'monthlyBilling', label: 'Facturación mensual aproximada', unit: 'MM COP/mes', placeholder: 'Ej: 1000 (si son mil millones mensuales)', isCurrency: true, benchmarkHint: 'Ingreso mensual de la planta. Se usa para estimar costo de riesgo (~2% anual). Fuente: PwC, DOE', step: '1' },
  { id: 'preventiveMaintenanceCost', label: 'Costo anual de mantenimiento preventivo intrusivo', unit: 'MM COP/año', placeholder: 'Ej: 200 (si son 200 millones al año)', isCurrency: true, benchmarkHint: 'Referencia: 2-6% del valor de reposición de activos por año. Fuente: SMRP, PwC', step: '1' },
  { id: 'unnecessaryPreventivePercentage', label: '% de preventivos abiertos que están en buen estado', unit: '%', placeholder: 'Estimación técnica: 30-40% en plantas no optimizadas', benchmarkHint: 'Sin predictivo: 30-40%; Con predictivo: 10-15%. Fuente: DOE, McKinsey', step: '1' },
  { id: 'inducedFailureCost', label: 'Costo anual de fallas inducidas por error humano', unit: 'MM COP/año', placeholder: 'Ej: 50 (si son 50 millones al año)', isCurrency: true, benchmarkHint: 'Referencia: 5-15% del costo total de mantenimiento. Fuente: SMRP', step: '1' },
  { id: 'annualEnergyCost', label: 'Costo anual de energía eléctrica de la planta', unit: 'MM COP/año', placeholder: 'Ej: 500 (si son 500 millones en energía al año)', isCurrency: true, benchmarkHint: 'Manufactura ligera: 3-8% de facturación; Intensiva: 15-40%. Fuente: DOE Motor Challenge', step: '1' }
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

export const ROTODYNAMIC_SECTIONS = [
  {
    id: 'inventory',
    title: 'Inventario y Capacidad',
    icon: '⚙️',
    description: 'Datos de equipos rotodinámicos',
    fields: ['numTurbines', 'technology', 'nominalCapacity', 'yearsOfOperation']
  },
  {
    id: 'failureParams',
    title: 'Parámetros de Falla',
    icon: '⚠️',
    description: 'Costos y frecuencia de fallas',
    fields: ['costPerHourStop', 'criticalFailures', 'avgStopDuration', 'mttr']
  },
  {
    id: 'maintenanceCosts',
    title: 'Costos de Mantenimiento',
    icon: '🔧',
    description: 'Estructura de costos de mantenimiento',
    fields: ['externalInterventionCost', 'reactiveManHours', 'internalLaborCost', 'billingAffected']
  },
  {
    id: 'efficiency',
    title: 'Logística y Eficiencia',
    icon: '📊',
    description: 'Repuestos y eficiencia termodinámica',
    fields: ['sparePartsDelay', 'heatRateDesign', 'heatRateActual', 'fuelCost']
  }
]

export const TURBINE_TYPES = [
  {
    id: 'gas',
    name: 'Gas',
    benchmarks: {
      nominalCapacity: { min: 100, max: 600, unit: 'MW' },
      avgStopDuration: { min: 24, max: 120, unit: 'horas' },
      mttr: { min: 72, max: 168, unit: 'horas' },
      criticalFailures: { min: 0.5, max: 2, unit: 'fallas/año' },
      heatRateDesign: { min: 9000, max: 12000, unit: 'BTU/kWh' },
     vens: 5000
    }
  },
  {
    id: 'steam',
    name: 'Vapor (Steam)',
    benchmarks: {
      nominalCapacity: { min: 200, max: 1000, unit: 'MW' },
      avgStopDuration: { min: 48, max: 240, unit: 'horas' },
      mttr: { min: 120, max: 360, unit: 'horas' },
      criticalFailures: { min: 0.3, max: 1.5, unit: 'fallas/año' },
      heatRateDesign: { min: 8500, max: 11000, unit: 'BTU/kWh' },
      vens: 4000
    }
  },
  {
    id: 'hydro',
    name: 'Hidráulica (Hydro)',
    benchmarks: {
      nominalCapacity: { min: 50, max: 700, unit: 'MW' },
      avgStopDuration: { min: 8, max: 72, unit: 'horas' },
      mttr: { min: 48, max: 120, unit: 'horas' },
      criticalFailures: { min: 0.2, max: 1, unit: 'fallas/año' },
      heatRateDesign: null,
      vens: 6000
    }
  }
]

export const ROTODYNAMIC_FIELDS = [
  { id: 'numTurbines', label: 'Número de turbinas/generadores', unit: 'unidades', placeholder: 'Ej: 4', benchmarkHint: 'Típico: 1-8 turbinas por planta. Fuente: EPRI', step: '1' },
  { id: 'technology', label: 'Tecnología y marca', unit: 'texto', placeholder: 'Ej: GE Frame 7FA, Siemens SGT6-5000F', benchmarkHint: 'Marca y modelo de la turbina' },
  { id: 'nominalCapacity', label: 'Capacidad nominal por unidad', unit: 'MW', placeholder: 'Ej: 250', benchmarkHint: 'Gas: 100-600 MW; Vapor: 200-1000 MW; Hydro: 50-700 MW', step: '0.1' },
  { id: 'yearsOfOperation', label: 'Años de operación (edad del activo)', unit: 'años', placeholder: 'Ej: 15', benchmarkHint: 'Nueva: 0-2 años; Media vida: 10-20; Final vida: 25-40', step: '0.5' },
  { id: 'costPerHourStop', label: 'Costo por hora de paro (margen de contribución perdido)', unit: '/hora', placeholder: 'Ej: 50000000', isCurrency: true, benchmarkHint: 'Basado en VENS: $2,600-14,400 USD/MWh según país. Fuente: EPRI, XM', step: '0.01' },
  { id: 'criticalFailures', label: 'Frecuencia de fallas críticas (últimos 24 meses)', unit: 'eventos', placeholder: 'Ej: 3', benchmarkHint: 'EPRI: 0.5-3 fallas/año por turbina sin predictivo. Con predictivo: 0.2-1.0', step: '0.1' },
  { id: 'avgStopDuration', label: 'Duración promedio de paros no programados', unit: 'horas', placeholder: 'Ej: 48', benchmarkHint: 'Gas: 24-120h; Vapor: 48-240h; Hydro: 8-72h. Con predictivo reduce 35-45%. Fuente: EPRI', step: '0.5' },
  { id: 'mttr', label: 'MTTR Histórico (tiempo de rehabilitación)', unit: 'horas', placeholder: 'Ej: 72', benchmarkHint: 'Gas: 72-168h; Vapor: 120-360h; Hydro: 48-120h. Diagnóstico predictivo reduce MTTR 40%. Fuente: IEEE', step: '0.5' },
  { id: 'externalInterventionCost', label: 'Costo promedio intervención externa de emergencia', unit: '', placeholder: 'Ej: 150000000', isCurrency: true, benchmarkHint: '4-5× costo de mantenimiento programado. Emergency premium 50-100%. Fuente: EPRI', step: '0.01' },
  { id: 'reactiveManHours', label: 'HH anuales de mantenimiento reactivo', unit: 'horas/año', placeholder: 'Ej: 2400', benchmarkHint: 'Plantas reactivas: 20-40% del tiempo total. Con predictivo: 8-15%. Fuente: McKinsey', step: '1' },
  { id: 'internalLaborCost', label: 'Costo hora-hombre interna (con prestaciones)', unit: '/hora', placeholder: 'Ej: 80000', isCurrency: true, benchmarkHint: 'Colombia: $50,000-120,000 COP/h con prestaciones. Fuente: DANE', step: '0.01' },
  { id: 'billingAffected', label: 'Facturación afectada (multas/créditos energía no entregada)', unit: '/año', placeholder: 'Ej: 500000000', isCurrency: true, benchmarkHint: 'Penalizaciones o créditos por energía no suministrada. VENS Colombia: variable por sector. Fuente: XM, CREG', step: '0.01' },
  { id: 'sparePartsDelay', label: 'Días promedio de demora en repuestos críticos', unit: 'días', placeholder: 'Ej: 60', benchmarkHint: 'Sin predictivo: 45-90 días; Con predictivo: 7-30 días. Piezas críticas: 8-24 semanas. Fuente: SMRP', step: '1' },
  { id: 'heatRateDesign', label: 'Heat rate de diseño', unit: 'BTU/kWh', placeholder: 'Ej: 9500', benchmarkHint: 'Gas: 9,000-12,000; Vapor: 8,500-11,000; Hydro: N/A. Fuente: EPRI', step: '1' },
  { id: 'heatRateActual', label: 'Heat rate actual', unit: 'BTU/kWh', placeholder: 'Ej: 10200', benchmarkHint: 'Si actual > diseño: indica pérdida de eficiencia. Mejora típica 1-3% con mantenimiento predictivo. Fuente: EPRI', step: '1' },
  { id: 'fuelCost', label: 'Costo de combustible', unit: '/kWh', placeholder: 'Ej: 150', isCurrency: true, benchmarkHint: 'Gas natural: $0.04-0.10 USD/kWh; Carbón: $0.02-0.06 USD/kWh. Combustible = 70% OPEX. Fuente: DOE', step: '0.001' }
]

export const ROTODYNAMIC_BENCHMARKS = {
  reductionFailures: 0.40,
  reductionHeatRate: 0.02,
  optimizationHH: 0.30,
  reductionDelays: 0.25,
  extensionLife: 0.25,
  riskReduction: 0.10
}

export const ROTODYNAMIC_BENCHMARK_FIELDS = [
  { id: 'reductionFailures', label: '% Reducción de lucro cesante (fillas evitadas)', weight: 15, default: 0.40, benchmark: '35-45% reducción (EPRI), hasta 73% en ciclo combinado' },
  { id: 'reductionHeatRate', label: '% Mejora en heat rate (eficiencia termodinámica)', weight: 12, default: 0.02, benchmark: '1-3% mejora (EPRI)' },
  { id: 'optimizationHH', label: '% Optimización de horas-hombre reactivas', weight: 10, default: 0.30, benchmark: '30% reducción en costos totales de labor' },
  { id: 'reductionDelays', label: '% Reducción de demoras por repuestos', weight: 8, default: 0.25, benchmark: '20-30% reducción en costos de inventario' },
  { id: 'extensionLife', label: '% Extensión de vida útil de activos', weight: 7, default: 0.25, benchmark: '20-40% (McKinsey)' },
  { id: 'riskReduction', label: '% Reducción de riesgos de seguridad / primas de seguro', weight: 5, default: 0.10, benchmark: '5-15% (OPMaint, PWC)' }
]

export const ROTODYNAMIC_STEPS_CONFIG = [
  { id: 1, title: 'Cliente y Servicio', description: 'Información del cliente y valor del servicio' },
  { id: 2, title: 'Datos del Servicio', description: 'Parámetros técnicos y operativos' },
  { id: 3, title: 'Factores de Mejora', description: 'Benchmarks de mejora esperados' },
  { id: 4, title: 'Parámetros Financieros', description: 'Tasa de descuento y horizonte de evaluación' }
]

export const CONTRATO_MARCO_STEPS_CONFIG = [
  { id: 1, title: 'Cliente y Servicio', description: 'Información del cliente y valor del contrato' },
  { id: 2, title: 'Datos Operativos', description: 'Parámetros operativos de tu planta' },
  { id: 3, title: 'Factores de Mejora', description: 'Benchmarks de mejora esperados' },
  { id: 4, title: 'Parámetros Financieros', description: 'Tasa de descuento y proyección' },
  { id: 5, title: 'Resultados', description: 'Análisis ROI del contrato de servicio' }
]

export const DEFAULT_INFLATION_RATE = 0.04

export const ROTODYNAMIC_FACTOR_WEIGHTS = {
  f1: 15,
  f2: 12,
  f3: 10,
  f4: 8,
  f5: 7,
  f6: 5
}

export const CURRENCIES = [
  { id: 'COP', name: 'COP', symbol: '$', description: 'Pesos Colombianos' },
  { id: 'USD', name: 'USD', symbol: '$', description: 'Dólares Americanos' }
]