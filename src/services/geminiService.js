// Proveedor de IA activo: 'groq' (gratis, recomendado) o 'gemini'.
const AI_PROVIDER = (import.meta.env?.VITE_AI_PROVIDER || 'gemini').toLowerCase()

// --- Gemini ---
const GEMINI_API_KEY = import.meta.env?.VITE_GEMINI_API_KEY || ''
const GEMINI_MODEL = import.meta.env?.VITE_GEMINI_MODEL || 'gemini-2.0-flash'
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`

// --- Groq (API compatible con OpenAI, tier gratuito global) ---
const GROQ_API_KEY = import.meta.env?.VITE_GROQ_API_KEY || ''
const GROQ_MODEL = import.meta.env?.VITE_GROQ_MODEL || 'llama-3.3-70b-versatile'
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'

export function isAssistantConfigured() {
  if (AI_PROVIDER === 'groq') return Boolean(GROQ_API_KEY)
  return Boolean(GEMINI_API_KEY)
}

/**
 * Traduce un error de Groq a un mensaje accionable en español.
 */
function friendlyGroqError(status, body) {
  let apiMessage = ''
  try {
    const parsed = typeof body === 'string' ? JSON.parse(body) : body
    apiMessage = parsed?.error?.message || ''
  } catch { /* body no era JSON */ }

  if (status === 401) {
    return 'La clave de Groq es inválida. Obtén una gratis en https://console.groq.com/keys y pégala en .env (VITE_GROQ_API_KEY).'
  }
  if (status === 429) {
    return 'Alcanzaste el límite de solicitudes gratuitas de Groq por el momento. Espera unos segundos e inténtalo de nuevo.'
  }
  if (status === 404 || apiMessage.includes('model')) {
    return `El modelo "${GROQ_MODEL}" no está disponible. Cambia VITE_GROQ_MODEL en .env (ej: "llama-3.3-70b-versatile" o "llama-3.1-8b-instant").`
  }
  return `Error de la API de Groq (${status}). ${apiMessage || 'Inténtalo de nuevo en unos segundos.'}`
}

/**
 * Llamada a Groq (chat completions estilo OpenAI). messages incluye el system.
 */
async function callGroq(messages, retries = 3, baseDelay = 800) {
  let lastError = null
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(GROQ_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          temperature: 0.6,
          max_tokens: 800,
          messages
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Groq API Error (intento ${attempt + 1}):`, response.status, errorText)
        const friendly = friendlyGroqError(response.status, errorText)
        lastError = new Error(friendly)
        const nonTransient = response.status === 401 || response.status === 404
        if (!nonTransient && attempt < retries - 1) {
          await new Promise(r => setTimeout(r, baseDelay * Math.pow(2, attempt)))
          continue
        }
        throw lastError
      }

      const data = await response.json()
      const text = data.choices?.[0]?.message?.content
      if (!text || text.trim() === '') {
        lastError = new Error('Respuesta vacía de la API')
        if (attempt < retries - 1) {
          await new Promise(r => setTimeout(r, baseDelay * Math.pow(2, attempt)))
          continue
        }
        throw lastError
      }
      return text
    } catch (error) {
      console.error(`Groq API Error (intento ${attempt + 1}):`, error)
      lastError = error
      if (attempt < retries - 1) {
        await new Promise(r => setTimeout(r, baseDelay * Math.pow(2, attempt)))
      }
    }
  }
  throw lastError || new Error('No se pudo contactar a Groq')
}

/**
 * Traduce un error de la API de Gemini a un mensaje accionable en español.
 */
function friendlyGeminiError(status, body) {
  let apiStatus = ''
  let apiMessage = ''
  try {
    const parsed = typeof body === 'string' ? JSON.parse(body) : body
    apiStatus = parsed?.error?.status || ''
    apiMessage = parsed?.error?.message || ''
  } catch { /* body no era JSON */ }

  if (status === 429 || apiStatus === 'RESOURCE_EXHAUSTED') {
    return 'Tu clave de Gemini no tiene cuota gratuita disponible. Genera una clave nueva y gratuita en https://aistudio.google.com/app/apikey y pégala en el archivo .env (VITE_GEMINI_API_KEY).'
  }
  if (status === 403 || apiStatus === 'PERMISSION_DENIED') {
    return 'La clave no tiene permiso para este modelo. Genera una clave nueva en https://aistudio.google.com/app/apikey (desde "Get API key"), o cambia el modelo en .env (VITE_GEMINI_MODEL).'
  }
  if (apiMessage.includes('API_KEY_INVALID') || apiMessage.includes('API key not valid')) {
    return 'La clave de Gemini es inválida. Revisa VITE_GEMINI_API_KEY en el archivo .env y reinicia el servidor de desarrollo.'
  }
  if (status === 404 || apiStatus === 'NOT_FOUND') {
    return `El modelo "${GEMINI_MODEL}" no está disponible para tu clave. Cambia VITE_GEMINI_MODEL en .env (prueba con "gemini-2.0-flash" o "gemini-2.5-flash").`
  }
  return `Error de la API de Gemini (${status}). ${apiMessage || 'Inténtalo de nuevo en unos segundos.'}`
}

