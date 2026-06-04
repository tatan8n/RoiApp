# Auditoría del Cálculo de ROI — A-MAQ ROI Calculator

Fecha: 2026-06-03
Alcance: revisión integral de la lógica de cálculo (producto, rotodinámico y contrato marco),
detección de escenarios incoherentes, corrección de bugs técnicos y ajuste de supuestos de modelado.

Archivos auditados:
- `src/utils/calculations.js` (factores f1–f10, ROI/VAN/TIR/payback, Contrato Marco)
- `src/utils/calculationsRotodynamic.js` (f1–f6 turbinas)
- `src/utils/calculationValidator.js` (validación de entrada y resultados)
- `src/pages/FormWizard.jsx` (orquestación del cálculo)
- `src/pages/ResultsDashboard.jsx` (presentación de indicadores)

Leyenda de estado: ✅ corregido · 📝 cambio de modelado (requiere tu aprobación) · ⚠️ documentado

---

## 1. Bugs técnicos corregidos

### 1.1 ✅ Inversión ≤ 0 indistinguible de un ROI real de 0%
**Antes:** `calculateROI` devolvía `0` tanto para inversión inválida (0 o negativa) como para un ROI
real de 0%. Imposible auditar inversiones inválidas.
**Escenario reproducible:** inversión = 0, facturación = 1.000 MM → mostraba "ROI 0%" como si fuera
un resultado válido.
**Ahora:** `calculateROI`, `calculatePayback` y `calculateBenefitCostRatio` devuelven `null` cuando la
inversión es ≤ 0. La UI muestra **"N/A"** y se emite un warning de "inversión debe ser mayor a cero".
Archivos: `calculations.js`, `calculationsRotodynamic.js`, `ResultsDashboard.jsx`.

### 1.2 ✅ El horizonte de proyección elegido por el usuario se ignoraba
**Antes:** `FormWizard.jsx` sobreescribía `projectionYears` con `Math.floor(horizonOverride/12)` = **2
años fijos** (el `horizonOverride` arrancaba en 24 meses), ignorando los 3/5/7/10 años seleccionados en
el formulario financiero.
**Escenario reproducible:** elegir "10 años" en el paso financiero → los resultados se calculaban a 2
años.
**Ahora:** el cálculo usa `formData.financial.projectionYears` como fuente de verdad y el slider de
horizonte de la pantalla de resultados se inicializa a partir de ese valor. Archivo: `FormWizard.jsx`.

### 1.3 ✅ TIR del Contrato Marco mal formulada
**Antes:** `calculateTIR(totalSavings - annualContractValue, annualContractValue, years)` trataba un
flujo neto como anualidad constante con el pago del contrato como "inversión inicial" — mezcla
incoherente que producía TIR sin sentido (y positiva incluso cuando el contrato perdía dinero).
**Ahora:** nueva función `calculateIRRFromFlows(flows, initialOutlay)` que calcula la IRR sobre los
flujos netos reales año a año. En un contrato recurrente **sin inversión inicial**, si los flujos netos
son todos del mismo signo la IRR **no está definida** y se reporta **N/A** (honesto), en lugar de un
número inventado. Archivo: `calculations.js`.

### 1.4 ✅ Payback del Contrato Marco ignoraba la inflación
**Antes:** `calculatePayback(annualContractValue, totalSavings)` usaba solo el valor del primer año e
ignoraba que los pagos del contrato **escalan con la inflación** cada año.
**Escenario reproducible (paradoja):** contrato 100 MM/año, inflación 12%, ahorro 90 MM/año → el ROI
total salía negativo (−72%) pero el payback mostraba ~13 meses (contradicción: "se recupera" pero
pierde dinero).
**Ahora:** el payback se calcula recorriendo el flujo neto acumulado (modelando el primer pago como
desembolso y los pagos siguientes como costos). Si nunca cruza a positivo → `null` → **"No se recupera
en el horizonte"**. Verificado: el escenario de paradoja ahora da ROI −72% y payback N/A, coherentes.
Archivo: `calculations.js`.

