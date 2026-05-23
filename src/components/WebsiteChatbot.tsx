'use client'
import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Sparkles, Loader2 } from 'lucide-react'
import { CHAT_API_URL } from '@/lib/site-config'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const STARTER_QUESTIONS = [
  'Quanto costa Fibonacci?',
  'Come funziona la dettatura AI?',
  'Posso provare la demo?',
  'Quali specialità sono supportate?',
] as const

const INITIAL_MESSAGES: Message[] = [
  {
    role: 'assistant',
    content:
      'Ciao, sono l\'assistente AI di Fibonacci. Chiedimi qualunque cosa sul prodotto: prezzi, funzionalità, GDPR, demo. Sono qui per aiutarti.',
  },
]

export function WebsiteChatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll all'ultimo messaggio
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading])

  // Auto-focus input quando si apre
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 200)
    }
  }, [open])

  async function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    const newUserMsg: Message = { role: 'user', content: trimmed }
    setMessages((prev) => [...prev, newUserMsg])
    setInput('')
    setLoading(true)
    setError(null)

    try {
      // Cronologia: ultimi 8 msg per non sovraccaricare token (LLM accetta max 10)
      const history = [...messages, newUserMsg].slice(-8).slice(0, -1) // escludi l'ultimo (è il msg corrente)

      const resp = await fetch(CHAT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history,
        }),
      })

      if (resp.status === 429) {
        throw new Error('Troppe domande in poco tempo. Riprova fra qualche minuto.')
      }
      if (!resp.ok) {
        const errText = await resp.text().catch(() => '')
        throw new Error(errText || `Errore ${resp.status}`)
      }

      const data = await resp.json()
      const assistantMsg: Message = {
        role: 'assistant',
        content: data.response || 'Mi dispiace, non sono riuscito a risponderti.',
      }
      setMessages((prev) => [...prev, assistantMsg])
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Errore di rete'
      setError(msg)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Mi dispiace, ho avuto un problema: ${msg}. Puoi scrivere direttamente a [info@fibonacci.it](mailto:info@fibonacci.it).`,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    send(input)
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(true)}
            aria-label="Apri assistente AI Fibonacci"
            className="fixed bottom-5 right-5 z-50 flex items-center gap-2 pl-4 pr-5 py-3 rounded-full text-sm font-semibold text-white shadow-2xl transition-transform hover:scale-105"
            style={{ background: 'var(--fg)' }}
          >
            <Sparkles className="w-4 h-4" style={{ color: '#f0d27a' }} />
            <span className="hidden sm:inline">Chiedi all&apos;AI</span>
            <span className="sm:hidden">AI</span>
            <span
              className="ml-1 w-2 h-2 rounded-full animate-pulse"
              style={{ background: '#f0d27a' }}
              aria-hidden="true"
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Drawer chat */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="fixed bottom-5 right-5 z-50 w-[calc(100vw-2.5rem)] sm:w-[420px] max-h-[calc(100vh-3rem)] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            role="dialog"
            aria-label="Assistente AI Fibonacci"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 shrink-0"
              style={{ background: 'var(--fg)', color: 'white' }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(240, 210, 122, 0.2)' }}
                >
                  <Sparkles className="w-4 h-4" style={{ color: '#f0d27a' }} />
                </div>
                <div>
                  <p className="text-sm font-semibold">Assistente Fibonacci</p>
                  <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    Powered by Mistral AI
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Chiudi chat"
                className="p-1.5 rounded-lg transition-colors hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messaggi */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3"
              style={{ background: 'var(--bg)', minHeight: '300px', maxHeight: '460px' }}
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className="max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed"
                    style={
                      msg.role === 'user'
                        ? {
                            background: 'var(--fg)',
                            color: 'white',
                            borderBottomRightRadius: '4px',
                          }
                        : {
                            background: 'var(--card)',
                            color: 'var(--fg)',
                            border: '1px solid var(--border)',
                            borderBottomLeftRadius: '4px',
                          }
                    }
                  >
                    {msg.role === 'assistant' ? (
                      <div className="prose-chat">
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => <p className="m-0 mb-1.5 last:mb-0">{children}</p>,
                            a: ({ href, children }) => (
                              <a
                                href={href}
                                className="underline underline-offset-2 font-medium"
                                style={{ color: 'var(--accent)' }}
                                target={href?.startsWith('http') ? '_blank' : undefined}
                                rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                              >
                                {children}
                              </a>
                            ),
                            ul: ({ children }) => <ul className="list-disc pl-4 my-1">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal pl-4 my-1">{children}</ol>,
                            li: ({ children }) => <li className="mb-0.5">{children}</li>,
                            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                            code: ({ children }) => (
                              <code
                                className="px-1 py-0.5 rounded text-[0.85em] font-mono"
                                style={{ background: 'var(--bg)' }}
                              >
                                {children}
                              </code>
                            ),
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {loading && (
                <div className="flex justify-start">
                  <div
                    className="px-3.5 py-2.5 rounded-2xl rounded-bl-sm flex items-center gap-2"
                    style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
                  >
                    <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: 'var(--muted)' }} />
                    <span className="text-xs" style={{ color: 'var(--muted)' }}>
                      Sto pensando...
                    </span>
                  </div>
                </div>
              )}

              {/* Starter questions (visible solo al primo msg) */}
              {messages.length === 1 && !loading && (
                <div className="flex flex-col gap-1.5 mt-2">
                  <p
                    className="text-[10px] font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--muted)' }}
                  >
                    Inizia da qui
                  </p>
                  {STARTER_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="text-left text-xs px-3 py-2 rounded-lg transition-colors hover:bg-[var(--card)]"
                      style={{
                        background: 'var(--card)',
                        border: '1px solid var(--border)',
                        color: 'var(--fg)',
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input form */}
            <form
              onSubmit={handleSubmit}
              className="flex items-end gap-2 p-3 shrink-0"
              style={{ background: 'var(--card)', borderTop: '1px solid var(--border)' }}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Scrivi una domanda..."
                rows={1}
                maxLength={500}
                aria-label="Messaggio per assistente AI"
                className="flex-1 px-3 py-2 rounded-lg text-sm resize-none outline-none focus:ring-2 max-h-24"
                style={{
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  color: 'var(--fg)',
                }}
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Invia messaggio"
                className="p-2.5 rounded-lg text-white transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: 'var(--fg)' }}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Footer disclaimer */}
            <p
              className="text-[10px] px-3 pb-2 leading-tight text-center"
              style={{ background: 'var(--card)', color: 'var(--muted)' }}
            >
              Risposte generate da AI. Per consigli clinici consulta sempre un medico.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
