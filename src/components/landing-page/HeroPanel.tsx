import { motion, useReducedMotion, useSpring } from 'motion/react'
import type { PointerEvent } from 'react'
import { brl, CountUp, EASE, GhostChart } from '@/components/marketing/motion'
import { cn } from '@/lib/cn'
import { ChartLegend } from './ChartLegend'
import { RENDA } from './constants'
import { FloatBadge } from './FloatBadge'

const SUMMARY = [
  { k: 'Entrou', v: 8500 },
  { k: 'Saiu', v: 6900 },
  { k: 'Sobrou', v: 1600, pos: true },
]

export function HeroPanel() {
  const reduce = useReducedMotion()

  // Inclinação sutil do painel acompanhando o ponteiro.
  const rx = useSpring(0, { stiffness: 150, damping: 18 })
  const ry = useSpring(0, { stiffness: 150, damping: 18 })
  function tilt(e: PointerEvent<HTMLDivElement>) {
    if (reduce || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 7)
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 7)
  }
  function untilt() {
    rx.set(0)
    ry.set(0)
  }

  return (
    <motion.div
      onPointerMove={tilt}
      onPointerLeave={untilt}
      style={{ rotateX: rx, rotateY: ry }}
      initial={{ opacity: 0, y: 40, scale: 0.96, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
      className="relative rounded-card border border-line bg-surface p-[1.4rem] shadow-lift"
    >
      <FloatBadge className="-top-3.5 right-[18px] text-accent-deep" delay={1.5}>
        <span className="size-2 rounded-full bg-current" /> +R$ 1.600 essa semana
      </FloatBadge>
      <FloatBadge className="-bottom-3.5 left-[22px] text-amber" delay={1.75}>
        🔔 delivery 2× esse mês
      </FloatBadge>

      <div className="mb-4 flex items-center gap-2 text-[.78rem] text-ink-faint">
        <span className="flex gap-1.5">
          <i className="size-[9px] rounded-full bg-line" />
          <i className="size-[9px] rounded-full bg-line" />
          <i className="size-[9px] rounded-full bg-line" />
        </span>
        Painel · setembro
      </div>
      <div className="flex items-end justify-between gap-4">
        <div className="font-display text-[clamp(2rem,5vw,2.8rem)] leading-[.95] font-bold tracking-[-.03em]">
          <CountUp to={2.3} delay={0.7} format={(v) => v.toFixed(1).replace('.', ',')} />
          <small className="mt-1.5 block text-[.34em] font-semibold tracking-normal text-ink-soft">meses de fôlego</small>
        </div>
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-pill bg-accent-wash px-2.5 py-1 text-[.82rem] font-semibold text-accent-deep">
          <span className="size-2 rounded-full bg-current" /> Mês no verde
        </span>
      </div>
      <div className="my-[1.1rem] grid grid-cols-3 gap-px overflow-hidden rounded-control border border-line bg-line">
        {SUMMARY.map((c) => (
          <div key={c.k} className="bg-surface px-3 py-2.5">
            <div className="text-[.72rem] text-ink-soft">{c.k}</div>
            <div className={cn('mt-0.5 font-mono text-base font-semibold tabular-nums tracking-[-.02em]', c.pos && 'text-accent-deep')}>
              <CountUp to={c.v} delay={0.8} format={brl} />
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-control border border-line bg-surface-soft px-4 py-3.5">
        <ChartLegend />
        <GhostChart income={RENDA} w={320} h={88} delay={0.9} />
      </div>
    </motion.div>
  )
}
