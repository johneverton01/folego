import type { ReactNode } from 'react'
import { Reveal } from '@/components/marketing/motion'
import { cn } from '@/lib/cn'

export function SectionHeader({ eyebrow, title, children, center }: { eyebrow: string; title: string; children?: ReactNode; center?: boolean }) {
  return (
    <Reveal className={cn('max-w-[60ch]', center && 'mx-auto text-center')}>
      <p className="mb-2.5 text-[.85rem] font-semibold text-accent-deep">{eyebrow}</p>
      <h2 className="font-display text-[clamp(1.9rem,4vw,2.7rem)] leading-[1.08] font-bold tracking-tight text-balance">{title}</h2>
      {children && <p className="mt-3.5 text-[1.08rem] text-ink-soft">{children}</p>}
    </Reveal>
  )
}
