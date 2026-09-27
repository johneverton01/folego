import { animate, motion, useInView, useReducedMotion, useScroll, useSpring, type Variants } from 'motion/react'
import { type ReactNode, type RefObject, useEffect, useRef } from 'react'

// Curva de chegada confiante (desaceleração exponencial) — a mesma em todo o site.
export const EASE = [0.16, 1, 0.3, 1] as const
const VIEWPORT = { once: true, margin: '0px 0px -8% 0px' }

export const item: Variants = {
  hidden: { opacity: 0, y: 18, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: EASE } },
}

/** Um bloco que sobe e ganha foco quando entra na tela. */
export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      variants={item}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}

/** Container de lista: filhos com `variants={item}` entram em cascata (atraso total limitado). */
export function Stagger({ children, className, gap = 0.08 }: { children: ReactNode; className?: string; gap?: number }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}
    >
      {children}
    </motion.div>
  )
}

/** Número que conta até o valor quando aparece. Com movimento reduzido, mostra o valor direto. */
export function CountUp({
  to,
  format,
  duration = 1.4,
  delay = 0,
}: {
  to: number
  format: (v: number) => string
  duration?: number
  delay?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const reduce = useReducedMotion()
  const fmt = useRef(format)
  fmt.current = format

  useEffect(() => {
    const el = ref.current
    if (!inView || !el) return
    if (reduce) {
      el.textContent = fmt.current(to)
      return
    }
    const ctrl = animate(0, to, { duration, delay, ease: EASE, onUpdate: (v) => { el.textContent = fmt.current(v) } })
    return () => ctrl.stop()
  }, [inView, reduce, to, duration, delay])

  return <span ref={ref}>{format(0)}</span>
}

export const brl = (v: number) => `R$ ${(Math.round(v / 100) * 100).toLocaleString('pt-BR')}`

/**
 * Salário Fantasma animado: a renda real se desenha ao entrar na tela; a linha reta do
 * salário fixo pode acompanhar o scroll — a montanha-russa vira linha reta enquanto você lê.
 */
export function GhostChart({
  income,
  w,
  h,
  scrollLinked = false,
  delay = 0,
}: {
  income: number[]
  w: number
  h: number
  scrollLinked?: boolean
  delay?: number
}) {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref as RefObject<HTMLElement | null>, offset: ['start end', 'center 55%'] })
  const flatProgress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 })

  const pad = 6
  const n = income.length
  const avg = income.reduce((a, b) => a + b, 0) / n
  const max = Math.max(...income) * 1.1
  const min = Math.min(...income) * 0.55
  const X = (i: number) => pad + (i * (w - 2 * pad)) / (n - 1)
  const Y = (v: number) => h - pad - ((v - min) / (max - min)) * (h - 2 * pad)
  const path = (a: number[]) => a.map((v, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)} ${Y(v).toFixed(1)}`).join(' ')
  const flat = path(income.map(() => avg))

  const drawn = reduce ? { pathLength: 1 } : { pathLength: 0 }
  const draw = (d: number) =>
    inView ? { pathLength: 1, transition: { duration: 1.6, delay: delay + d, ease: EASE } } : undefined

  return (
    <svg ref={ref} viewBox={`0 0 ${w} ${h}`} width="100%" preserveAspectRatio="none" className="block overflow-visible" aria-hidden="true">
      <motion.path
        d={path(income)}
        className="fill-none stroke-amber opacity-90"
        strokeWidth={2.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        initial={drawn}
        animate={draw(0)}
      />
      {scrollLinked && !reduce ? (
        <motion.path d={flat} className="fill-none stroke-accent" strokeWidth={3} strokeLinecap="round" style={{ pathLength: flatProgress }} />
      ) : (
        <motion.path d={flat} className="fill-none stroke-accent" strokeWidth={3} strokeLinecap="round" initial={drawn} animate={draw(0.45)} />
      )}
    </svg>
  )
}

export function Check({ size = 15, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4 12.5l5 5 11-11" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
