import { motion } from 'motion/react'
import { EASE, Stagger } from '@/components/marketing/motion'
import { SECTION, WRAP } from './constants'
import { SectionHeader } from './SectionHeader'
import { StepCard } from './StepCard'

const STEPS = [
  { n: '01', t: 'Registre o que entra e sai', d: 'Lance suas entradas e gastos em segundos, sem taguear tudo. O painel se organiza sozinho.' },
  { n: '02', t: 'Veja seu fôlego', d: 'Descubra por quantos meses você aguenta se a renda zerar — a métrica que importa quando o holerite não é fixo.' },
  { n: '03', t: 'Crie uma meta simples', d: 'Uma de cada vez, com data real. O coach te dá o próximo passo e ajusta conforme sua renda muda.' },
]

export function ComoFuncionaSection() {
  return (
    <section id="como" className={SECTION}>
      <div className={WRAP}>
        <SectionHeader eyebrow="Como funciona" title="Do caos à previsibilidade em 3 passos" center />
        <Stagger className="relative mt-10 grid gap-4 min-[900px]:grid-cols-3 min-[900px]:gap-6" gap={0.15}>
          {/* linha que conecta os passos, desenhada da esquerda pra direita */}
          <motion.div
            aria-hidden="true"
            variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 1.2, ease: EASE } } }}
            className="absolute top-[2.2rem] right-0 left-18 hidden h-px origin-left bg-linear-to-r from-accent/50 via-line to-transparent min-[900px]:block"
          />
          {STEPS.map((s) => (
            <StepCard key={s.n} number={s.n} title={s.t} text={s.d} />
          ))}
        </Stagger>
      </div>
    </section>
  )
}
