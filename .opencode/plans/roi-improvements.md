# Plan: Mejoras ROI Calculator A-MAQ

## Resumen de cambios solicitados

1. Formateo de moneda en inputs con separadores y signo $
2. Campos monetarios en millones de pesos (MM COP)
3. Cálculo de hora-hombre desde salario mensual con factor prestacional colombiano
4. Alineación vertical en sección de Mantenimiento Correctivo
5. Resultados siempre en millones de pesos (no billones)
6. Encabezado del PDF arreglado (letras superpuestas)
7. Rediseño del PDF para verse profesional y similar al dashboard

---

## 1. CurrencyInput — Nuevo componente (`src/components/CurrencyInput.jsx`)

Crear componente reutilizable que:

- **Campos monetarios (MM COP)**: Muestra `$` como prefijo, formatea con separadores de miles (formato colombiano: `.` para miles, `,` para decimales). Al escribir `400` muestra `$ 400`. Unidad muestra "MM COP".
- **Campos no monetarios**: Comportamiento normal (número con unidad genérica como "equipos", "horas", etc.)
- Exportar función `isCurrencyField(fieldId)` para determinar si un campo es monetario
- Al hacer focus: muestra valor numérico crudo para edición. Al hacer blur: muestra valor formateado con `$`
- Los campos monetarios en MM COP muestran nota "(en millones de pesos)" debajo del label

**Campos definidos como monetarios (MM COP):**
- `costPerHourStop` → "MM COP/hora"
- `correctiveExternalCost` → "MM COP"
- `sparePartsInventoryCost` → "MM COP"
- `scheduledStopCost` → "MM COP/hora"
- `monthlyBilling` → "MM COP/mes"
- `preventiveMaintenanceCost` → "MM COP/año"
- `inducedFailureCost` → "MM COP/año"
- `technicianMonthlySalary` → "MM COP/mes" (nuevo, reemplaza manHourCost)

---

## 2. Constantes (`src/utils/constants.js`)

Cambios en `OPERATIONAL_FIELDS`:
- Actualizar `unit` de campos monetarios de "COP" / "COP/hora" / "COP/mes" / "COP/año" a "MM COP" / "MM COP/hora" / "MM COP/mes" / "MM COP/año"
- Reemplazar `manHourCost` por `technicianMonthlySalary`:
  - id: `technicianMonthlySalary`
  - label: "Salario mensual básico de un técnico de mantenimiento"
  - unit: "MM COP/mes"
  - placeholder: "Ej: 2 (si gana 2 millones de pesos mensuales)"
- Actualizar `OPERATIONAL_SECTIONS` sección "reactive":
  - Cambiar fields de `['reactiveManHours', 'manHourCost']` a `['reactiveManHours', 'technicianMonthlySalary']`

Cambios en `EQUIPMENT_MODELS`:
- Los precios se mantienen en COP completos internamente (21000000, 68000000, 115000000)
- Solo cambia la presentación en EquipmentForm

---

## 3. Estado del formulario (`src/hooks/useFormData.js`)

- Reemplazar `manHourCost: null` por `technicianMonthlySalary: null` en el estado inicial
- El campo sigue siendo parte de la sección `operational`

---

## 4. Formulario operativo (`src/components/OperationalForm.jsx`)

- Importar y usar `CurrencyInput` para campos monetarios
- Para campos no monetarios, mantener el input actual
- **Corregir alineación vertical**: Cambiar el grid de `grid grid-cols-1 md:grid-cols-2` a usar `items-end` para que los inputs se alineen horizontalmente entre columnas, o mejor, usar un layout donde label e input estén en filas separadas para garantizar alineación por el campo de entrada
- Para cada campo, determinar con `isCurrencyField()` si usa CurrencyInput o input normal

---

## 5. Motor de cálculo (`src/utils/calculations.js`)

### 5a. Factor prestacional colombiano

Agregar constante:
```js
const PRESTACIONAL_FACTOR = 1.75
const MONTHLY_WORKING_HOURS = 240 // 30 días × 8 horas (jornada legal Colombia)
```