/**
 * Llamada cruda a Gemini. Devuelve el texto del modelo o lanza error tras reintentos.
 */
export async function generateAgentResponse(prompt, conversationHistory = [], retries = 3, baseDelay = 800) {
  let lastError = null

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const contents = conversationHistory.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }))
      contents.push({ role: 'user', parts: [{ text: prompt }] })

      const response = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: { temperature: 0.6, maxOutputTokens: 800 }
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Gemini API Error (intento ${attempt + 1}):`, response.status, errorText)
        const friendly = friendlyGeminiError(response.status, errorText)
        lastError = new Error(friendly)
        // 403/404/clave inválida no son transitorios: no reintentar.
        const nonTransient = response.status === 403 || response.status === 404 ||
          friendly.includes('inválida')
        if (!nonTransient && attempt < retries - 1) {
          await new Promise(r => setTimeout(r, baseDelay * Math.pow(2, attempt)))
          continue
        }
        throw lastError
      }

      const data = await response.json()
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text
      if (!text || text.trim() === '') {
        lastError = new Error('Respuesta vacía de la API')
        if (attempt < retries - 1) {
          await new Promise(r => setTimeout(r, baseDelay * Math.pow(2, attempt)))
          continue
        }
        throw lastError
      }
      return text
    } catch (error) {
      console.error(`Gemini API Error (intento ${attempt + 1}):`, error)
      lastError = error
      if (attempt < retries - 1) {
        await new Promise(r => setTimeout(r, baseDelay * Math.pow(2, attempt)))
      }
    }
  }
  throw lastError || new Error('No se pudo contactar a Gemini')
}

/**
 * Esquema de campos por tipo de cálculo. Cada entrada describe la ruta interna
 * (sección.campo), una descripción y la UNIDAD esperada, para que el modelo emita
 * valores en la convención correcta de almacenamiento.
 */
const COMMON_CLIENT = [
  ['client.companyName', 'Nombre de la empresa (texto)'],
  ['client.sector', 'Sector industrial (texto, ej: Hidroeléctrica, Manufactura, Oil & Gas)'],
  ['client.contactName', 'Nombre del contacto (texto)']
]

const FINANCIAL = [
  ['financial.discountRate', 'Tasa de descuento anual como FRACCIÓN decimal (ej: 0.12 para 12%)'],
  ['financial.projectionYears', 'Horizonte en años (número entero del 1 al 10)']
]

const OPERATIONAL = [
  ['operational.totalAssets', 'Total de equipos rotativos (número entero)'],
  ['operational.criticalAssets', 'Equipos críticos (número entero, ≤ total)'],
  ['operational.avgCriticalAssetValue', 'Valor de reposición por equipo crítico en MILLONES de COP'],
  ['operational.costPerHourStop', 'Costo por hora de paro no planificado en MILLONES de COP/hora'],
  ['operational.unplannedFailures', 'Frecuencia de fallas no planificadas (paros por año)'],
  ['operational.avgStopDuration', 'Duración promedio de cada paro (horas)'],
  ['operational.correctiveExternalCost', 'Costo por intervención correctiva externa en MILLONES de COP'],
  ['operational.correctiveExternalCount', 'Intervenciones correctivas externas por año (número)'],
  ['operational.reactiveManHours', 'Horas-hombre mensuales en mantenimiento reactivo (horas/mes)'],
  ['operational.technicianMonthlySalary', 'Salario mensual de un técnico en MILLONES de COP'],
  ['operational.sparePartsDelay', 'Demora promedio en repuestos críticos (días)'],
  ['operational.sparePartsInventoryCost', 'Costo del inventario de repuestos críticos en MILLONES de COP'],
  ['operational.scheduledStopHours', 'Horas de paro programado anuales (horas/año)'],
  ['operational.scheduledStopCost', 'Costo por hora de paro programado en MILLONES de COP/hora'],
  ['operational.monthlyBilling', 'Facturación mensual en MILLONES de COP'],
  ['operational.preventiveMaintenanceCost', 'Costo anual de mantenimiento preventivo en MILLONES de COP'],
  ['operational.unnecessaryPreventivePercentage', '% de preventivos innecesarios como número entero 0-100'],
  ['operational.inducedFailureCost', 'Costo anual de fallas por error humano en MILLONES de COP'],
  ['operational.annualEnergyCost', 'Costo anual de energía en MILLONES de COP']
]

const BENCHMARKS = [
  ['benchmarks.reductionFailures', 'Reducción de fallas como FRACCIÓN decimal (ej: 0.5 para 50%)'],
  ['benchmarks.reductionCorrective', 'Reducción de correctivo como FRACCIÓN decimal'],
  ['benchmarks.optimizationHH', 'Optimización de horas-hombre como FRACCIÓN decimal'],
  ['benchmarks.reductionDelays', 'Reducción de demoras como FRACCIÓN decimal'],
  ['benchmarks.reductionScheduledStops', 'Reducción de paros programados como FRACCIÓN decimal']
]

const PRODUCT_EQUIPMENT = [
  ['equipment.modelId', 'Modelo del equipo: uno de "vibriom" (VibrioM – básico, ~21M COP), "va3pro" (VA3pro – intermedio, ~68M COP), "va5pro" (VA5pro – avanzado, ~115M COP)']
]

// Las monedas: en COP los montos grandes van en MILLONES; en USD en dólares completos.
function contratoMarcoSchema(currency) {
  const big = currency === 'USD' ? 'en USD' : 'en MILLONES de COP'
  return [
    ['contratoMarco.annualContractValue', `Valor anual del contrato ${big}`],
    ['contratoMarco.inflationRate', 'Tasa de inflación anual como FRACCIÓN decimal (ej: 0.04)']
  ]
}

function rotodynamicSchema(currency) {
  const isUSD = currency === 'USD'
  const big = isUSD ? 'en USD' : 'en MILLONES de COP'
  return [
    ['rotodynamic.serviceValue', `Valor anual del servicio ${big}`],
    ['rotodynamic.turbineType', 'Tipo de turbina: uno de "gas", "steam", "hydro"'],
    ['rotodynamic.numTurbines', 'Número de turbinas (entero)'],
    ['rotodynamic.nominalCapacity', 'Capacidad nominal por unidad (MW)'],
    ['rotodynamic.yearsOfOperation', 'Años de operación (número)'],
    ['rotodynamic.costPerHourStop', `Costo por hora de paro ${isUSD ? 'en USD/hora' : 'en MILLONES de COP/hora'}`],
    ['rotodynamic.criticalFailures', 'Fallas críticas en los últimos 24 meses (número)'],
    ['rotodynamic.avgStopDuration', 'Duración promedio de paros (horas)'],
    ['rotodynamic.mttr', 'MTTR, tiempo de reparación (horas)'],
    ['rotodynamic.externalInterventionCost', `Costo de intervención externa de emergencia ${big}`],
    ['rotodynamic.reactiveManHours', 'Horas-hombre anuales de mantenimiento reactivo (horas/año)'],
    ['rotodynamic.internalLaborCost', `Costo hora-hombre interna ${isUSD ? 'en USD/hora' : 'en COP/hora (valor completo, no millones)'}`],
    ['rotodynamic.billingAffected', `Facturación afectada por energía no entregada ${isUSD ? 'en USD/año' : 'en MILLONES de COP/año'}`],
    ['rotodynamic.sparePartsDelay', 'Demora promedio en repuestos críticos (días)'],
    ['rotodynamic.heatRateDesign', 'Heat rate de diseño (BTU/kWh)'],
    ['rotodynamic.heatRateActual', 'Heat rate actual (BTU/kWh)'],
    ['rotodynamic.fuelCost', `Costo de combustible ${isUSD ? 'en USD/kWh' : 'en COP/kWh (valor completo, no millones)'}`]
  ]
}

function getSchema(calculationType, serviceType, currency = 'COP') {
  if (calculationType === 'product') {
    return [...COMMON_CLIENT, ...PRODUCT_EQUIPMENT, ...OPERATIONAL, ...BENCHMARKS, ...FINANCIAL]
  }
  if (serviceType === 'contrato_marco') {
    return [...COMMON_CLIENT, ...contratoMarcoSchema(currency), ...OPERATIONAL, ...BENCHMARKS, ...FINANCIAL]
  }
  return [...COMMON_CLIENT, ...rotodynamicSchema(currency), ...FINANCIAL]
}

export function getAssistantSchema(calculationType, serviceType, currency = 'COP') {
  return getSchema(calculationType, serviceType, currency)
}

function buildSystemPrompt(calculationType, serviceType, currency = 'COP') {
  const schema = getSchema(calculationType, serviceType, currency)
  const fieldList = schema.map(([path, desc]) => `- ${path}: ${desc}`).join('\n')
  const tipo = calculationType === 'product'
    ? 'compra de un equipo de monitoreo de vibraciones'
    : serviceType === 'contrato_marco'
      ? 'un contrato marco de servicios de mantenimiento'
      : 'un servicio de diagnóstico rotodinámico de turbinas'
  const monedaNombre = currency === 'USD'
    ? 'dólares estadounidenses (USD)'
    : 'pesos colombianos (COP); los montos grandes se expresan en MILLONES de COP salvo que el catálogo indique lo contrario'

  return `Eres un consultor virtual cálido y profesional de A-MAQ, empresa colombiana de mantenimiento industrial predictivo. Tu objetivo es entrevistar al cliente para reunir los datos necesarios para calcular el ROI de ${tipo}.

