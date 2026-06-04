import React, { useState, useEffect, useRef, useCallback } from 'react'
import { SparklesIcon, ArrowRightIcon, CheckIcon, LightbulbIcon } from './Icons'
import { runAssistantTurn, getAssistantSchema, isAssistantConfigured } from '../services/geminiService'

function getByPath(obj, path) {
  const [section, field] = path.split('.')
  return obj?.[section]?.[field]
}

function formatDetected(value) {
  if (value === null || value === undefined || value === '') return null
  if (typeof value === 'number') return value.toLocaleString('es-CO')
  return String(value)
}

export default function AIAssistant({
  formData,
  calculationType,
  serviceType,
  applyInferredFields,
  onClose
}) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [complete, setComplete] = useState(false)
  const [error, setError] = useState(null)
  const [showFields, setShowFields] = useState(false)
  const startedRef = useRef(false)
  const scrollRef = useRef(null)

  const currency = formData.currency || 'COP'
  const schema = getAssistantSchema(calculationType, serviceType, currency)
  const configured = isAssistantConfigured()

  const detected = schema
    .map(([path, desc]) => ({ path, desc, value: getByPath(formData, path) }))
    .filter(item => formatDetected(item.value) !== null)

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    })
  }, [])

  const runTurn = useCallback(async (userMessage, history) => {
    setLoading(true)
    setError(null)
    try {
      const result = await runAssistantTurn({
        history,
        userMessage,
        calculationType,
        serviceType,
        currency
      })
      if (result?.fields && Object.keys(result.fields).length > 0) {
        applyInferredFields(result.fields)
      }
      const replyText = result?.reply || 'Continuemos.'
      setMessages(prev => [...prev, { role: 'assistant', content: replyText }])
      if (result?.complete) setComplete(true)
    } catch (e) {
      console.error(e)
      setError(e?.message || 'No pude conectar con el asistente. Verifica la clave de API o tu conexión, e inténtalo de nuevo.')
    } finally {
      setLoading(false)
      scrollToBottom()
    }
  }, [applyInferredFields, calculationType, serviceType, currency, scrollToBottom])

  useEffect(() => {
    if (startedRef.current || !configured) return
    startedRef.current = true
    runTurn(null, [])
  }, [configured, runTurn])

  const handleSend = () => {
    const text = input.trim()
    if (!text || loading) return
    const userMsg = { role: 'user', content: text }
    const history = [...messages, userMsg]
    setMessages(history)
    setInput('')
    scrollToBottom()
    runTurn(text, [...messages, userMsg])
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="w-80 lg:w-96 shrink-0 bg-white border border-slate-200 shadow-lg flex flex-col h-[calc(100vh-120px)] sticky top-24 rounded-2xl overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-amaq-800 to-amaq-600 text-white p-4 relative overflow-hidden shrink-0">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
              <SparklesIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Asistente IA</h3>
              <p className="text-xs text-amaq-200">Entrevista guiada para tu ROI</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-sm font-medium px-2 py-1 rounded hover:bg-white/10 transition-colors"
              title="Cerrar asistente y editar manualmente"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Detected fields */}
      <div className="border-b border-slate-200 bg-slate-50 shrink-0">
        <button
          onClick={() => setShowFields(s => !s)}
          className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <span className="flex items-center gap-2">
            <CheckIcon className="w-4 h-4 text-green-600" />
            Campos detectados ({detected.length})
          </span>
          <span className="text-xs text-slate-400">{showFields ? 'ocultar' : 'ver'}</span>
        </button>
        {showFields && (
          <div className="px-4 pb-3 max-h-40 overflow-y-auto">
            {detected.length === 0 ? (
              <p className="text-xs text-slate-400">Aún no se han detectado datos. Responde las preguntas del asistente.</p>
            ) : (
              <ul className="space-y-1">
                {detected.map(item => (
                  <li key={item.path} className="text-xs flex items-start justify-between gap-2">
                    <span className="text-slate-500 truncate" title={item.desc}>{item.desc.split('(')[0].trim()}</span>
                    <span className="font-bold text-slate-800 whitespace-nowrap">{formatDetected(item.value)}</span>
                  </li>
                ))}
              </ul>
            )}
            <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
              <LightbulbIcon className="w-3 h-3 shrink-0" />
              Puedes cerrar el asistente y editar cualquier campo a mano cuando quieras.
            </p>
          </div>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto bg-white space-y-3">
        {!configured && (
          <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3 space-y-2">
            <p className="font-semibold">El asistente no está configurado.</p>
            <p>
              Obtén una clave gratuita de Groq en{' '}
              <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer" className="underline font-semibold">console.groq.com/keys</a>.
            </p>
            <p><strong>En local:</strong> pégala en el archivo <code className="font-mono">.env</code> como <code className="font-mono">VITE_GROQ_API_KEY=tu_clave</code> y reinicia el servidor.</p>
            <p><strong>En Vercel:</strong> ve a <em>Project → Settings → Environment Variables</em>, añade <code className="font-mono">VITE_GROQ_API_KEY</code> con tu clave y haz un nuevo deploy.</p>
          </div>
        )}
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-snug whitespace-pre-wrap ${
              m.role === 'user'
                ? 'bg-amaq-600 text-white rounded-br-sm'
                : 'bg-slate-100 text-slate-800 rounded-bl-sm'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 text-slate-500 rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-sm">
              <span className="inline-flex gap-1">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            </div>
          </div>
        )}
        {error && (
          <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">{error}</div>
        )}
        {complete && !loading && (
          <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
            <CheckIcon className="w-4 h-4 mt-0.5 shrink-0" />
            <span>Ya hay datos suficientes. Puedes cerrar el asistente, revisar los campos y calcular el ROI.</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t border-slate-200 shrink-0">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!configured || loading}
            rows={1}
            placeholder={configured ? 'Escribe tu respuesta...' : 'Asistente no configurado'}
            className="flex-1 resize-none bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amaq-400 focus:ring-2 focus:ring-amaq-200 transition-all disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!configured || loading || !input.trim()}
            className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-r from-amaq-700 to-amaq-500 text-white flex items-center justify-center shadow-sm disabled:opacity-40 transition-all hover:from-amaq-600 hover:to-amaq-400"
            title="Enviar"
          >
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
