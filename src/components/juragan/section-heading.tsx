'use client'

import { motion } from 'framer-motion'

interface Props {
  eyebrow: string
  title: string
  subtitle?: string
  dark?: boolean
}

export default function SectionHeading({ eyebrow, title, subtitle, dark }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className="mx-auto max-w-2xl text-center"
    >
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest ${
          dark ? 'bg-white/10 text-orange-400' : 'bg-orange-100 text-orange-700'
        }`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse-soft" />
        {eyebrow}
      </span>
      <h2 className={`mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight ${dark ? 'text-white' : 'text-zinc-900'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-3 text-sm sm:text-base leading-relaxed ${dark ? 'text-zinc-400' : 'text-muted-foreground'}`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
