# Documento de Especificaciones: Aplicativo Web de Cálculo de ROI
**Proyecto:** Digitalización y Refinamiento del Modelo de Retorno de Inversión (ROI)  
**Empresa:** A-MAQ S.A.  
**Versión:** 1.0  
**Fecha:** Abril de 2026

---

## 1. Introducción
El objetivo de este proyecto es migrar la herramienta actual de cálculo de ROI, basada en plantillas de Excel, a una **aplicación web moderna y refinada**. Esta herramienta permitirá al equipo comercial de A-MAQ S.A. presentar proyecciones financieras precisas y profesionales a clientes interesados en la adquisición de equipos de ingeniería especializada (turbinas, monitoreo sísmico, etc.).

## 2. Objetivos del Aplicativo
* **Profesionalización:** Eliminar la dependencia de hojas de cálculo y ofrecer una interfaz interactiva.
* **Centralización:** Unificar la metodología de cálculo, la argumentación técnica y las recomendaciones de expertos en un solo flujo de trabajo.
* **Conversión:** Facilitar el cierre de negocios mediante la generación de informes PDF profesionales.

---

## 3. Requisitos Funcionales

### 3.1 Módulo de Entrada de Datos (Inputs)
El sistema debe permitir la carga de variables críticas, divididas en categorías:
* **Datos de la Inversión:** Costo del equipo, costos de instalación, capacitación y puesta en marcha.
* **Variables Operativas:** Ahorros estimados en mantenimiento, reducción de tiempos de parada, eficiencia energética.
* **Parámetros Financieros:** Tasa de descuento, horizonte de tiempo (años) e impuestos aplicables.

### 3.2 Motor de Cálculo (Backend)
El aplicativo debe replicar y mejorar la lógica de la plantilla de Excel actual, incluyendo:
* **Cálculo de ROI:** $((\text{Beneficio} - \text{Inversión}) / \text{Inversión}) \times 100$.
* **VAN (Valor Actual Neto) y TIR (Tasa Interna de Retorno).**
* **Payback Period:** Determinación exacta del mes/año en que se recupera la inversión.
* **Incorporación de Mejoras:** Integrar los nuevos algoritmos y ajustes sugeridos por los expertos en los documentos de referencia.

### 3.3 Visualización y Dashboard
* Gráficos dinámicos que muestren la curva de recuperación de inversión.
* Comparativas entre "Escenario Actual" (sin inversión) vs. "Escenario con Equipo A-MAQ".
* Indicadores clave (KPIs) resaltados visualmente.

### 3.4 Generación de Reportes
* Botón para exportar un **informe técnico en PDF** con el logo de la empresa, la argumentación metodológica y los resultados finales, listo para enviar al cliente.

---

## 4. Requisitos No Funcionales
* **Interfaz de Usuario (UI):** Diseño limpio, minimalista y profesional (Refinado).
* **Responsividad:** Acceso total desde navegadores web (Desktop) y tablets para presentaciones en campo.
* **Seguridad:** Acceso restringido para el equipo de ventas y administración de A-MAQ S.A.
* **Mantenibilidad:** Código estructurado que permita ajustar variables financieras a futuro sin necesidad de reprogramación profunda.

---

## 5. Refinamientos Técnicos (Basado en Expertos)
*Sección para incluir los cambios específicos propuestos:*
1.  Se deben implementar los cambios propuestos en el documento de modificaciones.

---

## 6. Stack Tecnológico Sugerido
* **Frontend:** React.js o Vue.js (para una interfaz reactiva).
* **Backend:** Node.js o Python (para el motor de cálculo).
* **Estilos:** Tailwind CSS (para el acabado refinado).

---

> **Nota para el desarrollador:** Se entregarán como anexos la plantilla original de Excel y los documentos de metodología/argumentación con las notas de los expertos resaltadas para su integración.

---