### 1.5 ✅ Payback `null` se mostraba como "0 meses"
**Antes:** `ResultsDashboard.jsx` usaba `${results.payback || 0}` → un payback no calculable se veía
como "0 meses para recuperar" (engañoso).
**Ahora:** muestra **"N/A — No se recupera"**. Mismo tratamiento para ROI, B/C y TIR nulos. Archivo:
`ResultsDashboard.jsx`.

### 1.6 ✅ `validateInputData` estaba definido pero nunca se ejecutaba
**Antes:** la validación de entrada (inversión cero, activos críticos > totales, costos negativos)
existía pero **no se invocaba** en ningún flujo de cálculo, así que sus warnings nunca llegaban a la UI
(que sí tenía el bloque para mostrarlos).
**Ahora:** se invoca dentro de `calculateAll`, `calculateAllContratoMarco` y `calculateAllRotodynamic`,
y los warnings se propagan a `results.warnings`. Archivos: las tres funciones de cálculo + validador.

### 1.7 ✅ Sin validación de rango de los factores (benchmarks)
**Antes:** un benchmark negativo o > 1 (p. ej. `reductionFailures = -0.5`) producía ahorros negativos y
ROI invertido sin aviso.
**Ahora:** `validateInputData` hace *clamp* de cada benchmark a `[0, 1]` y emite un warning. Verificado:
`reductionFailures = -0.5` → se ajusta a 0% con aviso. Archivo: `calculationValidator.js`.

### 1.8 ✅ Rotodinámico: turbina "nueva" ignoraba las fallas reales
**Antes:** si `yearsOfOperation ≤ 2`, el factor f1 usaba **siempre** la estimación teórica de la
industria, aun cuando el usuario hubiera ingresado fallas críticas reales — subestimando el lucro
cesante hasta en un orden de magnitud.
**Escenario reproducible:** turbina de 1 año, 250 MW, 4 fallas reales, 50 MM/h → antes usaba ~346 MM
estimados; los datos reales implican ~4.800 MM/año.
**Ahora:** la estimación teórica solo se usa cuando **no** hay historial real de fallas; si hay datos
reales, se usan. Archivo: `calculationsRotodynamic.js`.

### 1.9 ✅ Heat rate actual < diseño se ignoraba en silencio
**Antes:** si el heat rate actual era menor que el de diseño (probable error de captura o turbina
sobre-eficiente), f2 simplemente no calculaba ahorro y no avisaba.
**Ahora:** se emite un warning explicando la situación. Archivo: `calculationsRotodynamic.js`.

### 1.10 ✅ Validaciones lógicas faltantes
Agregadas como warnings: **MTTR > duración promedio del paro** (imposible), **demora de repuestos >
365 días** (distorsiona f4), **facturación anual < valor del contrato** (probable error de unidad).
Archivos: `calculationValidator.js`, `calculationsRotodynamic.js`.

### 1.11 ✅ Umbral de alerta de ahorros inconsistente
**Antes:** el flag `savingsOverCap` se disparaba al 15% (`MAX_SAVINGS_OF_REVENUE = 0.15`) pero el
mensaje de la UI y el tope real decían 30%.
**Ahora:** alineado a 30% (`MAX_SAVINGS_PCT_OF_REVENUE`). Archivo: `calculations.js`.

---

## 2. Cambios de supuestos de modelado (📝 requieren tu aprobación)

> Estos cambios alteran cómo se modela el negocio, no solo corrigen errores. Se implementaron con una
> opción defendible y se documentan aquí para que los apruebes o ajustes. Son fáciles de revertir.

