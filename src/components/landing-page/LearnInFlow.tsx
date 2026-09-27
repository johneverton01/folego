import { motion } from 'motion/react'
import { item, Stagger } from '@/components/marketing/motion'

const LESSONS = [
  { tg: 'A base de tudo', t: 'Reserva de emergência', d: 'Dinheiro parado pra uns 3 meses, caso um cliente suma.' },
  { tg: 'O boleto chato', t: 'DAS e impostos', d: 'Separe a fatia assim que o dinheiro cai — o susto some.' },
]

export function LearnInFlow() {
  return (
    <>
      <p className="mb-2.5 text-[.85rem] font-semibold text-accent-deep">Aprender no fluxo</p>
      <h4 className="mb-1 font-display text-[1.2rem] font-semibold">Educação sem aula chata</h4>
      <p className="mb-5 text-[.94rem] text-ink-soft">
        Um conceito por vez, explicado no momento que importa — quando o boleto aparece, não num curso à parte.
      </p>
      <Stagger className="grid gap-3" gap={0.12}>
        {LESSONS.map((l) => (
          <motion.div
            key={l.t}
            variants={item}
            whileHover={{ x: 4 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="rounded-control border border-line bg-surface-soft px-4 py-3.5 transition-colors hover:border-accent/40"
          >
            <div className="mb-1.5 text-[.74rem] font-semibold text-accent-deep">{l.tg}</div>
            <h5 className="mb-1 font-display text-[1.02rem] font-semibold">{l.t}</h5>
            <p className="text-[.86rem] text-ink-soft">{l.d}</p>
          </motion.div>
        ))}
      </Stagger>
    </>
  )
}
