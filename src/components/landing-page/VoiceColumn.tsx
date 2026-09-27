import { motion } from 'motion/react'
import { item, Reveal, Stagger } from '@/components/marketing/motion'
import { cn } from '@/lib/cn'

export function VoiceColumn({ yes, heading, items, delay }: { yes: boolean; heading: string; items: string[]; delay?: number }) {
  return (
    <Reveal delay={delay} className="overflow-hidden rounded-card border border-line bg-surface">
      <div className={cn('px-5 py-3 text-[.92rem] font-semibold', yes ? 'bg-accent-wash text-accent-deep' : 'bg-danger-wash text-danger')}>{heading}</div>
      <Stagger className="flex flex-col gap-3 px-5 py-4" gap={0.1}>
        {items.map((t) => (
          <motion.p key={t} variants={item} className="relative pl-6 text-[.95rem]">
            <span className={cn('absolute left-0 font-bold', yes ? 'text-accent' : 'text-danger')} aria-hidden="true">
              {yes ? '✓' : '✕'}
            </span>
            {t}
          </motion.p>
        ))}
      </Stagger>
    </Reveal>
  )
}
