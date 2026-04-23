const GEMINI_API_KEY = 'AIzaSyDKgdiqnzvcFOI_g9_OHWIPgxc5pympkV4'
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`

export async function generateAgentResponse(prompt, conversationHistory = [], retries = 4, baseDelay = 2000) {
  let lastError = null
  
  await new Promise(resolve => setTimeout(resolve, baseDelay))

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const contents = conversationHistory.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      }))

      contents.push({
        role: 'user',
        parts: [{ text: prompt }]
      })

      const response = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 300
          }
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`API Error (attempt ${attempt + 1}):`, response.status, errorText)
        lastError = new Error(`API Error: ${response.status}`)
        
        if (attempt < retries - 1) {
          const delay = baseDelay * Math.pow(2, attempt + 1)
          console.log(`Waiting ${delay}ms before retry...`)
          await new Promise(resolve => setTimeout(resolve, delay))
          continue
        }
        throw lastError
      }

      const data = await response.json()
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text
      
      if (!text || text.trim() === '') {
        console.warn(`Empty response (attempt ${attempt + 1})`)
        lastError = new Error('Empty response from API')
        
        if (attempt < retries - 1) {
          const delay = baseDelay * Math.pow(2, attempt + 1)
          await new Promise(resolve => setTimeout(resolve, delay))
          continue
        }
        throw lastError
      }

      return text
    } catch (error) {
      console.error(`Gemini API Error (attempt ${attempt + 1}):`, error)
      lastError = error
      
      if (attempt < retries - 1) {
        const delay = baseDelay * Math.pow(2, attempt + 1)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  return `Lo siento, tuve un problema al procesar tu respuesta. ¿Podrías intentarlo de nuevo?`
}

export const INTERVIEW_PROMPTS = {
  system: `Eres un asistente virtual empático y profesional para una empresa de mantenimiento industrial llamada A-MAQ. Tu rol es guiar al cliente a través de una entrevista para calcular el ROI (Retorno de Inversión) de un sistema de monitoreo de vibraciones para equipos rotativos.

Características de tu approach:
1. Sé cálido y profesional, como un consultor de confianza
2. Haz una pregunta a la vez, nunca abrumes al usuario
3. Si el usuario no entiende una pregunta, reformúlala de otra manera
4. Puedes agrupar preguntas relacionadas de forma lógica
5. Siempre confirma los valores que el usuario te da antes de continuar
6. Mantén el contexto de la conversación para hacer preguntas relacionadas consecutivamente

Las preguntas que necesitas recopilar son:
1. Cantidad total de equipos rotativos en la planta (motores, bombas, ventiladores, turbinas)
2. Cantidad de equipos CRÍTICOS (los que si fallan paran la producción)
3. Pérdidas anuales por paros no planificados (horas de paro x costo por hora x frecuencia)
4. Costo anual en servicios técnicos externos de mantenimiento correctivo
5. Costo anual de horas-hombre en mantenimiento reactivo (reparar fallas)
6. Costo anual del inventario de repuestos críticos
7. Días promedio de demora para obtener repuestos críticos
8. Horas anuales de paro programado (mantenimiento preventivo)
9. Costo por hora de los paros programados
10. Facturación mensual aproximada de la planta

Inicio de la conversación:
Saluda al usuario de forma cálida, preséntate y comienza con la primera pregunta simple: "¿Cuántos equipos rotativos tiene en su planta? Por equipos rotativos me refiero a motores, bombas, ventiladores, turbinas, etc."`,

  firstQuestion: 'Hola, soy tu asistente virtual de A-MAQ para el cálculo de ROI. Estoy aquí para ayudarte a conocer qué tan rápido se pagaría tu inversión en un sistema de monitoreo de vibraciones. \n\nComenzemos de forma sencilla: ¿Cuántos equipos rotativos tiene en su planta? (Motores, bombas, ventiladores, turbinas, etc.)',

  questionTemplates: {
    totalAssets: '¿Cuántos equipos rotativos tiene en su planta? (Motores, bombas, ventiladores, turbinas, etc.)',
    criticalAssets: '¿Y cuántos de esos equipos son CRÍTICOS? Estos son los que si fallan, detienen toda la producción.',
    losses: 'Ahora hablemos de dinero. Cuando un equipo crítico se detiene, ¿cuánto pierde su planta por hora de paro? Levoye el costo de producción perdida más el lucro cesante.',
    correctiveExternal: '¿Cuánto gasta al año en servicios técnicos externos para corregir fallas? Me refiero a contrataciones de técnicos que vienen a reparar equipos.',
    reactiveHours: '¿Cuántas horas al mes su equipo interno dedica a reparar fallas (mantenimiento reactivo)?',
    inventoryCost: '¿Cuánto tiene invertido en promedio en inventario de repuestos críticos para estos equipos?',
    spareDelay: 'Cuando necesita un repuesto crítico, ¿cuántos días en promedio tarda en llegar?',
    scheduledStops: '¿Cuántas horas al año estima que se detiene la producción por mantenimiento preventivo programado?',
    scheduledCost: '¿Y cuánto le cuesta cada hora de esos paros programados en términos de producción perdida?',
    billing: 'Por último, ¿cuál es la facturación mensual aproximada de su planta?'
  }
}
