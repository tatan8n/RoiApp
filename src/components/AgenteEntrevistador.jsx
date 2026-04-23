import React, { useState, useRef, useEffect } from 'react'
import { generateAgentResponse, INTERVIEW_PROMPTS } from '../services/geminiService'
import { COLORS } from '../utils/constants'

const QUESTIONS = [
  { id: 'totalAssets', label: 'Equipos rotativos totales', unit: 'equipos' },
  { id: 'criticalAssets', label: 'Equipos críticos', unit: 'equipos' },
  { id: 'losses', label: 'Pérdidas anuales por paros', unit: 'COP/año' },
  { id: 'correctiveExternal', label: 'Costo anual correctivos externos', unit: 'COP/año' },
  { id: 'reactiveHours', label: 'Costo anual HH reactivas', unit: 'COP/año' },
  { id: 'inventoryCost', label: 'Costo inventario repuestos', unit: 'COP/año' },
  { id: 'spareDelay', label: 'Días de demora repuestos', unit: 'días' },
  { id: 'scheduledStops', label: 'Horas paro programado anuales', unit: 'horas/año' },
  { id: 'scheduledCost', label: 'Costo por hora paros programados', unit: 'COP/hora' },
  { id: 'billing', label: 'Facturación mensual', unit: 'COP/mes' }
]

export default function AgenteEntrevistador({ onComplete, initialData }) {
  const [messages, setMessages] = useState([])
  const [currentInput, setCurrentInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState(initialData || {})
  const [conversationStarted, setConversationStarted] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const startInterview = async () => {
    setConversationStarted(true)
    setIsTyping(true)

    const response = await generateAgentResponse(INTERVIEW_PROMPTS.firstQuestion)

    setMessages([
      { role: 'assistant', content: response }
    ])
    setIsTyping(false)
  }

  const sendMessage = async () => {
    if (!currentInput.trim() || isTyping) return

    const userMessage = currentInput.trim()
    setCurrentInput('')

    setMessages(prev => [...prev, { role: 'user', content: userMessage }])

    const currentQuestion = QUESTIONS[currentQuestionIndex]
    let numericValue = parseFloat(userMessage.replace(/[$,\s]/g, '').replace(',', '.'))

    if (isNaN(numericValue) && currentQuestion.id !== 'spareDelay') {
      numericValue = 0
    }

    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: currentQuestion.id === 'spareDelay' ? userMessage : numericValue
    }))

    setIsTyping(true)

    const nextQuestionIndex = currentQuestionIndex + 1

    if (nextQuestionIndex < QUESTIONS.length) {
      const nextQuestion = QUESTIONS[nextQuestionIndex]
      const prompt = `${userMessage}. Para la siguiente pregunta sobre "${nextQuestion.label}": ¿Podrías reformularla de una manera diferente pero que obtenga la misma información? Solo dame la pregunta reformulada, sé breve.`

      const response = await generateAgentResponse(prompt)

      setMessages(prev => [...prev, { role: 'assistant', content: response }])
      setCurrentQuestionIndex(nextQuestionIndex)
    } else {
      const summaryPrompt = `El usuario ha completado todas las preguntas. Genera un resumen corto y amable de los valores obtenidos: ${JSON.stringify(answers)}, ${currentQuestion.id}: ${numericValue}. Confirma que los valores son correctos y pregunta si desea ajustar algo antes de continuar.`

      const response = await generateAgentResponse(summaryPrompt)
      setMessages(prev => [...prev, { role: 'assistant', content: response }])
    }

    setIsTyping(false)
  }

  const handleComplete = () => {
    const mappedData = {
      totalAssets: answers.totalAssets || 0,
      criticalAssets: answers.criticalAssets || 0,
      costPerHourStop: (answers.losses || 0) / (((answers.scheduledStops || 0) > 0 ? answers.scheduledStops : 1) * (answers.correctiveExternal || 1)),
      unplannedFailures: 3,
      avgStopDuration: 4,
      correctiveExternalCost: (answers.correctiveExternal || 0) / 3,
      correctiveExternalCount: 3,
      reactiveManHours: (answers.reactiveHours || 0) / (12 * (answers.reactiveHours || 1)),
      manHourCost: 50000,
      sparePartsDelay: parseInt(answers.spareDelay) || 0,
      sparePartsInventoryCost: answers.inventoryCost || 0,
      scheduledStopHours: answers.scheduledStops || 0,
      scheduledStopCost: answers.scheduledCost || 0,
      monthlyBilling: answers.billing || 0
    }

    onComplete(mappedData)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!conversationStarted) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 rounded-full bg-navy-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🤖</span>
          </div>
          <h2 className="text-2xl font-bold text-navy-900 mb-2">Entrevista Agéntica</h2>
          <p className="text-navy-600">
            Te guiaré a través de algunas preguntas para calcular el ROI de tu sistema de monitoreo.
            Responderemos juntos de forma conversacional.
          </p>
        </div>

        <button
          onClick={startInterview}
          className="bg-navy-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-navy-700 transition-all"
        >
          Comenzar Entrevista
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-navy-600 text-white p-4">
        <h2 className="text-lg font-bold">🤖 Entrevista Agéntica - Colectores de Vibración</h2>
        <p className="text-navy-200 text-sm">Pregunta {currentQuestionIndex + 1} de {QUESTIONS.length}</p>
      </div>

      <div className="h-96 overflow-y-auto p-4 space-y-4 bg-navy-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs md:max-w-md px-4 py-3 rounded-xl ${
                msg.role === 'user'
                  ? 'bg-navy-600 text-white rounded-br-none'
                  : 'bg-white text-navy-800 border border-navy-200 rounded-bl-none'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-navy-200 rounded-xl rounded-bl-none px-4 py-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-navy-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-navy-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-navy-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-navy-200 bg-white">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe tu respuesta..."
            className="flex-1 px-4 py-3 rounded-xl border border-navy-200 focus:border-navy-500 focus:ring-2 focus:ring-navy-200 outline-none"
            disabled={isTyping}
          />
          <button
            onClick={sendMessage}
            disabled={!currentInput.trim() || isTyping}
            className="bg-navy-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-navy-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Enviar
          </button>
        </div>

        {currentQuestionIndex >= QUESTIONS.length && (
          <button
            onClick={handleComplete}
            className="w-full mt-4 bg-green-600 text-white py-4 rounded-xl font-semibold hover:bg-green-700 transition-all"
          >
            Continuar al Resumen
          </button>
        )}
      </div>
    </div>
  )
}