CONTEXTO YA DEFINIDO POR EL USUARIO (NO lo vuelvas a preguntar):
- Tipo de análisis: ${tipo}.
- Moneda: ${monedaNombre}. Expresa y solicita TODOS los montos en esta moneda, usando exactamente las unidades del catálogo. Nunca menciones ni pidas otra moneda.

REGLAS DE LA ENTREVISTA (modo híbrido guiado + lenguaje natural):
1. Haz UNA pregunta a la vez, en español, de forma natural y empática. Puedes agrupar 2 datos muy relacionados si fluye bien.
2. Acepta respuestas en lenguaje natural. Si el usuario describe varias cosas a la vez ("tengo 200 bombas, 4 críticas"), INFIERE todos los campos que puedas de esa respuesta.
3. Si no entiendes o el dato es ambiguo, reformula con otras palabras en lugar de insistir igual.
4. No abrumes: prioriza primero los datos de mayor impacto (fallas, costos de paro, facturación) y deja los secundarios para después.
5. Cuando creas que ya hay datos suficientes para un cálculo razonable, marca "complete": true e invita al usuario a calcular o revisar.

FORMATO DE SALIDA — OBLIGATORIO:
Responde SIEMPRE con un único bloque JSON válido (y nada fuera del bloque), con esta forma exacta:
\`\`\`json
{
  "reply": "tu mensaje conversacional y la siguiente pregunta",
  "fields": { "seccion.campo": valor, ... },
  "complete": false
}
\`\`\`
- En "fields" incluye SOLO los campos que hayas podido inferir con seguridad en este turno (pueden ser 0, 1 o varios). Usa exactamente las rutas y unidades del catálogo. No inventes valores que el usuario no haya dado.
- Los valores numéricos van como números (no strings). Respeta las unidades indicadas (millones de COP, fracciones decimales para porcentajes, etc.).
- "reply" nunca debe ir vacío.

CATÁLOGO DE CAMPOS (ruta: descripción y unidad):
${fieldList}

Comienza saludando brevemente y haciendo la primera pregunta de mayor impacto.`
}