### 2.1 📝 Factor f8 (Seguridad/Seguros) ahora es condicional
**Antes:** f8 se activaba con **solo** tener facturación (`monthlyBilling > 0`), sumando
automáticamente el 2% de la facturación anual × reducción de riesgo. Esto permitía el escenario
"facturación → ROI instantáneo": un cliente sin datos de fallas obtenía ahorros (y ROI) inventados solo
por declarar su facturación.
**Cambio:** f8 ahora exige **evidencia de exposición a fallas** — al menos uno de: fallas no
planificadas, costo de fallas inducidas, o intervenciones correctivas externas. Verificado: facturación
sola ya no activa f8.
**Decisión pendiente:** ¿te parece bien este criterio, o prefieres un campo explícito de
"incidentes/riesgo de seguridad" en el formulario? (Por defecto quedó el criterio de evidencia de
fallas.)

### 2.2 📝 Contrato Marco: los ahorros ahora inflan igual que los pagos
**Antes:** los pagos del contrato inflaban año a año pero los ahorros se mantenían planos, sesgando el
análisis a **rechazar** contratos que en realidad son favorables (los costos evitados también crecen
con la inflación).
**Cambio:** los ahorros se inflan a la misma tasa que los pagos. Archivo: `calculations.js`.
**Decisión pendiente:** si prefieres que los ahorros NO inflen (postura conservadora), se revierte en
una línea.

### 2.3 ⚠️ Posible doble conteo entre factores f1, f5 y f6
**Observación (no se alteró la fórmula):** la reducción de fallas (f1), el diferimiento de vida útil
(f6) y la reducción de paros programados (f5) pueden capturar parcialmente el **mismo** beneficio
físico, sobreestimando el ahorro total cuando los tres están activos.
**Por qué no se cambió automáticamente:** corregir el solapamiento implica inventar un factor de
descuento entre factores, que es una decisión de modelado tuya. En su lugar se mantiene el sistema
existente de **"factores dominantes"** y los topes de cordura (ROI máx. 1000%, ahorro máx. 30% de
facturación) que ya alertan sobre resultados desproporcionados.
**Decisión pendiente:** ¿quieres que implemente un ajuste de solapamiento (p. ej. descontar f6 cuando
f1 es alto) o lo dejamos como alerta informativa?

---

## 3. Topes de cordura existentes (se conservaron)

- **ROI máximo razonable:** 1000% (`MAX_REASONABLE_ROI`). Sobre ese valor se capa y se marca
  `roiWasCapped`. Útil para inversiones mínimas con ahorros enormes.
- **Ahorro máximo:** 30% de la facturación anual (`MAX_SAVINGS_PCT_OF_REVENUE`).
- **Alertas:** factores dominantes (>50% producto / >70% rotodinámico), ROI > 300% (warning) / > 500%
  (peligro), ahorro desproporcionado.

---

## 4. Escenarios de prueba verificados

| # | Escenario | Resultado esperado | Verificado |
|---|-----------|--------------------|:----------:|
| 1 | Inversión 0 + facturación grande, sin fallas | ROI/Payback/B/C = N/A, sin ahorro por f8, warning | ✅ |
| 2 | Producto normal coherente | ROI positivo realista, payback en meses | ✅ |
| 3 | Solo facturación (sin fallas) | f8 NO se activa | ✅ |
| 4 | Contrato Marco: inflación 12% > ahorro | ROI negativo, payback "No se recupera", TIR N/A | ✅ |
| 5 | Benchmark negativo (−50%) | Clamp a 0% + warning | ✅ |
| 6 | Turbina nueva (1 año) con fallas reales | Usa datos reales, no la estimación teórica | ✅ |
| 7 | IRR de flujos del mismo signo | N/A (no definida) | ✅ |

---

## 5. Pendientes / recomendaciones

- **Aprobar los 3 cambios de modelado** de la sección 2 (f8 condicional, inflación de ahorros, doble
  conteo).
- **Seguridad:** la API key de Gemini estaba hardcodeada y quedó expuesta. Se movió a `.env`
  (no versionado). **Revoca la key actual en Google Cloud, genera una nueva y restríngela por dominio
  (HTTP referrer)**, ya que en una app de frontend cualquier key queda visible en el bundle.
