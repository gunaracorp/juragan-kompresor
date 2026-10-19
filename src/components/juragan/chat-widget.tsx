'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, SendHorizonal, Bot, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useJuragan } from '@/lib/store'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

const QUICK_CHIPS = [
  'Kompresor 1 PK R32 yang cocok apa?',
  'Bedanya rotary dan scroll?',
  'MCB sering jatuh, kenapa ya?',
  'Ada harga grosir untuk teknisi?',
]

const GREETING: ChatMessage = {
  role: 'assistant',
  content:
    'Assalamualaikum Juragan! 👋 Aku Tanya Juragan — AI ahli kompresor dari 46 dewan pakar. Tanya apa aja: rekomendasi kompresor, beda teknologi, gejala kerusakan, atau harga. Aku standby 24 jam!',
}

/** Render markdown ringan: **bold**, bullet "- ", dan baris baru */
function RichText({ text }: { text: string }) {
  const lines = text.split('\n')
  return (
    <>
      {lines.map((line, li) => {
        const parts = line.split(/(\*\*[^*]+\*\*)/g)
        const rendered = parts.map((part, pi) =>
          part.startsWith('**') && part.endsWith('**') ? (
            <strong key={pi} className="font-extrabold">{part.slice(2, -2)}</strong>
          ) : (
            <span key={pi}>{part}</span>
          ),
        )
        const isBullet = /^\s*[-•]\s+/.test(line)
        return (
          <span key={li} className="block">
            {isBullet ? <span className="pl-2.5">• {rendered.slice(1)}</span> : rendered.length > 0 ? rendered : '\u00A0'}
          </span>
        )
      })}
    </>
  )
}

export default function ChatWidget() {
  const chatOpen = useJuragan((s) => s.chatOpen)
  const setChatOpen = useJuragan((s) => s.setChatOpen)
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading, chatOpen])

  const send = async (text: string) => {
    const content = text.trim()
    if (!content || loading) return
    const next = [...messages, { role: 'user' as const, content }]
    setMessages(next)
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next
            .filter((m) => m.role !== 'assistant' || m !== GREETING)
            .slice(-10)
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'AI sedang sibuk')
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }])
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menghubungi AI')
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Waduh, koneksi aku lagi lemah 😅 Coba ulangi pertanyaannya ya, Juragan!' },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Tombol floating */}
      <motion.button
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-2xl shadow-orange-600/40"
        aria-label={chatOpen ? 'Tutup chat Tanya Juragan' : 'Buka chat Tanya Juragan'}
      >
        <AnimatePresence mode="wait">
          {chatOpen ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="h-6 w-6" />
            </motion.span>
          ) : (
            <motion.span key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle className="h-6 w-6" />
            </motion.span>
          )}
        </AnimatePresence>
        {!chatOpen && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white">
            <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
          </span>
        )}
      </motion.button>

      {/* Panel chat */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-24 right-5 z-50 flex h-[520px] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl"
            role="dialog"
            aria-label="Chat dengan Tanya Juragan AI"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-zinc-100 bg-gradient-to-r from-orange-600 to-amber-500 px-4 py-3.5 text-white">
              <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <Bot className="h-5 w-5" />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-orange-500 bg-emerald-400" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-extrabold">Tanya Juragan</p>
                <p className="text-[11px] font-semibold text-orange-100">Online · Ditenagai 46 Dewan Pakar</p>
              </div>
              <Sparkles className="h-5 w-5 text-orange-200" />
            </div>

            {/* Pesan */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto scrollbar-thin bg-zinc-50 px-3.5 py-4">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed shadow-sm ${
                      m.role === 'user'
                        ? 'rounded-br-md bg-gradient-to-r from-orange-600 to-amber-500 font-semibold text-white'
                        : 'rounded-bl-md border border-zinc-100 bg-white text-zinc-700'
                    }`}
                  >
                    {m.role === 'assistant' ? <RichText text={m.content} /> : m.content}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="dot-typing rounded-2xl rounded-bl-md border border-zinc-100 bg-white px-4 py-3 text-orange-500 shadow-sm" aria-label="AI sedang mengetik">
                    <span /><span /><span />
                  </div>
                </div>
              )}
            </div>

            {/* Quick chips */}
            {messages.length <= 2 && !loading && (
              <div className="flex gap-1.5 overflow-x-auto border-t border-zinc-100 px-3 py-2.5 scrollbar-thin">
                {QUICK_CHIPS.map((c) => (
                  <button
                    key={c}
                    onClick={() => send(c)}
                    className="whitespace-nowrap rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-[11px] font-bold text-orange-700 transition hover:bg-orange-100"
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={(e) => { e.preventDefault(); send(input) }}
              className="flex items-center gap-2 border-t border-zinc-100 bg-white p-3"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tanya apa saja tentang kompresor…"
                className="h-10 flex-1 rounded-full border-zinc-200 bg-zinc-50 text-sm"
                aria-label="Tulis pesan untuk Tanya Juragan"
                maxLength={500}
              />
              <Button
                type="submit"
                size="icon"
                disabled={loading || !input.trim()}
                className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-md disabled:opacity-40"
                aria-label="Kirim pesan"
              >
                <SendHorizonal className="h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
