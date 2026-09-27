import { AnimatePresence, motion, useSpring } from 'motion/react'
import { type CSSProperties, useEffect, useState } from 'react'
import { EASE } from '@/components/marketing/motion'

const MES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
const TARGET = 12000
const MIN = 300
const MAX = 3000

export function GoalSimulator() {
  const [per, setPer] = useState(1000)
  const months = Math.ceil(TARGET / per)
  const d = new Date()
  d.setMonth(d.getMonth() + months)
  const pct = Math.min(1, per / (TARGET / 6))
  const fill = useSpring(pct, { stiffness: 260, damping: 30 })
  useEffect(() => fill.set(pct), [fill, pct])

  return (
    <>
      <p className="mb-2.5 text-[.85rem] font-semibold text-accent-deep">Metas de economia</p>
      <h4 className="mb-1 font-display text-[1.2rem] font-semibold">Simule e veja a data mudar na hora</h4>
      <p className="text-[.94rem] text-ink-soft">Arrasta quanto dá pra guardar por mês. O Fôlego te diz exatamente quando você chega. Experimenta aqui 👇</p>
      <div className="mt-5 rounded-control border border-line bg-surface-soft p-4 text-[.98rem]">
        <div className="flex items-baseline justify-between">
          <label htmlFor="goal-slider" className="text-[.9rem] text-ink-soft">
            Guardar por mês
          </label>
          <span className="font-display text-[1.5rem] font-bold tabular-nums">R$ {per.toLocaleString('pt-BR')}</span>
        </div>
        <input
          id="goal-slider"
          type="range"
          min={MIN}
          max={MAX}
          step={100}
          value={per}
          onChange={(e) => setPer(+e.target.value)}
          className="range mt-3.5 mb-1"
          style={{ '--fill': `${((per - MIN) / (MAX - MIN)) * 100}%` } as CSSProperties}
        />
        <p className="mt-2.5" aria-live="polite">
          Você chega na sua reserva em{' '}
          <span className="relative inline-flex overflow-hidden align-bottom">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.b
                key={months}
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '-100%', opacity: 0 }}
                transition={{ duration: 0.22, ease: EASE }}
                className="inline-block text-accent-deep"
              >
                {months} meses
              </motion.b>
            </AnimatePresence>
          </span>{' '}
          — lá por {MES[d.getMonth()]}/{d.getFullYear()}.
        </p>
        <div className="mt-3 mb-1.5 h-2.25 overflow-hidden rounded-pill bg-line">
          <motion.span className="block h-full origin-left rounded-pill bg-accent" style={{ scaleX: fill }} />
        </div>
        <div className="flex justify-between text-[.78rem] text-ink-soft">
          <span>meta: reserva de 3 meses</span>
          <span>R$ {TARGET.toLocaleString('pt-BR')}</span>
        </div>
      </div>
    </>
  )
}