Desglose del factor 1.75:
- Prima de servicios: 0.1667
- Cesantías: 0.0833
- Intereses sobre cesantías: 0.01
- Vacaciones: 0.0417
- Aportes parafiscales (SENA + ICBF + Caja): 0.09
- Pensión empleador: 0.12
- Salud empleador: 0.085
- ARP: 0.0243
- Caja compensación: 0.04
- Indemnización: 0.1283
- **Total: ≈1.75**

### 5b. Cálculo de hora-hombre desde salario

En `calculateFactors`, antes de los cálculos, derivar `manHourCost`:
```js
let manHourCost = data.manHourCost || 0
if (!manHourCost && data.technicianMonthlySalary > 0) {
  manHourCost = (data.technicianMonthlySalary * 1_000_000 * PRESTACIONAL_FACTOR) / MONTHLY_WORKING_HOURS
}
```

### 5c. Multiplicadores de millones

Antes de pasar a los cálculos, convertir los campos monetarios de MM COP a COP completos. Agregar una función auxiliar:
```js
const MILLIONS_FIELDS = [
  'costPerHourStop', 'correctiveExternalCost', 'sparePartsInventoryCost',
  'scheduledStopCost', 'monthlyBilling', 'preventiveMaintenanceCost',
  'inducedFailureCost', 'technicianMonthlySalary'
]

function ensureFullCOP(data) {
  const result = { ...data }
  MILLIONS_FIELDS.forEach(field => {
    if (result[field] && result[field] > 0) {
      result[field] = result[field] * 1_000_000
    }
  })
  return result
}
```

La función `calculateAll()` llama `ensureFullCOP()` antes de `calculateFactors()`.

### 5d. Ajustes específicos

- Factor f3 (Optimización HH Reactivo): usa `manHourCost` derivado del salario mensual
- El factor de vida útil (f6) usa `50000000 / 15` por activo crítico → cambiar a `50` si los criticalAssets ya están en unidades, o mantenerlo ya que el valor está en COP completos (50 millones)

Nota: Los campos de equipo (`totalAssets`, `criticalAssets`) y duraciones (`avgStopDuration`, `scheduledStopHours`, etc.) NO se multiplican por 1M.

---

## 6. Resultados (`src/pages/ResultsDashboard.jsx`)

Cambiar `formatCurrency` para que siempre use millones:
```js
const formatCurrency = (value) => {
  if (value === null || value === undefined) return '$0 MM COP'
  const millions = value / 1_000_000
  if (Math.abs(millions) >= 1000) {
    return `$${millions.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} MM COP`
  }
  return `$${millions.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 2 })} MM COP`
}
```

- Nunca mostrar "B" (billones)
- Siempre en "MM COP"
- Formato numérico alemán (puntos para miles, coma para decimales) consistente con Colombia

---

## 7. Gráficos

### BenefitsChart.jsx
- Ya usa millones internamente (`factor.savings / 1000000`)
- Cambiar tooltip de `$${value}M COP` a `$${value} MM COP`
- Cambiar eje X de `$${v}M` a `$${v} MM`

### TimelineChart.jsx  
- Cambiar `formatValue` para eliminar "B" y siempre usar "MM":
```js
const formatValue = (value) => {
  const millions = value / 1_000_000
  if (Math.abs(millions) >= 1000) {
    return `$${millions.toLocaleString('de-DE', { maximumFractionDigits: 0 })} MM`
  }
  return `$${millions.toFixed(1)} MM`
}
```

---

## 8. EquipmentForm.jsx

- Mostrar precios en formato MM COP: `$${(model.price / 1_000_000)} MM COP`
- Custom price input usa CurrencyInput con modo MM COP
- Nota inferior muestra precio seleccionado en formato MM COP

---

## 9. Formulario — Alineación Mantenimiento Correctivo

En `OperationalForm.jsx`, la sección de Mantenimiento Correctivo tiene solo 2 campos en un grid de 2 columnas. Para mejorar la alineación:

Opción A: Usar `items-end` en el grid para que los inputs se alineen por la base
Opción B: Agregar un label fijo arriba de cada input para que ambos inputs queden a la misma altura