function parseAssistantJSON(text) {
  if (!text) return null
  // Extrae el primer bloque ```json ... ``` o el primer objeto { ... }.
  let raw = text.trim()
  const fence = raw.match(/```(?:json)?\s*([\s\S]*?)```/i)
  if (fence) raw = fence[1].trim()
  else {
    const first = raw.indexOf('{')
    const last = raw.lastIndexOf('}')
    if (first !== -1 && last !== -1) raw = raw.slice(first, last + 1)
  }
  try {
    const parsed = JSON.parse(raw)
    return {
      reply: typeof parsed.reply === 'string' ? parsed.reply : '',
      fields: parsed.fields && typeof parsed.fields === 'object' ? parsed.fields : {},
      complete: Boolean(parsed.complete)
    }
  } catch (e) {
    console.warn('No se pudo parsear JSON del asistente, se usa texto plano.', e)
    return { reply: text, fields: {}, complete: false }
  }
}

/**
 * Ejecuta un turno de la entrevista. Recibe el historial (array {role, content}),
 * el mensaje del usuario (o null para arrancar) y el contexto del tipo de cálculo.
 * Devuelve { reply, fields, complete }.
 */
export async function runAssistantTurn({ history = [], userMessage = null, calculationType, serviceType, currency = 'COP' }) {
  const system = buildSystemPrompt(calculationType, serviceType, currency)
  const prompt = userMessage || 'Inicia la entrevista ahora.'

  let text
  if (AI_PROVIDER === 'groq') {
    // Groq usa rol "system" nativo (formato OpenAI).
    const messages = [
      { role: 'system', content: system },
      ...history.map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content })),
      { role: 'user', content: prompt }
    ]
    text = await callGroq(messages)
  } else {
    // Gemini no tiene rol "system" dedicado en v1beta generateContent; lo anteponemos
    // como primer turno de usuario seguido de un ack del modelo.
    const seededHistory = [
      { role: 'user', content: system },
      { role: 'assistant', content: 'Entendido. Comenzaré la entrevista y responderé siempre en el formato JSON indicado.' },
      ...history
    ]
    text = await generateAgentResponse(prompt, seededHistory)
  }
  return parseAssistantJSON(text)
}
