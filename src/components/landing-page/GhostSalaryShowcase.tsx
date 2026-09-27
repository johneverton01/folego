import { motion } from 'motion/react'
import { Check, GhostChart, item, Reveal, Stagger } from '@/components/marketing/motion'
import { ChartLegend } from './ChartLegend'
import { RENDA } from './constants'

const BENEFITS = ['Você “recebe” o mesmo todo mês', 'O excedente vira reserva automática', 'A montanha-russa fica invisível pro seu dia a dia']

export function GhostSalaryShowcase() {
  return (
    <div className="mt-10 grid items-center gap-[clamp(2rem,5vw,3.5rem)] min-[900px]:grid-cols-[.95fr_1.05fr]">
      <Stagger gap={0.1}>
        <motion.p variants={item} className="mb-2.5 text-[.85rem] font-semibold text-accent-deep">
          O recurso que muda o jogo
        </motion.p>
        <motion.h3 variants={item} className="font-display text-[clamp(1.6rem,3vw,2.1rem)] font-bold tracking-[-.02em]">
          Salário Fantasma
        </motion.h3>
        <motion.p variants={item} className="mt-4 text-[1.05rem] text-ink-soft">
          O Fôlego calcula um “salário” fixo saudável a partir da sua média e guarda o que passa disso nos meses gordos. Sua vida financeira anda numa linha reta, mesmo com a renda pulando.
        </motion.p>
        {BENEFITS.map((t) => (
          <motion.div key={t} variants={item} className="mt-4 flex gap-2.5 text-[.98rem]">
            <Check size={18} className="mt-0.5 flex-none text-accent" /> {t}
          </motion.div>
        ))}
      </Stagger>
      <Reveal className="-order-1 rounded-card border border-line bg-surface p-6 shadow-lift min-[900px]:order-0">
        <ChartLegend className="mb-3 gap-5 text-[.78rem]" />
        <GhostChart income={RENDA} w={520} h={170} scrollLinked />
      </Reveal>
    </div>
  )
}