Mejor solución: Cambiar la estructura del grid a items-end y agregar una clase `self-end` al contenido, o simplemente usar `items-end` en el contenedor grid. También se puede mejorar dándole más padding/espaciado a la sección.

---

## 10. PDF Generator — Rediseño completo (`src/utils/pdfGenerator.js`)

### Problema actual: encabezado superpuesto
- El logo se captura con html2canvas y se coloca en x=15, y=5, tamaño 30×30mm
- El título "REPORTE DE RETORNO DE INVERSIÓN (ROI)" empieza en x=15 (mismo x que el logo) → **se superponen**
- Solución: Mover el texto del título a x=50mm (después del logo)

### Rediseño del PDF

Estructura profesional con las siguientes secciones:

1. **Header** (0-40mm):
   - Fondo azul navy (#002B5C)
   - Logo a la izquierda (x=15, y=5, 30×30mm)
   - Título a la derecha del logo (x=50): "REPORTE DE RETORNO DE INVERSIÓN (ROI)"
   - Subtítulo: "Colectores de Vibración para Mantenimiento Predictivo"
   - Línea separadora

2. **Información del cliente** (45-70mm):
   - Fondo blanco con borde sutil
   - Grid 2×2: Empresa, Sector, Contacto, Fecha
   - Nombre del equipo seleccionado y precio

3. **KPI Cards** (72-115mm):
   - Fondo azul oscuro redondeado
   - 5 KPIs en fila: ROI, Payback, B/C, VAN, TIR
   - Valores en fuente grande (16pt), labels en pequeña (8pt)
   - Todos los valores monetarios en MM COP

4. **Barra de Certeza** (117-135mm):
   - Barra de progreso con color según nivel (verde/amarillo/rojo)

5. **Tabla de Factores** (137-210mm):
   - Header: Factor | Situación Actual | Ahorro Anual | Ahorro Mensual
   - Filas ordenadas por ahorro descendente
   - Valores en MM COP con formato colombiano
   - Fila TOTAL en negrita

6. **Nueva Página**: Proyección de Beneficio Neto
   - Tabla: Año | Ahorro Anual | Acumulado | ROI %
   - Valores en MM COP

7. **Advertencia de campos vacíos** (si aplica)

8. **Footer** en cada página:
   - Fondo azul navy
   - "A-MAQ S.A. | Medellín, Colombia | Mantenimiento Predictivo y Análisis de Vibración"
   - Disclaimer sobre proyecciones

### Formato de moneda en PDF
Todos los valores monetarios en formato MM COP: `$X.XX MM COP` (sin usar "B")

### Consideraciones de layout
- Margen: 15mm
- Ancho de contenido: 180mm (A4 = 210mm - 30mm márgenes)
- Persona encargada del diseño: usar colores del palette navy
- Espaciado consistente entre secciones
- Font: helvetica (bold para títulos, normal para contenido)
- Tamaños: Títulos 14-18pt, Contenido 9-11pt, KPIs 16-18pt
- No usar emojis en el PDF

---

## 10. Función auxiliar de formato (`src/utils/format.js` — opcional o inline)

Crear función compartida para formateo de moneda en millones:
```js
export function formatMillionsCOP(value) {
  if (value === null || value === undefined) return '$0 MM COP'
  const millions = value / 1_000_000
  const formatted = millions.toLocaleString('de-DE', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2
  })
  return `$${formatted} MM COP`
}
```

Usada en ResultsDashboard, BenefitsChart, TimelineChart, y pdfGenerator.

---

## Orden de implementación

1. `constants.js` — actualizar units, reemplazar manHourCost
2. `useFormData.js` — reemplazar campo
3. `calculations.js` — agregar conversión MM→COP, factor prestacional
4. `CurrencyInput.jsx` — crear componente
5. `OperationalForm.jsx` — usar CurrencyInput, corregir alineación
6. `EquipmentForm.jsx` — formato MM COP en precios
7. `ResultsDashboard.jsx` — formatCurrency en MM COP
8. `BenefitsChart.jsx` — labels en MM COP
9. `TimelineChart.jsx` — formatValue en MM COP
10. `pdfGenerator.js` — rediseño completo
11. Verificar app en localhost