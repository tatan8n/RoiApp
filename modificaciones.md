# Anexo de Modificaciones: Refinamiento de Lógica y Nuevas Variables de ROI
**Proyecto:** Aplicativo Web ROI - A-MAQ S.A.  
**Referencia:** Feedback Técnico (Auditoría de Mantenimiento)  
**Fecha de Revisión:** 22 de abril de 2026

---

## 1. Cambio de Enfoque: Priorización por Equipos Críticos (Ley de Pareto)
Se debe modificar la estructura de captura de datos inicial. En lugar de solicitar promedios generales de toda la planta, el sistema debe guiar al usuario hacia sus activos de mayor impacto.

* **Nueva Variable de Entrada:** Número de equipos críticos en la planta.
* **Modificación de Flujo:** Las preguntas subsiguientes sobre costos de falla, tiempos de parada y beneficios deben responderse **exclusivamente** con base en estos equipos críticos.
* **Justificación:** El mayor beneficio del mantenimiento predictivo y el monitoreo (ROI real) se concentra en el "Pareto" de los activos, donde una falla no detectada representa el mayor impacto económico.

## 2. Inclusión de Costos por Mantenimiento Preventivo Ineficiente
Se integra una nueva sección para cuantificar el ahorro al migrar de un modelo preventivo (basado en tiempo/calendario) a uno predictivo (basado en condición).

* **Input Sugerido:** Gasto anual estimado en mantenimientos preventivos intrusivos en equipos críticos.
* **Variable de "Sobre-mantenimiento":** Porcentaje de equipos que son intervenidos (abiertos/desarmados) y se encuentran en buen estado (estimación técnica: ~30-40% en plantas no optimizadas).
* **Cálculo de Ahorro:** $$\text{Ahorro PM} = (\text{Costo Total Preventivo} \times \% \text{ de intervenciones innecesarias})$$

## 3. Cuantificación del Riesgo de Fallas Inducidas (Error Humano)
El sistema debe incluir un factor de riesgo por "Mantenimiento Intrusivo". Abrir un equipo que funciona bien para inspeccionarlo genera un riesgo de que quede mal armado o se contamine.

* **Nueva Variable:** Costo estimado de fallas inducidas por errores en el rearmado post-preventivo.
* **Lógica de Beneficio:** El monitoreo de A-MAQ S.A. elimina la necesidad de abrir el equipo innecesariamente, eliminando este riesgo operativo por completo.

## 4. Propuesta de Algoritmo para el ROI Ampliado
Para el desarrollo del motor de cálculo, se propone la siguiente fórmula para capturar estos nuevos puntos:

> **Beneficio Total =** (Ahorro por Fallas Catastróficas Evitadas) + (Ahorro en Repuestos/Mano de Obra de Preventivos Innecesarios) + (Costo de Producción No Perdida por Fallas Inducidas Evitadas).

---

## Resumen de Ajustes para la Interfaz (UI/UX)
1.  **Dashboard:** Añadir un indicador que muestre cuánto del ROI proviene de "Optimización de Preventivos".
2.  **Cuestionario:** Añadir la pregunta: *"¿Qué porcentaje de sus equipos desarmados por preventivo resultan estar en óptimas condiciones al momento de la apertura?"*
3.  **Argumentación:** Incluir en el reporte PDF una nota técnica sobre la reducción del riesgo de fallas por intervención humana.

---